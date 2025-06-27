<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration fixes the triggers to properly handle conflicts when:
     * 1. Different programs have overlapping academic calendar periods
     * 2. Same day of the week
     * 3. Overlapping time slots
     * 4. Same resource (lecturer, room, or class)
     */
    public function up(): void
    {
        // Drop existing triggers
        DB::unprepared('DROP TRIGGER IF EXISTS check_room_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_lecturer_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_class_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_room_availability_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS check_lecturer_availability_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS check_class_availability_before_update');

        // Room availability check for INSERT
        DB::unprepared("
            CREATE TRIGGER check_room_availability_before_insert
            BEFORE INSERT ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'Room is not available for this time slot - conflicts with existing schedule during overlapping academic periods')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.room_code = NEW.room_code
                    AND ls.day = NEW.day
                    AND (
                        -- Check if academic calendar periods overlap
                        ac_existing.start_date < ac_new.end_date 
                        AND ac_existing.end_date > ac_new.start_date
                    )
                    AND (
                        -- Check if time slots overlap
                        ls.start_time < NEW.end_time 
                        AND ls.end_time > NEW.start_time
                    )
                );
            END;
        ");

        // Lecturer availability check for INSERT
        DB::unprepared("
            CREATE TRIGGER check_lecturer_availability_before_insert
            BEFORE INSERT ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'Lecturer is not available for this time slot - conflicts with existing schedule during overlapping academic periods')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.lecturer_id = NEW.lecturer_id
                    AND ls.day = NEW.day
                    AND (
                        -- Check if academic calendar periods overlap
                        ac_existing.start_date < ac_new.end_date 
                        AND ac_existing.end_date > ac_new.start_date
                    )
                    AND (
                        -- Check if time slots overlap
                        ls.start_time < NEW.end_time 
                        AND ls.end_time > NEW.start_time
                    )
                );
            END;
        ");

        // Class availability check for INSERT
        DB::unprepared("
            CREATE TRIGGER check_class_availability_before_insert
            BEFORE INSERT ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'This group/class is not available for this time slot - conflicts with existing schedule during overlapping academic periods')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.class_id = NEW.class_id
                    AND ls.day = NEW.day
                    AND (
                        -- Check if academic calendar periods overlap
                        ac_existing.start_date < ac_new.end_date 
                        AND ac_existing.end_date > ac_new.start_date
                    )
                    AND (
                        -- Check if time slots overlap
                        ls.start_time < NEW.end_time 
                        AND ls.end_time > NEW.start_time
                    )
                );
            END;
        ");

        // Room availability check for UPDATE
        DB::unprepared("
            CREATE TRIGGER check_room_availability_before_update
            BEFORE UPDATE ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'Room is not available for this time slot - conflicts with existing schedule during overlapping academic periods')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.room_code = NEW.room_code
                    AND ls.day = NEW.day
                    AND (
                        -- Check if academic calendar periods overlap
                        ac_existing.start_date < ac_new.end_date 
                        AND ac_existing.end_date > ac_new.start_date
                    )
                    AND (
                        -- Check if time slots overlap
                        ls.start_time < NEW.end_time 
                        AND ls.end_time > NEW.start_time
                    )
                    AND ls.id != OLD.id  -- Exclude the current record being updated
                );
            END;
        ");

        // Lecturer availability check for UPDATE
        DB::unprepared("
            CREATE TRIGGER check_lecturer_availability_before_update
            BEFORE UPDATE ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'Lecturer is not available for this time slot - conflicts with existing schedule during overlapping academic periods')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.lecturer_id = NEW.lecturer_id
                    AND ls.day = NEW.day
                    AND (
                        -- Check if academic calendar periods overlap
                        ac_existing.start_date < ac_new.end_date 
                        AND ac_existing.end_date > ac_new.start_date
                    )
                    AND (
                        -- Check if time slots overlap
                        ls.start_time < NEW.end_time 
                        AND ls.end_time > NEW.start_time
                    )
                    AND ls.id != OLD.id  -- Exclude the current record being updated
                );
            END;
        ");

        // Class availability check for UPDATE
        DB::unprepared("
            CREATE TRIGGER check_class_availability_before_update
            BEFORE UPDATE ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'This group/class is not available for this time slot - conflicts with existing schedule during overlapping academic periods')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.class_id = NEW.class_id
                    AND ls.day = NEW.day
                    AND (
                        -- Check if academic calendar periods overlap
                        ac_existing.start_date < ac_new.end_date 
                        AND ac_existing.end_date > ac_new.start_date
                    )
                    AND (
                        -- Check if time slots overlap
                        ls.start_time < NEW.end_time 
                        AND ls.end_time > NEW.start_time
                    )
                    AND ls.id != OLD.id  -- Exclude the current record being updated
                );
            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the fixed triggers
        DB::unprepared('DROP TRIGGER IF EXISTS check_room_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_lecturer_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_class_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_room_availability_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS check_lecturer_availability_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS check_class_availability_before_update');
    }
};


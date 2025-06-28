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
     * This migration updates the triggers to include batch-specific validation
     * so that conflicts are only checked within the same batch number.
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

        // Room availability check for INSERT (batch-specific)
        DB::unprepared("
            CREATE TRIGGER check_room_availability_before_insert
            BEFORE INSERT ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'Room is not available for this time slot - conflicts with existing schedule within the same batch')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.room_code = NEW.room_code
                    AND ls.day = NEW.day
                    AND ls.batch_no = NEW.batch_no  -- Only check within same batch
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

        // Lecturer availability check for INSERT (batch-specific)
        DB::unprepared("
            CREATE TRIGGER check_lecturer_availability_before_insert
            BEFORE INSERT ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'Lecturer is not available for this time slot - conflicts with existing schedule within the same batch')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.lecturer_id = NEW.lecturer_id
                    AND ls.day = NEW.day
                    AND ls.batch_no = NEW.batch_no  -- Only check within same batch
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

        // Class availability check for INSERT (batch-specific)
        DB::unprepared("
            CREATE TRIGGER check_class_availability_before_insert
            BEFORE INSERT ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'This group/class is not available for this time slot - conflicts with existing schedule within the same batch')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.class_id = NEW.class_id
                    AND ls.day = NEW.day
                    AND ls.batch_no = NEW.batch_no  -- Only check within same batch
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

        // Room availability check for UPDATE (batch-specific)
        DB::unprepared("
            CREATE TRIGGER check_room_availability_before_update
            BEFORE UPDATE ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'Room is not available for this time slot - conflicts with existing schedule within the same batch')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.room_code = NEW.room_code
                    AND ls.day = NEW.day
                    AND ls.batch_no = NEW.batch_no  -- Only check within same batch
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

        // Lecturer availability check for UPDATE (batch-specific)
        DB::unprepared("
            CREATE TRIGGER check_lecturer_availability_before_update
            BEFORE UPDATE ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'Lecturer is not available for this time slot - conflicts with existing schedule within the same batch')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.lecturer_id = NEW.lecturer_id
                    AND ls.day = NEW.day
                    AND ls.batch_no = NEW.batch_no  -- Only check within same batch
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

        // Class availability check for UPDATE (batch-specific)
        DB::unprepared("
            CREATE TRIGGER check_class_availability_before_update
            BEFORE UPDATE ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT RAISE(ABORT, 'This group/class is not available for this time slot - conflicts with existing schedule within the same batch')
                WHERE EXISTS (
                    SELECT 1
                    FROM lecturer_schedules ls
                    JOIN academic_calendars ac_existing ON ac_existing.id = ls.sy_term_id
                    JOIN academic_calendars ac_new ON ac_new.id = NEW.sy_term_id
                    WHERE ls.class_id = NEW.class_id
                    AND ls.day = NEW.day
                    AND ls.batch_no = NEW.batch_no  -- Only check within same batch
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
        // Drop the batch-specific triggers
        DB::unprepared('DROP TRIGGER IF EXISTS check_room_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_lecturer_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_class_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_room_availability_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS check_lecturer_availability_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS check_class_availability_before_update');
        
        // Recreate the original triggers (without batch checking)
        // This restores the behavior from the previous migration
        // You can copy the trigger definitions from the previous migration if needed
    }
};

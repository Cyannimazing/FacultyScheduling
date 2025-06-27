<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop all triggers that reference academic_calendars table
        DB::unprepared('DROP TRIGGER IF EXISTS check_calendar_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_calendar_availability_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS check_room_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_room_availability_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS check_lecturer_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_lecturer_availability_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS check_class_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_class_availability_before_update');

        // Drop unique constraints
        Schema::table('academic_calendars', function (Blueprint $table) {
            $table->dropUnique('academic_calendar_start_end_date');
            $table->dropUnique('academic_calendar_school_term');
        });

        // Add the prog_id column
        Schema::table('academic_calendars', function (Blueprint $table) {
            $table->unsignedBigInteger('prog_id')->nullable()->after('end_date');
            $table->foreign('prog_id')->references('id')->on('programs')->onDelete('cascade');
        });

        // Recreate the lecturer_schedules triggers
        DB::unprepared("
            CREATE TRIGGER check_room_availability_before_insert
            BEFORE INSERT ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT
                    CASE
                        WHEN (
                            SELECT COUNT(*)
                            FROM lecturer_schedules ls
                            INNER JOIN academic_calendars ac_new ON ls.sy_term_id = ac_new.id
                            INNER JOIN academic_calendars ac_current ON NEW.sy_term_id = ac_current.id
                            WHERE ls.room_code = NEW.room_code
                            AND ls.day = NEW.day
                            AND ac_new.term_id = ac_current.term_id
                            AND ac_new.school_year = ac_current.school_year
                            AND (ls.start_time < NEW.end_time AND ls.end_time > NEW.start_time)
                        ) > 0
                        THEN RAISE(ABORT, 'Room is not available for this time slot')
                    END;
            END;
        ");

        DB::unprepared("
            CREATE TRIGGER check_lecturer_availability_before_insert
            BEFORE INSERT ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT
                    CASE
                        WHEN (
                            SELECT COUNT(*)
                            FROM lecturer_schedules ls
                            INNER JOIN academic_calendars ac_new ON ls.sy_term_id = ac_new.id
                            INNER JOIN academic_calendars ac_current ON NEW.sy_term_id = ac_current.id
                            WHERE ls.lecturer_id = NEW.lecturer_id
                            AND ls.day = NEW.day
                            AND ac_new.term_id = ac_current.term_id
                            AND ac_new.school_year = ac_current.school_year
                            AND (ls.start_time < NEW.end_time AND ls.end_time > NEW.start_time)
                        ) > 0
                        THEN RAISE(ABORT, 'Lecturer is not available for this time slot')
                    END;
            END;
        ");

        DB::unprepared("
            CREATE TRIGGER check_class_availability_before_insert
            BEFORE INSERT ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT
                    CASE
                        WHEN (
                            SELECT COUNT(*)
                            FROM lecturer_schedules ls
                            INNER JOIN academic_calendars ac_new ON ls.sy_term_id = ac_new.id
                            INNER JOIN academic_calendars ac_current ON NEW.sy_term_id = ac_current.id
                            WHERE ls.class_id = NEW.class_id
                            AND ls.day = NEW.day
                            AND ac_new.term_id = ac_current.term_id
                            AND ac_new.school_year = ac_current.school_year
                            AND (ls.start_time < NEW.end_time AND ls.end_time > NEW.start_time)
                        ) > 0
                        THEN RAISE(ABORT, 'This group is not available for this time slot')
                    END;
            END;
        ");

        DB::unprepared("
            CREATE TRIGGER check_room_availability_before_update
            BEFORE UPDATE ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT
                    CASE
                        WHEN (
                            SELECT COUNT(*)
                            FROM lecturer_schedules ls
                            INNER JOIN academic_calendars ac_new ON ls.sy_term_id = ac_new.id
                            INNER JOIN academic_calendars ac_current ON NEW.sy_term_id = ac_current.id
                            WHERE ls.room_code = NEW.room_code
                            AND ls.day = NEW.day
                            AND ac_new.term_id = ac_current.term_id
                            AND ac_new.school_year = ac_current.school_year
                            AND (ls.start_time < NEW.end_time AND ls.end_time > NEW.start_time)
                            AND ls.id != OLD.id
                        ) > 0
                        THEN RAISE(ABORT, 'Room is not available for this time slot')
                    END;
            END;
        ");

        DB::unprepared("
            CREATE TRIGGER check_lecturer_availability_before_update
            BEFORE UPDATE ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT
                    CASE
                        WHEN (
                            SELECT COUNT(*)
                            FROM lecturer_schedules ls
                            INNER JOIN academic_calendars ac_new ON ls.sy_term_id = ac_new.id
                            INNER JOIN academic_calendars ac_current ON NEW.sy_term_id = ac_current.id
                            WHERE ls.lecturer_id = NEW.lecturer_id
                            AND ls.day = NEW.day
                            AND ac_new.term_id = ac_current.term_id
                            AND ac_new.school_year = ac_current.school_year
                            AND (ls.start_time < NEW.end_time AND ls.end_time > NEW.start_time)
                            AND ls.id != OLD.id
                        ) > 0
                        THEN RAISE(ABORT, 'Lecturer is not available for this time slot')
                    END;
            END;
        ");

        DB::unprepared("
            CREATE TRIGGER check_class_availability_before_update
            BEFORE UPDATE ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT
                    CASE
                        WHEN (
                            SELECT COUNT(*)
                            FROM lecturer_schedules ls
                            INNER JOIN academic_calendars ac_new ON ls.sy_term_id = ac_new.id
                            INNER JOIN academic_calendars ac_current ON NEW.sy_term_id = ac_current.id
                            WHERE ls.class_id = NEW.class_id
                            AND ls.day = NEW.day
                            AND ac_new.term_id = ac_current.term_id
                            AND ac_new.school_year = ac_current.school_year
                            AND (ls.start_time < NEW.end_time AND ls.end_time > NEW.start_time)
                            AND ls.id != OLD.id
                        ) > 0
                        THEN RAISE(ABORT, 'This group is not available for this time slot')
                    END;
            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academic_calendars', function (Blueprint $table) {
            $table->dropForeign(['prog_id']);
            $table->dropColumn('prog_id');
        });

        // Recreate unique constraints
        Schema::table('academic_calendars', function (Blueprint $table) {
            $table->unique(['start_date', 'end_date'], 'academic_calendar_start_end_date');
            $table->unique(['term_id', 'school_year'], 'academic_calendar_school_term');
        });

        // Recreate triggers if needed (optional)
        DB::unprepared("
        CREATE TRIGGER check_calendar_availability_before_insert
        BEFORE INSERT ON academic_calendars
        FOR EACH ROW
        BEGIN
            SELECT
                CASE
                    WHEN (
                        SELECT COUNT(*)
                        FROM academic_calendars
                        WHERE (start_date < NEW.end_date AND end_date > NEW.start_date)
                    ) > 0
                    THEN RAISE(ABORT, 'Academic Calendar dates overlap with an existing calendar')
                END;
        END;
        ");

        DB::unprepared("
        CREATE TRIGGER check_calendar_availability_before_update
        BEFORE UPDATE ON academic_calendars
        FOR EACH ROW
        BEGIN
            SELECT
                CASE
                    WHEN (
                        SELECT COUNT(*)
                        FROM academic_calendars
                        WHERE id != NEW.id
                        AND (start_date < NEW.end_date AND end_date > NEW.start_date)
                    ) > 0
                    THEN RAISE(ABORT, 'Academic Calendar dates overlap with an existing calendar')
                END;
        END;
        ");
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('lecturer_schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lecturer_id');
            $table->string('prog_subj_id');
            $table->string('room_code');
            $table->unsignedBigInteger('class_id');
            $table->unsignedBigInteger('sy_term_id');
            $table->string('day');
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();

            $table->unique(['room_code', 'day', 'start_time', 'end_time', 'sy_term_id'], 'unique_room_schedule');

            // Define your foreign keys as needed...
            $table->foreign('lecturer_id')->references('id')->on('lecturers')->onDelete('cascade');
            $table->foreign('prog_subj_id')->references('id')->on('program_subjects')->onDelete('cascade');
            $table->foreign('room_code')->references('name')->on('rooms')->onDelete('cascade');
            $table->foreign('class_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreign('sy_term_id')->references('id')->on('academic_calendars')->onDelete('cascade');
        });

        // Trigger before insert
        DB::unprepared("
            CREATE TRIGGER check_room_availability_before_insert
            BEFORE INSERT ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT
                    CASE
                        WHEN (
                            SELECT COUNT(*)
                            FROM lecturer_schedules
                            WHERE room_code = NEW.room_code
                            AND day = NEW.day
                            AND sy_term_id = NEW.sy_term_id
                            AND (start_time < NEW.end_time AND end_time > NEW.start_time)
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
                            FROM lecturer_schedules
                            WHERE lecturer_id = NEW.lecturer_id
                            AND day = NEW.day
                            AND sy_term_id = NEW.sy_term_id
                            AND (start_time < NEW.end_time AND end_time > NEW.start_time)
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
                            FROM lecturer_schedules
                            WHERE class_id = NEW.class_id
                            AND day = NEW.day
                            AND sy_term_id = NEW.sy_term_id
                            AND (start_time < NEW.end_time AND end_time > NEW.start_time)
                        ) > 0
                        THEN RAISE(ABORT, 'This group is not available for this time slot')
                    END;
            END;
        ");

        // Trigger before update
        DB::unprepared("
            CREATE TRIGGER check_room_availability_before_update
            BEFORE UPDATE ON lecturer_schedules
            FOR EACH ROW
            BEGIN
                SELECT
                    CASE
                        WHEN (
                            SELECT COUNT(*)
                            FROM lecturer_schedules
                            WHERE room_code = NEW.room_code
                            AND day = NEW.day
                            AND sy_term_id = NEW.sy_term_id
                            AND (start_time < NEW.end_time AND end_time > NEW.start_time)
                            AND id != OLD.id
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
                            FROM lecturer_schedules
                            WHERE lecturer_id = NEW.lecturer_id
                            AND day = NEW.day
                            AND sy_term_id = NEW.sy_term_id
                            AND (start_time < NEW.end_time AND end_time > NEW.start_time)
                            AND id != OLD.id
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
                            FROM lecturer_schedules
                            WHERE class_id = NEW.class_id
                            AND day = NEW.day
                            AND sy_term_id = NEW.sy_term_id
                            AND (start_time < NEW.end_time AND end_time > NEW.start_time)
                            AND id != OLD.id
                        ) > 0
                        THEN RAISE(ABORT, 'This group is not available for this time slot')
                    END;
            END;
        ");
    }

    public function down()
    {
        // Drop the trigger first if needed
        DB::unprepared("DROP TRIGGER IF EXISTS check_room_availability");
        Schema::dropIfExists('lecturer_schedules');
    }

};

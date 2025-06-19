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
        Schema::create('academic_calendars', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('term_id');
            $table->string('school_year');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();

            // Unique constraint
            $table->unique(['start_date', 'end_date'], 'academic_calendar_start_end_date');
            $table->unique(['term_id', 'school_year'], 'academic_calendar_school_term');

            // Foreign key
            $table->foreign('term_id')->references('id')->on('terms')->onDelete('cascade');

        });
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_calendars');
    }
};

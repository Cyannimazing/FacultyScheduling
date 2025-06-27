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
        // Drop triggers first
        DB::unprepared('DROP TRIGGER IF EXISTS check_calendar_availability_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS check_calendar_availability_before_update');
        
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

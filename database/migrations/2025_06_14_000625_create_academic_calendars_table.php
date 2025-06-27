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
            $table->unsignedBigInteger('prog_id');
            $table->timestamps();

            // Unique constraint
            $table->unique(['start_date', 'end_date'], 'academic_calendar_start_end_date');
            $table->unique(['term_id', 'school_year'], 'academic_calendar_school_term');

            // Foreign keys
            $table->foreign('term_id')->references('id')->on('terms')->onDelete('cascade');
            $table->foreign('prog_id')->references('id')->on('programs')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_calendars');
    }
};

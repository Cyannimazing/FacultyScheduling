<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lecturer_schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lecturer_id');
            $table->string('subj_code');
            $table->string('room_code');
            $table->unsignedBigInteger('time_slot_id');
            $table->unsignedBigInteger('class_id');
            $table->unsignedBigInteger('sy_term_id');
            $table->timestamps();
            
            // Multiple unique constraints
            $table->unique(['room_code', 'time_slot_id', 'sy_term_id'], 'unique_room_timeslot_term');
            $table->unique(['lecturer_id', 'time_slot_id', 'sy_term_id'], 'unique_lecturer_timeslot_term');
            $table->unique(['class_id', 'time_slot_id', 'sy_term_id'], 'unique_class_timeslot_term');
            
            // Foreign keys
            $table->foreign('lecturer_id')->references('id')->on('lecturers')->onDelete('cascade');
            $table->foreign('subj_code')->references('code')->on('subjects')->onDelete('cascade');
            $table->foreign('room_code')->references('name')->on('rooms')->onDelete('cascade');
            $table->foreign('time_slot_id')->references('id')->on('time_slots')->onDelete('cascade');
            $table->foreign('class_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreign('sy_term_id')->references('id')->on('academic_calendars')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lecturer_schedules');
    }
};

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
        Schema::create('lecturer_subjects', function (Blueprint $table) {
            $table->unsignedBigInteger('lecturer_id');
            $table->string('subj_code');
            $table->unsignedBigInteger('sy_term_id');
            $table->timestamps();

            // Compound primary key
            $table->primary(['lecturer_id', 'subj_code', 'sy_term_id']);

            // Foreign keys
            $table->foreign('lecturer_id')->references('id')->on('lecturers')->onDelete('cascade');
            $table->foreign('subj_code')->references('code')->on('subjects')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('sy_term_id')->references('id')->on('academic_calendars')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lecturer_subjects');
    }
};

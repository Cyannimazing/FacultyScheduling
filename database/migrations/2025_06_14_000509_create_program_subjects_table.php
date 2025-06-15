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
        Schema::create('program_subjects', function (Blueprint $table) {
            $table->id();
            $table->string('prog_code');
            $table->string('subj_code');
            $table->unsignedBigInteger('term_id');
            $table->integer('year_level');
            $table->timestamps();

            // Compound primary key
            $table->unique(['prog_code', 'subj_code']);

            // Foreign keys
            $table->foreign('prog_code')->references('code')->on('programs')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('subj_code')->references('code')->on('subjects')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('term_id')->references('id')->on('terms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_subjects');
    }
};

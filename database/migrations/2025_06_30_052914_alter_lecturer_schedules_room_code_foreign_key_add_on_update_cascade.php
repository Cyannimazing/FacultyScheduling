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
        Schema::table('lecturer_schedules', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['room_code']);
            
            // Re-add the foreign key constraint with onUpdate cascade
            $table->foreign('room_code')
                  ->references('name')
                  ->on('rooms')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lecturer_schedules', function (Blueprint $table) {
            // Drop the foreign key constraint with onUpdate cascade
            $table->dropForeign(['room_code']);
            
            // Re-add the original foreign key constraint without onUpdate cascade
            $table->foreign('room_code')
                  ->references('name')
                  ->on('rooms')
                  ->onDelete('cascade');
        });
    }
};

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
     * Updates the unique constraint to include batch_no so that different batches
     * can use the same room at the same time.
     */
    public function up(): void
    {
        Schema::table('lecturer_schedules', function (Blueprint $table) {
            // Drop the existing unique constraint
            $table->dropUnique('unique_room_schedule');
            
            // Add new unique constraint that includes batch_no
            $table->unique(['room_code', 'day', 'start_time', 'end_time', 'sy_term_id', 'batch_no'], 'unique_room_schedule_with_batch');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lecturer_schedules', function (Blueprint $table) {
            // Drop the new unique constraint
            $table->dropUnique('unique_room_schedule_with_batch');
            
            // Restore the original unique constraint (without batch_no)
            $table->unique(['room_code', 'day', 'start_time', 'end_time', 'sy_term_id'], 'unique_room_schedule');
        });
    }
};

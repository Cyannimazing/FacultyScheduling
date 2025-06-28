<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('lecturer_schedules', function (Blueprint $table) {
            $table->unsignedBigInteger('batch_no')->nullable();
        });
    }

    public function down()
    {
        Schema::table('lecturer_schedules', function (Blueprint $table) {
            $table->dropColumn('batch_no');
        });
    }
};

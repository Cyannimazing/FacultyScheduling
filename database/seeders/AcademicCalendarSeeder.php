<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AcademicCalendar;

class AcademicCalendarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicCalendars = [

        ];

        foreach ($academicCalendars as $calendar) {
            AcademicCalendar::create($calendar);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TimeSlotSeeder::class,
            TermSeeder::class,
            ProgramSeeder::class,
            LecturerSeeder::class,
            SubjectSeeder::class,
            GroupSeeder::class,
            RoomSeeder::class,
            AcademicCalendarSeeder::class,
            LecturerSubjectSeeder::class,
            ProgramSubjectSeeder::class,
            LecturerScheduleSeeder::class,
        ]);
    }
}

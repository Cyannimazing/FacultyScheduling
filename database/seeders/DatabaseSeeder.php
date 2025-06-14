<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
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

        User::create([
            'email'=>'admin@gmail.com',
            'name'=>'admin',
            'password'=>'admin123',
            'email_verified_at'=>Carbon::now(),
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TimeSlot;

class TimeSlotSeeder extends Seeder
{
    public function run()
    {
        $daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];

        foreach ($daysOfWeek as $day) {
            for ($hour = 8; $hour <= 18; $hour++) {
                $prefix = $hour < 10 ? '0' : '';

                // Create :00 time slot
                TimeSlot::create([
                    'day' => $day,
                    'time' => $prefix . $hour . ':00'
                ]);

                // Create :30 time slot except at hour 18
                if ($hour != 18) {
                    TimeSlot::create([
                        'day' => $day,
                        'time' => $prefix . $hour . ':30'
                    ]);
                }
            }
        }
    }
}

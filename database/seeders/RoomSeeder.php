<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    public function run()
    {
        $rooms = [
            'GMC',
            'JAGUAR',
            'BMW',
            'SUZUKI',
            'Volvo',
            'Mitsubishi',
            'Volkswagen',
            'Nissan',
        ];

        foreach ($rooms as $name) {
            Room::create(['name' => $name]);
        }
    }
}

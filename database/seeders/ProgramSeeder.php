<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;

class ProgramSeeder extends Seeder
{
    public function run()
    {
        $programs = [
            [
                'code' => 'BTEA',
                'number_of_year' => 4,
                'description' => 'Bachelor of Technology (HONS) in Automotive (BTEA)',
                'name' => 'Automotive',
            ],
            [
                'code' => 'CBT 29',
                'number_of_year' => 4,
                'description' => 'CBT',  // no name provided
                'name' => 'CBT',  // no name provided
            ],
        ];

        foreach ($programs as $data) {
            Program::create($data);
        }
    }
}

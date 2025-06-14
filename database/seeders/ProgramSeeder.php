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
                'name' => 'Bachelor of Technology (HONS) in Automotive (BTEA) Prospectus',
            ],
            [
                'code' => 'CBT 29',
                'number_of_year' => 4,
                'name' => 'CBT',  // no name provided
            ],
        ];

        foreach ($programs as $data) {
            Program::create($data);
        }
    }
}

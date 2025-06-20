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
                'type' => 'Academic Programme',
            ],
            [
                'code' => 'CBT',
                'number_of_year' => 2,
                'description' => 'Competency Based Training Programme',
                'type' => 'Vocational',
            ],
        ];

        foreach ($programs as $data) {
            Program::create($data);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lecturer;

class LecturerSeeder extends Seeder
{
    public function run()
    {
        $lecturers = [
            ['title' => 'Ms.',  'fname' => 'Hawa',           'lname' => 'ALmujaini'],
            ['title' => 'Dr.',  'fname' => 'Harpreet',       'lname' => null],
            ['title' => 'Mr.',  'fname' => 'Yunus',          'lname' => null],
            ['title' => 'Dr.',  'fname' => 'Rose',           'lname' => null],
            ['title' => 'Ms.',  'fname' => 'Bishara',        'lname' => null],
            ['title' => 'Dr.',  'fname' => 'Shaimaa Al',     'lname' => 'Tabib'],
        ];

        foreach ($lecturers as $data) {
            Lecturer::create($data);
        }
    }
}

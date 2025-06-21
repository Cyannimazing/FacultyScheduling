<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Term;

class TermSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $terms = [
            ['name' => '1st Term'],
            ['name' => '2nd Term'],
            ['name' => 'Summer'],
        ];

        foreach ($terms as $term) {
            Term::create($term);
        }
    }
}

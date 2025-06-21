<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    public function run()
    {
        $groups = ['A', 'B', 'C', 'D', 'E', 'F'];

        foreach ($groups as $name) {
            Group::create([
                'name'      => $name,
                'prog_code' => 'CBT',  // make sure this program code exists
            ]);
        }
    }
}

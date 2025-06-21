<?php

namespace Database\Seeders;

use Carbon\Carbon;
use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProgramSubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $now = Carbon::now();

        DB::table('program_subjects')->insert([
            [
                'prog_subj_code' => 'BTEA 1101',
                'prog_code'   => 'BTEA',
                'subj_id'     => 1,
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'BTEA 1102',
                'prog_code'   => 'BTEA',
                'subj_id'     => 2,
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'MATH 1610',
                'prog_code'   => 'BTEA',
                'subj_id'     => 3,
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'AUTO 1001',
                'prog_code'   => 'BTEA',
                'subj_id'     => 4,
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'MECH 1404',
                'prog_code'   => 'BTEA',
                'subj_id'     => 5,
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'MECH 1206',
                'prog_code'   => 'BTEA',
                'subj_id'     => 6,
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'MECH 1502',
                'prog_code'   => 'BTEA',
                'subj_id'     => 7,
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'BTEA 1202',
                'prog_code'   => 'BTEA',
                'subj_id'     => 8,
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'AUTO 1201',
                'prog_code'   => 'BTEA',
                'subj_id'     => 9,
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'AUTO 1101',
                'prog_code'   => 'BTEA',
                'subj_id'     => 10,
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'MECH 1606',
                'prog_code'   => 'BTEA',
                'subj_id'     => 11,
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'MECH 1802',
                'prog_code'   => 'BTEA',
                'subj_id'     => 12,
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'MECH 1808',
                'prog_code'   => 'BTEA',
                'subj_id'     => 13,
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_subj_code' => 'BUSS 2320',
                'prog_code'   => 'BTEA',
                'subj_id'     => 14,
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 16
            [
                'prog_subj_code' => 'BTEA 2101',
                'prog_code'   => 'BTEA',
                'subj_id'     => 15,
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 17
            [
                'prog_subj_code' => 'AUTO 2301',
                'prog_code'   => 'BTEA',
                'subj_id'     => 16,
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 18
            [
                'prog_subj_code' => 'AUTO 2401',
                'prog_code'   => 'BTEA',
                'subj_id'     => 17,
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 19
            [
                'prog_subj_code' => 'AUTO 2501',
                'prog_code'   => 'BTEA',
                'subj_id'     => 18,
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 20
            [
                'prog_subj_code' => 'AUTO 2102',
                'prog_code'   => 'BTEA',
                'subj_id'     => 19,
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 21
            [
                'prog_subj_code' => 'AUTO 2202',
                'prog_code'   => 'BTEA',
                'subj_id'     => 20,
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 22
            [
                'prog_subj_code' => 'AUTO 2602',
                'prog_code'   => 'BTEA',
                'subj_id'     => 21,
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 23
            [
                'prog_subj_code' => 'BTEA 2201',
                'prog_code'   => 'BTEA',
                'subj_id'     => 22,
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 24
            [
                'prog_subj_code' => 'BTEA 2202',
                'prog_code'   => 'BTEA',
                'subj_id'     => 23,
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 25
            [
                'prog_subj_code' => 'AUTO 2801',
                'prog_code'   => 'BTEA',
                'subj_id'     => 24,
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 26
            [
                'prog_subj_code' => 'AUTO 2203',
                'prog_code'   => 'BTEA',
                'subj_id'     => 25,
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 27
            [
                'prog_subj_code' => 'AUTO 2502',
                'prog_code'   => 'BTEA',
                'subj_id'     => 26,
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 28
            [
                'prog_subj_code' => 'AUTO 2402',
                'prog_code'   => 'BTEA',
                'subj_id'     => 27,
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 29
            [
                'prog_subj_code' => 'MECH 2504',
                'prog_code'   => 'BTEA',
                'subj_id'     => 28,
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 30
            [
                'prog_subj_code' => 'OJT 1',
                'prog_code'   => 'BTEA',
                'subj_id'     => 29,
                'term_id'     => 3,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 31
            [
                'prog_subj_code' => 'AUTO 3901',
                'prog_code'   => 'BTEA',
                'subj_id'     => 30,
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 32
            [
                'prog_subj_code' => 'AUTO 3302',
                'prog_code'   => 'BTEA',
                'subj_id'     => 31,
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 33
            [
                'prog_subj_code' => 'AUTO 3103',
                'prog_code'   => 'BTEA',
                'subj_id'     => 32,
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 34
            [
                'prog_subj_code' => 'AUTO 3204',
                'prog_code'   => 'BTEA',
                'subj_id'     => 33,
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 35
            [
                'prog_subj_code' => 'AUTO 3405',
                'prog_code'   => 'BTEA',
                'subj_id'     => 34,
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 36
            [
                'prog_subj_code' => 'ENGR 3102',
                'prog_code'   => 'BTEA',
                'subj_id'     => 35,
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 37
            [
                'prog_subj_code' => 'BTEA 3201',
                'prog_code'   => 'BTEA',
                'subj_id'     => 36,
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 38
            [
                'prog_subj_code' => 'BTEA 3202',
                'prog_code'   => 'BTEA',
                'subj_id'     => 37,
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 39
            [
                'prog_subj_code' => 'AUTO 2404',
                'prog_code'   => 'BTEA',
                'subj_id'     => 38,
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 40
            [
                'prog_subj_code' => 'AUTO 2601',
                'prog_code'   => 'BTEA',
                'subj_id'     => 39,
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 41
            [
                'prog_subj_code' => 'AUTO 2403',
                'prog_code'   => 'BTEA',
                'subj_id'     => 40,
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 42
            [
                'prog_subj_code' => 'AUTO 3002',
                'prog_code'   => 'BTEA',
                'subj_id'     => 41,
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 43
            [
                'prog_subj_code' => 'OJT 2',
                'prog_code'   => 'BTEA',
                'subj_id'     => 42,
                'term_id'     => 3,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 44
            [
                'prog_subj_code' => 'AUTO 3902',
                'prog_code'   => 'BTEA',
                'subj_id'     => 43,
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 45
            [
                'prog_subj_code' => 'AUTO 3701',
                'prog_code'   => 'BTEA',
                'subj_id'     => 44,
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 46
            [
                'prog_subj_code' => 'AUTO 3104',
                'prog_code'   => 'BTEA',
                'subj_id'     => 45,
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 47
            [
                'prog_subj_code' => 'AUTO 3003',
                'prog_code'   => 'BTEA',
                'subj_id'     => 46,
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 48
            [
                'prog_subj_code' => 'AUTO 3503',
                'prog_code'   => 'BTEA',
                'subj_id'     => 47,
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 49
            [
                'prog_subj_code' => 'MECH 4701',
                'prog_code'   => 'BTEA',
                'subj_id'     => 48,
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 50
            [
                'prog_subj_code' => 'AUTO 3802',
                'prog_code'   => 'BTEA',
                'subj_id'     => 49,
                'term_id'     => 2,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
        ]);
    }
}

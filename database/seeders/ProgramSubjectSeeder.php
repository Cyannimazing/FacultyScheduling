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
                'prog_code'   => 'BTEA',
                'subj_code'   => 'BTEA 1101',
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'BTEA 1102',
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'MATH 1610',
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 1001',
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'MECH 1404',
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'MECH 1206',
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'MECH 1502',
                'term_id'     => 1,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'BTEA 1202',
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 1201',
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 1101',
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'MECH 1606',
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'MECH 1802',
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'MECH 1808',
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'BUSS 2320',
                'term_id'     => 2,
                'year_level'  => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 16
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'BTEA 2101',
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 17
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2301',
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 18
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2401',
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 19
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2501',
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 20
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2102',
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 21
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2202',
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 22
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2602',
                'term_id'     => 1,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 23
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'BTEA 2201',
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 24
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'BTEA 2202',
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 25
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2801',
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 26
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2203',
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 27
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2502',
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 28
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2402',
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 29
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'MECH 2504',
                'term_id'     => 2,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 30
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'OJT 1',
                'term_id'     => 3,
                'year_level'  => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 31
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3901',
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 32
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3302',
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 33
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3103',
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 34
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3204',
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 35
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3405',
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 36
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'ENGR 3102',
                'term_id'     => 1,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 37
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'BTEA 3201',
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 38
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'BTEA 3202',
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 39
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2404',
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 40
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2601',
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 41
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 2403',
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 42
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3002',
                'term_id'     => 2,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 43
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'OJT 2',
                'term_id'     => 3,
                'year_level'  => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 44
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3902',
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 45
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3701',
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 46
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3104',
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 47
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3003',
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 48
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3503',
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 49
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'MECH 4701',
                'term_id'     => 1,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            // Record with id 50
            [
                'prog_code'   => 'BTEA',
                'subj_code'   => 'AUTO 3802',
                'term_id'     => 2,
                'year_level'  => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
        ]);
    }
}

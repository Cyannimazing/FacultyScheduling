<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;

class SubjectSeeder extends Seeder
{
    public function run()
    {
        $subjects = [
            ['code' => 'BTEA 1101', 'name' => 'Technical Communication',                         'unit' => 0, 'is_gen_ed' => true],
            ['code' => 'BTEA 1102', 'name' => 'Soft Skills I',                                   'unit' => 0, 'is_gen_ed' => true],
            ['code' => 'MATH 1610','name' => 'Engineering Mathematics I',                     'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 1001','name' => 'Introduction to Automotive Technology',         'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'MECH 1404','name' => 'Thermofluids',                                  'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'MECH 1206','name' => 'Fundamental of Engineering Mechanics',          'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'MECH 1502','name' => 'Engineering Drawing',                           'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'BTEA 1202','name' => 'Oman Islamic and Civilization',                'unit' => 0, 'is_gen_ed' => true],
            ['code' => 'AUTO 1201','name' => 'Fundamental of Electrical & Electronics',      'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 1101','name' => 'Fundamental of Internal Combustion Engine',   'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'MECH 1606','name' => 'Materials & Processes',                       'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'MECH 1802','name' => 'Engineering Workshop',                        'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'MECH 1808','name' => 'Engineering Lab',                             'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'BUSS 2320','name' => 'Entrepreneurship for Engineers',             'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'BTEA 2101','name' => 'Work Ethics',                                 'unit' => 0, 'is_gen_ed' => true],
            ['code' => 'AUTO 2301','name' => 'Transmission Systems I',                     'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 2401','name' => 'Chassis Structure & Suspension System',       'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 2501','name' => 'Petrol Engine Fuel System',                  'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 2102','name' => 'Internal Combustion Engine I',              'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 2202','name' => 'Automotive Electrical Sys I',               'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 2602','name' => 'Heating & AC Systems',                      'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'BTEA 2201','name' => 'Professional Communication',                'unit' => 0, 'is_gen_ed' => true],
            ['code' => 'BTEA 2202','name' => 'German Lang. 1',                             'unit' => 0, 'is_gen_ed' => true],
            ['code' => 'AUTO 2801','name' => 'Automotive Workshop Technology',             'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 2203','name' => 'Ignition System',                            'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 2502','name' => 'Diesel Engine Fuel Systems',                 'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 2402','name' => 'Braking & Tire System',                     'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'MECH 2504','name' => 'Engineering Drawing II',                    'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'OJT 1',    'name' => 'Industry Enhancement Program (Summer)',     'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'OJT 2',    'name' => 'Industry Enhancement Program (Summer)',     'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3901','name' => 'Project I',                                  'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3302','name' => 'Transmission System II',                    'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3103','name' => 'Internal Combustion Engine II',             'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3204','name' => 'Automotive Electrical Systems II',          'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3405','name' => 'Vehicle Dynamics',                          'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'ENGR 3102','name' => 'Product Design & Innovation',               'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'BTEA 3201','name' => 'Entrepreneurship/Technopreneurship',        'unit' => 0, 'is_gen_ed' => true],
            ['code' => 'BTEA 3202','name' => 'German Lang. 2',                             'unit' => 0, 'is_gen_ed' => true],
            ['code' => 'AUTO 2404','name' => 'Body Work and Repair',                      'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 2601','name' => 'Automotive Comfort & Safety System',        'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 2403','name' => 'Steering & Wheel Alignment',                'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3002','name' => 'Vehicle Maintenance',                       'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3902','name' => 'Project II',                                 'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3701','name' => 'Vehicle Performance & Diagnosis',           'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3104','name' => 'Advance Engine Technology',                 'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3003','name' => 'Heavy Vehicles',                            'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3503','name' => 'Advance Feul System',                       'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'MECH 4701','name' => 'Engineering Management, Safe & Economics',  'unit' => 0, 'is_gen_ed' => false],
            ['code' => 'AUTO 3802','name' => 'Industrial Training',                       'unit' => 4, 'is_gen_ed' => false],
        ];

        foreach ($subjects as $data) {
            Subject::create($data);
        }
    }
}

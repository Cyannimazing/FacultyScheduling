<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;

class SubjectSeeder extends Seeder
{
    public function run()
    {
        $subjects = [
            ['name' => 'Technical Communication',                         'unit' => 0, 'is_gen_ed' => true],
            ['name' => 'Soft Skills I',                                   'unit' => 0, 'is_gen_ed' => true],
            ['name' => 'Engineering Mathematics I',                     'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Introduction to Automotive Technology',         'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Thermofluids',                                  'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Fundamental of Engineering Mechanics',          'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Engineering Drawing',                           'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Oman Islamic and Civilization',                'unit' => 0, 'is_gen_ed' => true],
            ['name' => 'Fundamental of Electrical & Electronics',      'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Fundamental of Internal Combustion Engine',   'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Materials & Processes',                       'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Engineering Workshop',                        'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Engineering Lab',                             'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Entrepreneurship for Engineers',             'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Work Ethics',                                 'unit' => 0, 'is_gen_ed' => true],
            ['name' => 'Transmission Systems I',                     'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Chassis Structure & Suspension System',       'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Petrol Engine Fuel System',                  'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Internal Combustion Engine I',              'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Automotive Electrical Sys I',               'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Heating & AC Systems',                      'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Professional Communication',                'unit' => 0, 'is_gen_ed' => true],
            ['name' => 'German Lang. 1',                             'unit' => 0, 'is_gen_ed' => true],
            ['name' => 'Automotive Workshop Technology',             'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Ignition System',                            'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Diesel Engine Fuel Systems',                 'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Braking & Tire System',                     'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Engineering Drawing II',                    'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Industry Enhancement Program (Summer)',     'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Industry Enhancement Program (Summer)',     'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Project I',                                  'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Transmission System II',                    'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Internal Combustion Engine II',             'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Automotive Electrical Systems II',          'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Vehicle Dynamics',                          'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Product Design & Innovation',               'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Entrepreneurship/Technopreneurship',        'unit' => 0, 'is_gen_ed' => true],
            ['name' => 'German Lang. 2',                             'unit' => 0, 'is_gen_ed' => true],
            ['name' => 'Body Work and Repair',                      'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Automotive Comfort & Safety System',        'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Steering & Wheel Alignment',                'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Vehicle Maintenance',                       'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Project II',                                 'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Vehicle Performance & Diagnosis',           'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Advance Engine Technology',                 'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Heavy Vehicles',                            'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Advance Feul System',                       'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Engineering Management, Safe & Economics',  'unit' => 0, 'is_gen_ed' => false],
            ['name' => 'Industrial Training',                       'unit' => 4, 'is_gen_ed' => false],
        ];

        foreach ($subjects as $data) {
            Subject::create($data);
        }
    }
}

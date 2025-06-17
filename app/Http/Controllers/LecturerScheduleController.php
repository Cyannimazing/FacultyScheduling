<?php

namespace App\Http\Controllers;

use App\Models\AcademicCalendar;
use App\Models\Group;
use App\Models\Lecturer;
use App\Models\LecturerSchedule;
use App\Http\Requests\StoreLecturerScheduleRequest;
use App\Http\Requests\UpdateLecturerScheduleRequest;
use App\Models\LecturerSubject;
use App\Models\Room;
use App\Models\Subject;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LecturerScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = 5;

        $academicCalendars = AcademicCalendar::with('term')
                                ->get();
        $lecturers = LecturerSubject::with('lecturer')
                                ->groupBy('lecturer_id')
                                ->get()
                                ->pluck('lecturer');
        $rooms = Room::orderBy('name')->get();

        $lecturerSchedules = LecturerSchedule::with(['lecturer', 'subject', 'group', 'academicCalendar.term'])
                                ->where('lecturer_id', $search)
                                ->get();
    /*Sample output data of lecturerSchedules
    [
        {
            "id": 0,
            "lecturer_id": 1,
            "subj_code": "BTEA 1102",
            "room_code": "BMW",
            "class_id": 1,
            "sy_term_id": 1,
            "day": "MONDAY",
            "start_time": "08:00",
            "end_time": "10:00",
            "created_at": null,
            "updated_at": null,
            "lecturer": {
            "id": 1,
            "title": "Ms.",
            "fname": "Hawa",
            "lname": "ALmujaini",
            "created_at": "2025-06-17T09:41:41.000000Z",
            "updated_at": "2025-06-17T09:41:41.000000Z"
            },
            "subject": {
            "id": 2,
            "code": "BTEA 1102",
            "name": "Soft Skills I",
            "unit": 0,
            "is_gen_ed": 1,
            "created_at": "2025-06-17T09:41:41.000000Z",
            "updated_at": "2025-06-17T09:41:41.000000Z"
            },
            "group": {
            "id": 1,
            "name": "A",
            "prog_code": "CBT 29",
            "created_at": "2025-06-17T09:41:41.000000Z",
            "updated_at": "2025-06-17T09:41:41.000000Z"
            },
            "academic_calendar": {
            "id": 1,
            "term_id": 1,
            "school_year": "2024-2025",
            "start_date": "2025-01-05T00:00:00.000000Z",
            "end_date": "2025-04-04T00:00:00.000000Z",
            "created_at": "2025-06-17T09:52:31.000000Z",
            "updated_at": "2025-06-17T09:52:31.000000Z",
            "term": {
                "id": 1,
                "name": "1st Term",
                "created_at": "2025-06-17T09:41:41.000000Z",
                "updated_at": "2025-06-17T09:52:44.000000Z"
            }
            }
        },
    ]
    */
        // return response()->json($lecturerSchedules);
        return Inertia::render('application/faculty-schedule', [
            'data' => [
                'academicCalendars' => $academicCalendars,
                'lecturers' => $lecturers,
                'rooms' => $rooms,
                'lecturerSchedules' => $lecturerSchedules
            ]
        ]);
    }

    //kani na query mo return rani ug mga subject base sa kinsa na lecturer ug unsa na schoolyear
    public function getSubjectsByLecturerAndSchoolYear($sy_term_id, $lecturer_id){
        $subjects = LecturerSubject::with(['programSubject.subject'])
                        ->where('lecturer_id', $lecturer_id)
                        ->where('sy_term_id', $sy_term_id)
                        ->get()
                        ->pluck('programSubject');
        return response()->json($subjects);
    }

    public function getClassByProgram($prog_code){
        $classes = Group::where('prog_code', $prog_code)
                        ->get();
        return response()->json($classes);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerScheduleRequest $request)
    {
        $validated = $request->validated();

        LecturerSchedule::create($validated);

        return redirect()->route('faculty-schedule')->with('success', 'Lecturer Schedule created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $lecturerSchedule = LecturerSchedule::findOrFail($id);
        return Inertia::render('application/faculty-schedule', [
            'lecturerSchedule' => $lecturerSchedule
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLecturerScheduleRequest $request, int $id)
    {
        $lecturerSchedule = LecturerSchedule::find($id);
        if($lecturerSchedule){
            $lecturerSchedule->update([
                'lecturer_id' => $request->lecturer_id,
                'subj_code' => $request->subj_code,
                'room_code' => $request->room_code,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'day' => $request->day,
                'class_id' => $request->class_id,
                'sy_term_id' => $request->sy_term_id
            ]);
        }
        return redirect()->route('faculty-schedule')->with('success', 'Lecturer Schedule updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LecturerSchedule $lecturerSchedule)
    {
        $lecturerSchedule->delete();

        return redirect()->route('faculty-schedule')->with('success', 'Lecturer Schedule deleted successfully.');
    }
}

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
        $termFilter = $request->input('term_filter');
        $lecturerFilter = $request->input('lecturer_filter');
        $programTypeFilter = $request->input('program_type_filter');
        $classFilter = $request->input('class_filter');

        // Initialize empty schedules if required filters are not provided
        $schedules = collect();

        // Only fetch schedules if both lecturer and term are selected
        if ($lecturerFilter && $termFilter) {
            // Get schedules with relationships
            $schedulesQuery = LecturerSchedule::with([
                'lecturer',
                'programSubject.subject',
                'room',
                'group',
                'academicCalendar.term'
            ]);

            // Apply required filters
            $schedulesQuery->where('sy_term_id', $termFilter)
                        ->where('lecturer_id', $lecturerFilter);

            if ($programTypeFilter){
                $schedulesQuery->whereHas('group.program', function($query) use($programTypeFilter) {
                            $query->where('type', $programTypeFilter);
                });
            }

            // Apply optional class filter (ignore if 'all' is selected)
            if ($classFilter && $classFilter !== 'all') {
                $schedulesQuery->whereHas('group', function ($q) use ($classFilter) {
                    $q->where('name', $classFilter);
                });
            }

            $schedules = $schedulesQuery->orderBy('day')
                                       ->orderBy('start_time')
                                       ->get();
        }

        $academicCalendars = AcademicCalendar::with('term')
                                ->orderBy('school_year', 'desc')
                                ->orderBy('id')
                                ->get();

        $lecturers = LecturerSubject::with('lecturer')
                                ->groupBy('lecturer_id')
                                ->get()
                                ->pluck('lecturer')
                                ->unique('id')
                                ->values();

        $rooms = Room::orderBy('name')->get();

        // Calculate overall statistics (independent of current filters)
        $totalSchedules = LecturerSchedule::count();
        $totalActiveLecturers = LecturerSchedule::distinct('lecturer_id')->count('lecturer_id');
        $totalRoomsInUse = LecturerSchedule::distinct('room_code')->count('room_code');

        // return response()->json($schedules);
        return Inertia::render('application/faculty-schedule', [
            'data' => [
                'schedules' => $schedules,
                'academicCalendars' => $academicCalendars,
                'lecturers' => $lecturers,
                'rooms' => $rooms,
                'statistics' => [
                    'totalSchedules' => $totalSchedules,
                    'totalActiveLecturers' => $totalActiveLecturers,
                    'totalRoomsInUse' => $totalRoomsInUse
                ]
            ]
        ]);
    }

    //kani na query mo return rani ug mga subject base sa kinsa na lecturer ug unsa na schoolyear
    public function getSubjectsByLecturerAndSchoolYear($sy_term_id, $lecturer_id){
        $subjects = LecturerSubject::with(['programSubject.subject', 'programSubject.program'])
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

        // Preserve the current filters in the redirect
        $queryParams = [];
        if ($request->input('term_filter')) {
            $queryParams['term_filter'] = $request->input('term_filter');
        }
        if ($request->input('lecturer_filter')) {
            $queryParams['lecturer_filter'] = $request->input('lecturer_filter');
        }
        if ($request->input('class_filter')) {
            $queryParams['class_filter'] = $request->input('class_filter');
        }

        return redirect()->route('faculty-schedule', $queryParams)->with('success', 'Lecturer Schedule created successfully.');
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
                'subj_id' => $request->subj_id,
                'room_code' => $request->room_code,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'day' => $request->day,
                'class_id' => $request->class_id,
                'sy_term_id' => $request->sy_term_id
            ]);
        }

        // Preserve the current filters in the redirect
        $queryParams = [];
        if ($request->input('term_filter')) {
            $queryParams['term_filter'] = $request->input('term_filter');
        }
        if ($request->input('lecturer_filter')) {
            $queryParams['lecturer_filter'] = $request->input('lecturer_filter');
        }
        if ($request->input('class_filter')) {
            $queryParams['class_filter'] = $request->input('class_filter');
        }

        return redirect()->route('faculty-schedule', $queryParams)->with('success', 'Lecturer Schedule updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, LecturerSchedule $lecturerSchedule)
    {
        $lecturerSchedule->delete();

        // Preserve the current filters in the redirect
        $queryParams = [];
        if ($request->input('term_filter')) {
            $queryParams['term_filter'] = $request->input('term_filter');
        }
        if ($request->input('lecturer_filter')) {
            $queryParams['lecturer_filter'] = $request->input('lecturer_filter');
        }
        if ($request->input('class_filter')) {
            $queryParams['class_filter'] = $request->input('class_filter');
        }

        return redirect()->route('faculty-schedule', $queryParams)->with('success', 'Lecturer Schedule deleted successfully.');
    }

    public function getGroupSchedule(Request $request){
        $termFilter = $request->input('sy_term_id');
        $classFilter = $request->input('class_id');
        $programFilter = $request->input('prog_code');

        $schedules = collect();

        if ($classFilter && $termFilter) {
            $schedulesQuery = LecturerSchedule::with([
                'lecturer',
                'programSubject.subject',
                'room',
                'group',
                'academicCalendar.term'
            ]);

            $schedulesQuery->where('sy_term_id', $termFilter)
                          ->where('class_id', $classFilter);

            $schedules = $schedulesQuery->orderBy('day')
                                       ->orderBy('start_time')
                                       ->get();
        }

        // Get academic calendars for the filter dropdown
        $academicCalendars = AcademicCalendar::with('term')
                            ->orderBy('school_year', 'desc')
                            ->orderBy('id')
                            ->get();

        // Get all programs for the program filter dropdown
        $programs = \App\Models\Program::orderBy('description')->get();

        // Get groups/classes filtered by program if program is selected
        $groupsQuery = Group::with('program');
        if ($programFilter) {
            $groupsQuery->where('prog_code', $programFilter);
        }
        $groups = $groupsQuery->orderBy('name')->get();

        return Inertia::render('application/class-schedule', [
            'data' => [
                'schedules' => $schedules,
                'academicCalendars' => $academicCalendars,
                'groups' => $groups,
                'programs' => $programs
            ]
        ]);
    }
}

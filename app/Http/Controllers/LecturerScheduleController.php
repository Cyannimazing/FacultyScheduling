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
                    'totalRoomsInUse' => $totalRoomsInUse,
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
     * Get available time slots for a specific day, room, lecturer, and class
     * excluding conflicts with existing schedules
     */
    public function getAvailableTimeSlots(Request $request)
    {
        $request->validate([
            'day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'sy_term_id' => 'required|integer|exists:academic_calendars,id',
            'lecturer_id' => 'nullable|integer|exists:lecturers,id',
            'room_code' => 'nullable|string|exists:rooms,name',
            'class_id' => 'nullable|integer|exists:groups,id',
            'exclude_schedule_id' => 'nullable|integer|exists:lecturer_schedules,id', // For editing existing schedule
        ]);

        // Define all possible time slots (30-minute intervals)
        $allTimeSlots = [
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
            '17:00', '17:30', '18:00'
        ];

        $day = $request->input('day');
        $syTermId = $request->input('sy_term_id');
        $lecturerId = $request->input('lecturer_id');
        $roomCode = $request->input('room_code');
        $classId = $request->input('class_id');
        $excludeScheduleId = $request->input('exclude_schedule_id');

        // Get existing schedules for the same day and term
        $conflictingSchedules = LecturerSchedule::where('day', $day)
            ->where('sy_term_id', $syTermId)
            ->when($excludeScheduleId, function ($query) use ($excludeScheduleId) {
                return $query->where('id', '!=', $excludeScheduleId);
            })
            ->get();

        // Check conflicts for each resource type
        $blockedTimeSlots = [];

        foreach ($conflictingSchedules as $schedule) {
            $hasConflict = false;

            // Check lecturer conflict
            if ($lecturerId && $schedule->lecturer_id == $lecturerId) {
                $hasConflict = true;
            }

            // Check room conflict
            if ($roomCode && $schedule->room_code == $roomCode) {
                $hasConflict = true;
            }

            // Check class conflict
            if ($classId && $schedule->class_id == $classId) {
                $hasConflict = true;
            }

            if ($hasConflict) {
                // Block all time slots that overlap with this schedule
                $startTime = $schedule->start_time;
                $endTime = $schedule->end_time;
                
                $startIndex = array_search($startTime, $allTimeSlots);
                $endIndex = array_search($endTime, $allTimeSlots);
                
                if ($startIndex !== false && $endIndex !== false) {
                    // Block all slots from start to end (exclusive of end)
                    for ($i = $startIndex; $i < $endIndex; $i++) {
                        $blockedTimeSlots[] = $allTimeSlots[$i];
                    }
                }
            }
        }

        // Remove duplicates and get available slots
        $blockedTimeSlots = array_unique($blockedTimeSlots);
        $availableStartTimes = array_diff($allTimeSlots, $blockedTimeSlots);
        
        // For end times, we need to ensure there's a valid end time after each start time
        $availableTimeSlots = [];
        
        foreach ($availableStartTimes as $startTime) {
            $startIndex = array_search($startTime, $allTimeSlots);
            $possibleEndTimes = [];
            
            // Check for consecutive available slots after this start time
            for ($i = $startIndex + 1; $i < count($allTimeSlots); $i++) {
                $potentialEndTime = $allTimeSlots[$i];
                
                // Check if this end time would create a conflict
                $wouldConflict = false;
                for ($j = $startIndex; $j < $i; $j++) {
                    if (in_array($allTimeSlots[$j], $blockedTimeSlots)) {
                        $wouldConflict = true;
                        break;
                    }
                }
                
                if (!$wouldConflict) {
                    $possibleEndTimes[] = $potentialEndTime;
                } else {
                    break; // Stop at first conflict
                }
            }
            
            if (!empty($possibleEndTimes)) {
                $availableTimeSlots[] = [
                    'start_time' => $startTime,
                    'possible_end_times' => $possibleEndTimes
                ];
            }
        }

        return response()->json([
            'available_time_slots' => $availableTimeSlots,
            'blocked_time_slots' => array_values($blockedTimeSlots),
            'all_time_slots' => $allTimeSlots
        ]);
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
                'prog_subj_id' => $request->prog_subj_id,
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
    public function getRoomSchedule(Request $request){
        $termFilter = $request->input('sy_term_id');
        $roomFilter = $request->input('room_code');

        $schedules = collect();

        if ($roomFilter && $termFilter) {
            $schedulesQuery = LecturerSchedule::with([
                'lecturer',
                'programSubject.subject',
                'room',
                'group',
                'academicCalendar.term'
            ]);

            $schedulesQuery->where('sy_term_id', $termFilter)
                          ->where('room_code', $roomFilter);

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
        $rooms = Room::orderBy('name')->get();


        //UNCOMMENT TO TEST THE RETURN DATA
        // return response()->json([
        //     'data' => [
        //         'schedules' => $schedules,
        //         'academicCalendars' => $academicCalendars,
        //         'rooms' => $rooms,
        //     ]
        // ]);

        return Inertia::render('application/room-schedule', [
            'data' => [
                'schedules' => $schedules,
                'academicCalendars' => $academicCalendars,
                'rooms' => $rooms,
            ]
        ]);
    }
}

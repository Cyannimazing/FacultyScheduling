<?php

namespace App\Http\Controllers;

use App\Models\AcademicCalendar;
use App\Models\Group;
use App\Models\Lecturer;
use App\Models\LecturerLoad;
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
        $batchFilter = $request->input('batch_filter');
        $lecturerFilter = $request->input('lecturer_filter');
        $programTypeFilter = $request->input('program_type_filter');
        $classFilter = $request->input('class_filter');

        // Initialize empty schedules if required filters are not provided
        $schedules = collect();

        // Only fetch schedules if both lecturer and batch are selected
        if ($lecturerFilter && $batchFilter) {
            // Get schedules with relationships
            $schedulesQuery = LecturerSchedule::with([
                'lecturer',
                'programSubject.subject',
                'room',
                'group',
                'academicCalendar.term'
            ]);

            // Apply required filters using batch_no
            $schedulesQuery->where('batch_no', $batchFilter)
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


        $academicCalendars = AcademicCalendar::with(['term', 'program'])
                                ->where('end_date', '>=', now()->toDateString()) // Only show terms that have not ended
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

        // Get existing batch numbers
        $existingBatches = LecturerSchedule::distinct('batch_no')
                                          ->whereNotNull('batch_no')
                                          ->orderBy('batch_no')
                                          ->pluck('batch_no')
                                          ->toArray();

        // Calculate overall statistics (independent of current filters)
        $totalSchedules = LecturerSchedule::count();
        $totalActiveLecturers = LecturerSchedule::distinct('lecturer_id')->count('lecturer_id');
        $totalRoomsInUse = LecturerSchedule::distinct('room_code')->count('room_code');
        $maxLoad = LecturerLoad::latest()->get('max_load');

        // return response()->json($schedules);
        return Inertia::render('application/faculty-schedule', [
            'data' => [
                'schedules' => $schedules,
                'academicCalendars' => $academicCalendars,
                'lecturers' => $lecturers,
                'rooms' => $rooms,
                'existingBatches' => $existingBatches,
                'statistics' => [
                    'totalSchedules' => $totalSchedules,
                    'totalActiveLecturers' => $totalActiveLecturers,
                    'totalRoomsInUse' => $totalRoomsInUse,
                ],
                'max_load' => $maxLoad
            ]
        ]);
    }

    //kani na query mo return rani ug mga subject base sa kinsa na lecturer ug unsa na schoolyear
    public function getSubjectsByLecturerAndSchoolYear($sy_term_id, $lecturer_id){
        // Get the term_id and school_year from the selected academic calendar
        $selectedAcademicCalendar = AcademicCalendar::findOrFail($sy_term_id);
        $termId = $selectedAcademicCalendar->term_id;
        $schoolYear = $selectedAcademicCalendar->school_year;

        // Get subjects for the lecturer across all programs for the same term and school year
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
     * excluding conflicts with existing schedules across all programs
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

        // Get the term_id and school_year from the selected academic calendar
        $selectedAcademicCalendar = AcademicCalendar::findOrFail($syTermId);
        $termId = $selectedAcademicCalendar->term_id;
        $schoolYear = $selectedAcademicCalendar->school_year;

        // Get existing schedules for the same day and batch across ALL terms
        // When creating a new batch, also consider ongoing schedules from other batches
        $batchNo = $request->input('batch_no');
        $isNewBatch = $request->input('is_new_batch', false);
        $today = now()->startOfDay(); // Use Carbon date for proper comparison

        // Debug: Log the date being used for comparison
        \Log::info('Date comparison debug', [
            'today' => $today->toDateString(),
            'today_carbon' => $today->toISOString(),
            'now_formatted' => now()->format('Y-m-d'),
            'current_timestamp' => now()->timestamp,
        ]);

        if ($isNewBatch) {
            // For new batches, check conflicts with active/upcoming schedules from all batches
            $conflictingSchedules = LecturerSchedule::with('academicCalendar')
                ->where('day', $day)
                ->whereHas('academicCalendar', function ($query) use ($today) {
                    // Only consider schedules from terms that are active or upcoming
                    // Active: start_date <= today <= end_date
                    // Upcoming: start_date > today
                    $query->where(function ($q) use ($today) {
                        $q->where(function ($activeQuery) use ($today) {
                            // Active terms (only if they end AFTER today)
                            $activeQuery->where('start_date', '<=', $today)
                                       ->where('end_date', '>', $today);
                        })->orWhere(function ($upcomingQuery) use ($today) {
                            // Upcoming terms
                            $upcomingQuery->where('start_date', '>', $today);
                        });
                    });
                })
                ->when($excludeScheduleId, function ($query) use ($excludeScheduleId) {
                    return $query->where('id', '!=', $excludeScheduleId);
                })
                ->get();

            // Debug: Log what schedules are being considered for conflicts
            \Log::info('Time slot availability check for new batch', [
                'day' => $day,
                'today' => $today,
                'is_new_batch' => $isNewBatch,
                'total_conflicting_schedules' => $conflictingSchedules->count(),
                'conflicting_schedules' => $conflictingSchedules->map(function($schedule) {
                    return [
                        'id' => $schedule->id,
                        'batch_no' => $schedule->batch_no,
                        'room_code' => $schedule->room_code,
                        'start_time' => $schedule->start_time,
                        'end_time' => $schedule->end_time,
                        'start_date' => $schedule->academicCalendar->start_date ?? 'N/A',
                        'end_date' => $schedule->academicCalendar->end_date ?? 'N/A',
                        'lecturer_id' => $schedule->lecturer_id,
                        'class_id' => $schedule->class_id,
                    ];
                })->toArray()
            ]);
        } else {
            // For existing batches, only check within the same batch
            $conflictingSchedules = LecturerSchedule::where('day', $day)
                ->where('batch_no', $batchNo)
                ->when($excludeScheduleId, function ($query) use ($excludeScheduleId) {
                    return $query->where('id', '!=', $excludeScheduleId);
                })
                ->get();
        }

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

                // Check if any slot between start and this potential end time is blocked
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
                    // If we hit a conflict, we can't use any later end times either
                    break;
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
            $batchNo = $validated['batch_no'];

            // Check if this is a new batch number
            $existingBatchNumbers = LecturerSchedule::distinct('batch_no')
                                                   ->whereNotNull('batch_no')
                                                   ->pluck('batch_no')
                                                   ->toArray();

            $isNewBatch = !in_array($batchNo, $existingBatchNumbers);

            if ($isNewBatch) {
                // Copy all ongoing schedules from other batches to this new batch
                $this->copyOngoingSchedulesToNewBatch($batchNo);
            }

            LecturerSchedule::create($validated);

            // Preserve the current filters in the redirect
            $queryParams = [];
            if ($request->input('batch_filter')) {
                $queryParams['batch_filter'] = $request->input('batch_filter');
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
            if ($request->input('batch_filter')) {
                $queryParams['batch_filter'] = $request->input('batch_filter');
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
        if ($request->input('batch_filter')) {
            $queryParams['batch_filter'] = $request->input('batch_filter');
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
        $termFilter = $request->input('term_filter');
        $classFilter = $request->input('class_filter');
        $programTypeFilter = $request->input('program_type_filter');

        // Initialize empty schedules if required filters are not provided
        $schedules = collect();

        // Only fetch schedules if both class and academic term are selected
        if ($classFilter && $termFilter) {
            // Get schedules with relationships
            $schedulesQuery = LecturerSchedule::with([
                'lecturer',
                'programSubject.subject',
                'room',
                'group',
                'academicCalendar.term'
            ]);

            // Apply required filters using sy_term_id (academic term) and class_id
            $schedulesQuery->where('sy_term_id', $termFilter)
                          ->where('class_id', $classFilter);

            if ($programTypeFilter){
                $schedulesQuery->whereHas('group.program', function($query) use($programTypeFilter) {
                            $query->where('type', $programTypeFilter);
                });
            }

            $schedules = $schedulesQuery->orderBy('day')
                                       ->orderBy('start_time')
                                       ->get();
        }

        $academicCalendars = AcademicCalendar::with(['term', 'program'])
                                ->orderBy('school_year', 'desc')
                                ->orderBy('id')
                                ->get();

        // Get all programs for the program filter dropdown
        $programs = \App\Models\Program::orderBy('description')->get();

        // Filter groups based on selected academic term's program
        $groups = collect();
        if ($termFilter) {
            // Get the selected academic calendar to find its program
            $selectedAcademicCalendar = AcademicCalendar::find($termFilter);
            if ($selectedAcademicCalendar && $selectedAcademicCalendar->prog_id) {
                // Only get groups that belong to the same program as the selected academic term
                $groups = Group::with('program')
                               ->where('prog_code', $selectedAcademicCalendar->program->code)
                               ->orderBy('name')
                               ->get();
            }
        } else {
            // If no term is selected, show all groups
            $groups = Group::with('program')->orderBy('name')->get();
        }

        // Calculate overall statistics (independent of current filters)
        $totalSchedules = LecturerSchedule::count();
        $totalActiveClasses = LecturerSchedule::distinct('class_id')->count('class_id');
        $totalRoomsInUse = LecturerSchedule::distinct('room_code')->count('room_code');

        return Inertia::render('application/class-schedule', [
            'data' => [
                'schedules' => $schedules,
                'academicCalendars' => $academicCalendars,
                'groups' => $groups,
                'programs' => $programs,
                'statistics' => [
                    'totalSchedules' => $totalSchedules,
                    'totalActiveClasses' => $totalActiveClasses,
                    'totalRoomsInUse' => $totalRoomsInUse,
                ]
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
                            ->where('end_date', '>=', now()->toDateString()) // Only show terms that have not ended
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

    /**
     * Copy all ongoing schedules from existing batches to a new batch
     */
    private function copyOngoingSchedulesToNewBatch($newBatchNo)
    {
        $today = now()->startOfDay(); // Use Carbon date for proper comparison

        // Get schedules from active or upcoming terms only
        $ongoingSchedules = LecturerSchedule::with(['academicCalendar'])
            ->whereHas('academicCalendar', function ($query) use ($today) {
                // Only copy schedules from terms that are active or upcoming
                // Active: start_date <= today <= end_date
                // Upcoming: start_date > today
                $query->where(function ($q) use ($today) {
                    $q->where(function ($activeQuery) use ($today) {
                        // Active terms (only if they end AFTER today)
                        $activeQuery->where('start_date', '<=', $today)
                                   ->where('end_date', '>', $today);
                    })->orWhere(function ($upcomingQuery) use ($today) {
                        // Upcoming terms
                        $upcomingQuery->where('start_date', '>', $today);
                    });
                });
            })
            ->get();

        // Debug: Log the schedules being considered
        \Log::info('Copying schedules to new batch', [
            'new_batch_no' => $newBatchNo,
            'today' => $today,
            'total_schedules_found' => $ongoingSchedules->count(),
            'schedules' => $ongoingSchedules->map(function($schedule) {
                return [
                    'id' => $schedule->id,
                    'batch_no' => $schedule->batch_no,
                    'sy_term_id' => $schedule->sy_term_id,
                    'end_date' => $schedule->academicCalendar->end_date ?? 'N/A',
                    'lecturer_id' => $schedule->lecturer_id,
                    'subject' => $schedule->prog_subj_id,
                ];
            })
        ]);

        // Group schedules by unique combination (excluding id, timestamps, and batch_no)
        $uniqueSchedules = [];

        foreach ($ongoingSchedules as $schedule) {
            // Create a unique key based on schedule details (excluding batch_no)
            $key = sprintf(
                '%s_%s_%s_%s_%s_%s_%s_%s',
                $schedule->lecturer_id,
                $schedule->prog_subj_id,
                $schedule->room_code,
                $schedule->class_id,
                $schedule->sy_term_id,
                $schedule->day,
                $schedule->start_time,
                $schedule->end_time
            );

            // Only store the first occurrence of each unique schedule
            if (!isset($uniqueSchedules[$key])) {
                $uniqueSchedules[$key] = $schedule;
            }
        }

        // Copy unique ongoing schedules to the new batch
        foreach ($uniqueSchedules as $schedule) {
            LecturerSchedule::create([
                'lecturer_id' => $schedule->lecturer_id,
                'prog_subj_id' => $schedule->prog_subj_id,
                'room_code' => $schedule->room_code,
                'class_id' => $schedule->class_id,
                'sy_term_id' => $schedule->sy_term_id,
                'day' => $schedule->day,
                'start_time' => $schedule->start_time,
                'end_time' => $schedule->end_time,
                'batch_no' => $newBatchNo, // Assign to the new batch
            ]);
        }

        return count($uniqueSchedules);
    }
}
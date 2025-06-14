<?php

namespace App\Http\Controllers;

use App\Models\LecturerSchedule;
use App\Http\Requests\StoreLecturerScheduleRequest;
use App\Http\Requests\UpdateLecturerScheduleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LecturerScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = 5;
        $search = $request->query('search', '');

        $lecturerSchedules = LecturerSchedule::with(['lecturer', 'subject', 'room', 'timeSlot'])
                                            ->whereHas('lecturer', function($query) use ($search) {
                                                $query->where('name', 'LIKE', "%$search%");
                                            })
                                            ->orWhereHas('subject', function($query) use ($search) {
                                                $query->where('name', 'LIKE', "%$search%");
                                            })
                                            ->paginate($perPage);

        return Inertia::render('application/lecturer-schedule', [
            'lecturerSchedules' => [
                'data' => $lecturerSchedules->items(),
                'last_page' => $lecturerSchedules->lastPage(),
                'current_page' => $lecturerSchedules->currentPage(),
                'total' => $lecturerSchedules->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerScheduleRequest $request)
    {
        LecturerSchedule::create($request->validated());
        return Inertia::render('application/lecturer-schedule');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $lecturerSchedule = LecturerSchedule::findOrFail($id);
        return Inertia::render('application/lecturer-schedule', [
            'lecturerSchedule' => $lecturerSchedule
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLecturerScheduleRequest $request, int $id)
    {
        $ls = LecturerSchedule::find($id);
        $ls->lecturer_id = $request->lecturer_id;
        $ls->subject_id = $request->subject_id;
        $ls->room_id = $request->room_id;
        $ls->time_slot_id = $request->time_slot_id;
        $ls->day_of_week = $request->day_of_week;
        $ls->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $lecturerSchedule = LecturerSchedule::findOrFail($id);
        $lecturerSchedule->delete();
    }
}

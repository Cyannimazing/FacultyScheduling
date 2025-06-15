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
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = 5;

        $lecturerSchedules = LecturerSchedule::with(['lecturer', 'subject', 'room', 'timeSlot'])
                                            ->whereHas('lecturer', function($query) use ($search) {
                                                $query->where('name', 'LIKE', "%$search%");
                                            })
                                            ->orWhereHas('subject', function($query) use ($search) {
                                                $query->where('name', 'LIKE', "%$search%");
                                            })
                                            ->orderBy('day_of_week')
                                            ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/lecturer-schedule', [
            'lecturerSchedules' => $lecturerSchedules,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerScheduleRequest $request)
    {
        $validated = $request->validated();

        LecturerSchedule::create($validated);

        return redirect()->route('lecturer-schedule')->with('success', 'Lecturer Schedule created successfully.');
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
        $lecturerSchedule = LecturerSchedule::find($id);
        if($lecturerSchedule){
            $lecturerSchedule->update([
                'lecturer_id' => $request->lecturer_id,
                'subj_code' => $request->subj_code,
                'room_code' => $request->room_code,
                'time_slot_id' => $request->time_slot_id,
                'class_id' => $request->class_id,
                'sy_term_id' => $request->sy_term_id
            ]);
        }
        return redirect()->route('lecturer-schedule')->with('success', 'Lecturer Schedule updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LecturerSchedule $lecturerSchedule)
    {
        $lecturerSchedule->delete();

        return redirect()->route('lecturer-schedule')->with('success', 'Lecturer Schedule deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\TimeSlot;
use App\Http\Requests\StoreTimeSlotRequest;
use App\Http\Requests\UpdateTimeSlotRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimeSlotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = 5;

        $timeSlots = TimeSlot::where('start_time', 'LIKE', "%$search%")
                            ->orWhere('end_time', 'LIKE', "%$search%")
                            ->orderBy('start_time')
                            ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/timeslot', [
            'timeSlots' => $timeSlots,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTimeSlotRequest $request)
    {
        $validated = $request->validated();

        TimeSlot::create($validated);

        return redirect()->route('time-slot')->with('success', 'Time Slot created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $timeSlot = TimeSlot::findOrFail($id);
        return Inertia::render('application/timeslot', [
            'timeSlot' => $timeSlot
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTimeSlotRequest $request, int $id)
    {
        $timeSlot = TimeSlot::find($id);
        if($timeSlot){
            $timeSlot->update([
                'start_time' => $request->start_time,
                'end_time' => $request->end_time
            ]);
        }
        return redirect()->route('time-slot')->with('success', 'Time Slot updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TimeSlot $timeSlot)
    {
        $timeSlot->delete();

        return redirect()->route('time-slot')->with('success', 'Time Slot deleted successfully.');
    }
}

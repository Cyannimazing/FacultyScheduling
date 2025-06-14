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
        $perPage = 5;
        $search = $request->query('search', '');

        $timeSlots = TimeSlot::where('start_time', 'LIKE', "%$search%")
                            ->orWhere('end_time', 'LIKE', "%$search%")
                            ->paginate($perPage);

        return Inertia::render('application/timeslot', [
            'timeSlots' => [
                'data' => $timeSlots->items(),
                'last_page' => $timeSlots->lastPage(),
                'current_page' => $timeSlots->currentPage(),
                'total' => $timeSlots->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTimeSlotRequest $request)
    {
        TimeSlot::create($request->validated());
        return Inertia::render('application/timeslot');
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
        $t = TimeSlot::find($id);
        $t->start_time = $request->start_time;
        $t->end_time = $request->end_time;
        $t->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $timeSlot = TimeSlot::findOrFail($id);
        $timeSlot->delete();
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\TimeSlot;
use App\Http\Requests\StoreTimeSlotRequest;
use App\Http\Requests\UpdateTimeSlotRequest;

class TimeSlotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $timeSlots = TimeSlot::all();
        return response()->json($timeSlots);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTimeSlotRequest $request)
    {
        $timeSlot = TimeSlot::create($request->validated());
        return response()->json($timeSlot, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TimeSlot $timeSlot)
    {
        return response()->json($timeSlot);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTimeSlotRequest $request, TimeSlot $timeSlot)
    {
        $timeSlot->update($request->validated());
        return response()->json($timeSlot);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TimeSlot $timeSlot)
    {
        $timeSlot->delete();
        return response()->json(null, 204);
    }
}

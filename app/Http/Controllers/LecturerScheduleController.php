<?php

namespace App\Http\Controllers;

use App\Models\LecturerSchedule;
use App\Http\Requests\StoreLecturerScheduleRequest;
use App\Http\Requests\UpdateLecturerScheduleRequest;

class LecturerScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lecturerSchedules = LecturerSchedule::all();
        return response()->json($lecturerSchedules);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerScheduleRequest $request)
    {
        $lecturerSchedule = LecturerSchedule::create($request->validated());
        return response()->json($lecturerSchedule, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(LecturerSchedule $lecturerSchedule)
    {
        return response()->json($lecturerSchedule);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLecturerScheduleRequest $request, LecturerSchedule $lecturerSchedule)
    {
        $lecturerSchedule->update($request->validated());
        return response()->json($lecturerSchedule);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LecturerSchedule $lecturerSchedule)
    {
        $lecturerSchedule->delete();
        return response()->json(null, 204);
    }
}

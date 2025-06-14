<?php

namespace App\Http\Controllers;

use App\Models\AcademicCalendar;
use App\Http\Requests\StoreAcademicCalendarRequest;
use App\Http\Requests\UpdateAcademicCalendarRequest;

class AcademicCalendarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $academicCalendars = AcademicCalendar::all();
        return response()->json($academicCalendars);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAcademicCalendarRequest $request)
    {
        $academicCalendar = AcademicCalendar::create($request->validated());
        return response()->json($academicCalendar, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(AcademicCalendar $academicCalendar)
    {
        return response()->json($academicCalendar);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAcademicCalendarRequest $request, AcademicCalendar $academicCalendar)
    {
        $academicCalendar->update($request->validated());
        return response()->json($academicCalendar);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicCalendar $academicCalendar)
    {
        $academicCalendar->delete();
        return response()->json(null, 204);
    }
}

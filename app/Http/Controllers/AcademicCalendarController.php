<?php

namespace App\Http\Controllers;

use App\Models\AcademicCalendar;
use App\Http\Requests\StoreAcademicCalendarRequest;
use App\Http\Requests\UpdateAcademicCalendarRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicCalendarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = 5;
        $search = $request->query('search', '');

        $academicCalendars = AcademicCalendar::where('name', 'LIKE', "%$search%")
                                           ->orWhere('description', 'LIKE', "%$search%")
                                           ->paginate($perPage);

        return Inertia::render('application/academic-calendar', [
            'academicCalendars' => [
                'data' => $academicCalendars->items(),
                'last_page' => $academicCalendars->lastPage(),
                'current_page' => $academicCalendars->currentPage(),
                'total' => $academicCalendars->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAcademicCalendarRequest $request)
    {
        AcademicCalendar::create($request->validated());
        return Inertia::render('application/academic-calendar');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $academicCalendar = AcademicCalendar::findOrFail($id);
        return Inertia::render('application/academic-calendar', [
            'academicCalendar' => $academicCalendar
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAcademicCalendarRequest $request, int $id)
    {
        $ac = AcademicCalendar::find($id);
        $ac->name = $request->name;
        $ac->description = $request->description;
        $ac->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $academicCalendar = AcademicCalendar::findOrFail($id);
        $academicCalendar->delete();
    }
}

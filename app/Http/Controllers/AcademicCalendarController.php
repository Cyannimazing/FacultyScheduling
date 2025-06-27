<?php

namespace App\Http\Controllers;

use App\Models\AcademicCalendar;
use App\Http\Requests\StoreAcademicCalendarRequest;
use App\Http\Requests\UpdateAcademicCalendarRequest;
use App\Models\Term;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicCalendarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = 5;

        $academicCalendars = AcademicCalendar::with(['term', 'program'])
            ->where('school_year', 'LIKE', "%$search%")
            ->orWhereHas('term', function ($query) use ($search) {
                $query->where('name', 'LIKE', "%$search%");
            })
            ->orWhereHas('program', function ($query) use ($search) {
                $query->where('code', 'LIKE', "%$search%")
                      ->orWhere('description', 'LIKE', "%$search%");
            })
            ->orderBy('school_year')
            ->paginate($perPage, ['*'], 'page', $page);

        $terms = Term::select(['id', 'name'])->orderBy('name')->get();
        $programs = Program::select(['id', 'code', 'description'])->orderBy('code')->get();

        return Inertia::render('application/calendar', [
            'data'=> [
                'academicCalendars' => $academicCalendars,
                'terms' => $terms,
                'programs' => $programs
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAcademicCalendarRequest $request)
    {
        $validated = $request->validated();

        AcademicCalendar::create($validated);

        return redirect()->route('calendar')->with('success', 'Academic Calendar created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $academicCalendar = AcademicCalendar::findOrFail($id);
        return Inertia::render('application/calendar', [
            'academicCalendar' => $academicCalendar
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAcademicCalendarRequest $request, int $id)
    {
        $academicCalendar = AcademicCalendar::findOrFail($id);
        $validated = $request->validated();
        
        $academicCalendar->update($validated);
        
        return redirect()->route('calendar')->with('success', 'Academic Calendar updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicCalendar $academicCalendar)
    {
        $academicCalendar->delete();

        return redirect()->route('calendar')->with('success', 'Academic Calendar deleted successfully.');
    }
}

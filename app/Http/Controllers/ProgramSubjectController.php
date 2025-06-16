<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ProgramSubject;
use App\Http\Requests\StoreProgramSubjectRequest;
use App\Http\Requests\UpdateProgramSubjectRequest;
use App\Models\Subject;
use App\Models\Term;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramSubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $programFilter = $request->input('programFilter');

        $totalAssignment = ProgramSubject::all()->count();
        $totalProgramWithSubject = ProgramSubject::distinct('prog_code')->count();
        $totalSubjectAssigned = ProgramSubject::distinct('subj_code')->count();

        $programs = Program::all();
        $subjects = Subject::where(function ($query) use ($search) {
                    $query->where('name', 'LIKE', "%$search%")
                        ->orWhere('code', 'LIKE', "%$search%");
                })->orderBy('name')
                ->get();
        $terms = Term::all();

        $programSubjects = ProgramSubject::with(['program', 'subject'])
                        ->where('prog_code', 'LIKE', "%$programFilter%")
                        ->orderBy('prog_code')
                        ->get();

        return Inertia::render('application/course-assignment', [
            'data' => [
                'totalAssignment' => $totalAssignment,
                'totalProgramWithSubject' => $totalProgramWithSubject,
                'totalSubjectAssigned' => $totalSubjectAssigned,
                'programs' => $programs,
                'subjects' => $subjects,
                'terms' => $terms,
                'programSubjects' => $programSubjects
            ]
        ]);

        // return response()->json([

        // ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProgramSubjectRequest $request)
    {
        $validated = $request->validated();

        ProgramSubject::create($validated);

        return redirect()->route('course-assignment')->with('success', 'Program Subject created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $programSubject = ProgramSubject::findOrFail($id);
        return Inertia::render('application/course-assignment', [
            'programSubject' => $programSubject
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProgramSubjectRequest $request, int $id)
    {
        $programSubject = ProgramSubject::find($id);
        if($programSubject){
            $programSubject->update([
                'program_id' => $request->program_id,
                'subject_id' => $request->subject_id
            ]);
        }
        return redirect()->route('course-assignment')->with('success', 'Program Subject updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $programSubject = ProgramSubject::find($id);
        if($programSubject){
            $programSubject->delete();
        }
        return redirect()->route('course-assignment')->with('success', 'Program Subject deleted successfully.');
    }
}

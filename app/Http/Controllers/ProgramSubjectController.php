<?php

namespace App\Http\Controllers;

use App\Models\ProgramSubject;
use App\Http\Requests\StoreProgramSubjectRequest;
use App\Http\Requests\UpdateProgramSubjectRequest;
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
        $page = $request->input('page', 1);
        $perPage = 5;

        $programSubjects = ProgramSubject::with(['program', 'subject'])
                                         ->whereHas('program', function($query) use ($search) {
                                             $query->where('name', 'LIKE', "%$search%");
                                         })
                                         ->orWhereHas('subject', function($query) use ($search) {
                                             $query->where('name', 'LIKE', "%$search%");
                                         })
                                         ->orderBy('id')
                                         ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/course-assignment', [
            'programSubjects' => $programSubjects,
        ]);
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
    public function destroy(ProgramSubject $programSubject)
    {
        $programSubject->delete();

        return redirect()->route('course-assignment')->with('success', 'Program Subject deleted successfully.');
    }
}

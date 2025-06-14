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
        $perPage = 5;
        $search = $request->query('search', '');

        $programSubjects = ProgramSubject::with(['program', 'subject'])
                                         ->whereHas('program', function($query) use ($search) {
                                             $query->where('name', 'LIKE', "%$search%");
                                         })
                                         ->orWhereHas('subject', function($query) use ($search) {
                                             $query->where('name', 'LIKE', "%$search%");
                                         })
                                         ->paginate($perPage);

        return Inertia::render('application/program-subject', [
            'programSubjects' => [
                'data' => $programSubjects->items(),
                'last_page' => $programSubjects->lastPage(),
                'current_page' => $programSubjects->currentPage(),
                'total' => $programSubjects->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProgramSubjectRequest $request)
    {
        ProgramSubject::create($request->validated());
        return Inertia::render('application/program-subject');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $programSubject = ProgramSubject::findOrFail($id);
        return Inertia::render('application/program-subject', [
            'programSubject' => $programSubject
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProgramSubjectRequest $request, int $id)
    {
        $ps = ProgramSubject::find($id);
        $ps->program_id = $request->program_id;
        $ps->subject_id = $request->subject_id;
        $ps->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $programSubject = ProgramSubject::findOrFail($id);
        $programSubject->delete();
    }
}

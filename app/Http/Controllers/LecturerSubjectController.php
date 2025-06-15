<?php

namespace App\Http\Controllers;

use App\Models\LecturerSubject;
use App\Http\Requests\StoreLecturerSubjectRequest;
use App\Http\Requests\UpdateLecturerSubjectRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LecturerSubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = 5;

        $lecturerSubjects = LecturerSubject::with(['lecturer', 'subject'])
                                          ->whereHas('lecturer', function($query) use ($search) {
                                              $query->where('name', 'LIKE', "%$search%");
                                          })
                                          ->orWhereHas('subject', function($query) use ($search) {
                                              $query->where('name', 'LIKE', "%$search%");
                                          })
                                          ->orderBy('id')
                                          ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/lecturer-subject', [
            'lecturerSubjects' => $lecturerSubjects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerSubjectRequest $request)
    {
        $validated = $request->validated();

        LecturerSubject::create($validated);

        return redirect()->route('lecturer-subject')->with('success', 'Lecturer Subject created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $lecturerSubject = LecturerSubject::findOrFail($id);
        return Inertia::render('application/lecturer-subject', [
            'lecturerSubject' => $lecturerSubject
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLecturerSubjectRequest $request, int $id)
    {
        $lecturerSubject = LecturerSubject::find($id);
        if($lecturerSubject){
            $lecturerSubject->update([
                'lecturer_id' => $request->lecturer_id,
                'subject_id' => $request->subject_id
            ]);
        }
        return redirect()->route('lecturer-subject')->with('success', 'Lecturer Subject updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LecturerSubject $lecturerSubject)
    {
        $lecturerSubject->delete();

        return redirect()->route('lecturer-subject')->with('success', 'Lecturer Subject deleted successfully.');
    }
}

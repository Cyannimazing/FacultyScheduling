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
        $perPage = 5;
        $search = $request->query('search', '');

        $lecturerSubjects = LecturerSubject::with(['lecturer', 'subject'])
                                          ->whereHas('lecturer', function($query) use ($search) {
                                              $query->where('name', 'LIKE', "%$search%");
                                          })
                                          ->orWhereHas('subject', function($query) use ($search) {
                                              $query->where('name', 'LIKE', "%$search%");
                                          })
                                          ->paginate($perPage);

        return Inertia::render('application/lecturer-subject', [
            'lecturerSubjects' => [
                'data' => $lecturerSubjects->items(),
                'last_page' => $lecturerSubjects->lastPage(),
                'current_page' => $lecturerSubjects->currentPage(),
                'total' => $lecturerSubjects->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerSubjectRequest $request)
    {
        LecturerSubject::create($request->validated());
        return Inertia::render('application/lecturer-subject');
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
        $ls = LecturerSubject::find($id);
        $ls->lecturer_id = $request->lecturer_id;
        $ls->subject_id = $request->subject_id;
        $ls->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $lecturerSubject = LecturerSubject::findOrFail($id);
        $lecturerSubject->delete();
    }
}

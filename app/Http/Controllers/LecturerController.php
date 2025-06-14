<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use App\Http\Requests\StoreLecturerRequest;
use App\Http\Requests\UpdateLecturerRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LecturerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = 5;
        $search = $request->query('search', '');

        $lecturers = Lecturer::where('name', 'LIKE', "%$search%")->paginate($perPage);

        return Inertia::render('application/lecturer', [
            'lecturers' => [
                'data' => $lecturers->items(),
                'last_page' => $lecturers->lastPage(),
                'current_page' => $lecturers->currentPage(),
                'total' => $lecturers->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerRequest $request)
    {
        Lecturer::create($request->validated());
        return Inertia::render('application/lecturer');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $lecturer = Lecturer::findOrFail($id);
        return Inertia::render('application/lecturer', [
            'lecturer' => $lecturer
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLecturerRequest $request, int $id)
    {
        $l = Lecturer::find($id);
        $l->name = $request->name;
        $l->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $lecturer = Lecturer::findOrFail($id);
        $lecturer->delete();
    }
}

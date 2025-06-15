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
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = 5;

        $lecturers = Lecturer::whereRaw("CONCAT(title, ' ', fname, ' ', lname) LIKE ?", ["%$search%"])
                        ->orderBy('name')
                        ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/lecturer', [
            'lecturers' => $lecturers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerRequest $request)
    {
        $validated = $request->validated();

        Lecturer::create($validated);

        return redirect()->route('lecturer')->with('success', 'Lecturer created successfully.');
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
        $lecturer = Lecturer::find($id);
        if($lecturer){
            $lecturer->update([
                'title' => $request->input('title'),
                'fname' => $request->input('fname'),
                'lname' => $request->input('lname'),
            ]);
        }
        return redirect()->route('lecturer')->with('success', 'Lecturer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lecturer $lecturer)
    {
        $lecturer->delete();

        return redirect()->route('lecturer')->with('success', 'Lecturer deleted successfully.');
    }
}

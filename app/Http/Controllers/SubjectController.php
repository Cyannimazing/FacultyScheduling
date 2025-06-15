<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = 5;

        $subjects = Subject::where('name', 'LIKE', "%$search%")
                        ->orderBy('name')
                        ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/subject', [
            'subjects' => $subjects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubjectRequest $request)
    {
        $validated = $request->validated();

        Subject::create($validated);

        return redirect()->route('subject')->with('success', 'Subject created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $subject = Subject::findOrFail($id);
        return Inertia::render('application/subject', [
            'subject' => $subject
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubjectRequest $request, int $id)
    {
        $subject = Subject::find($id);
        if($subject){
            $subject->update([
                'name' => $request->name
            ]);
        }
        return redirect()->route('subject')->with('success', 'Subject updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        $subject->delete();

        return redirect()->route('subject')->with('success', 'Subject deleted successfully.');
    }
}

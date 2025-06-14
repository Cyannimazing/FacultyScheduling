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
        $perPage = 5;
        $search = $request->query('search', '');

        $subjects = Subject::where('name', 'LIKE', "%$search%")->paginate($perPage);

        return Inertia::render('application/subject', [
            'subjects' => [
                'data' => $subjects->items(),
                'last_page' => $subjects->lastPage(),
                'current_page' => $subjects->currentPage(),
                'total' => $subjects->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubjectRequest $request)
    {
        Subject::create($request->validated());
        return Inertia::render('application/subject');
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
        $s = Subject::find($id);
        $s->name = $request->name;
        $s->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();
    }
}

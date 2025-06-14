<?php

namespace App\Http\Controllers;

use App\Models\ProgramSubject;
use App\Http\Requests\StoreProgramSubjectRequest;
use App\Http\Requests\UpdateProgramSubjectRequest;

class ProgramSubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $programSubjects = ProgramSubject::all();
        return response()->json($programSubjects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProgramSubjectRequest $request)
    {
        $programSubject = ProgramSubject::create($request->validated());
        return response()->json($programSubject, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProgramSubject $programSubject)
    {
        return response()->json($programSubject);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProgramSubjectRequest $request, ProgramSubject $programSubject)
    {
        $programSubject->update($request->validated());
        return response()->json($programSubject);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProgramSubject $programSubject)
    {
        $programSubject->delete();
        return response()->json(null, 204);
    }
}

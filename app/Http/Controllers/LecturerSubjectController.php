<?php

namespace App\Http\Controllers;

use App\Models\LecturerSubject;
use App\Http\Requests\StoreLecturerSubjectRequest;
use App\Http\Requests\UpdateLecturerSubjectRequest;

class LecturerSubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lecturerSubjects = LecturerSubject::all();
        return response()->json($lecturerSubjects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerSubjectRequest $request)
    {
        $lecturerSubject = LecturerSubject::create($request->validated());
        return response()->json($lecturerSubject, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(LecturerSubject $lecturerSubject)
    {
        return response()->json($lecturerSubject);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLecturerSubjectRequest $request, LecturerSubject $lecturerSubject)
    {
        $lecturerSubject->update($request->validated());
        return response()->json($lecturerSubject);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LecturerSubject $lecturerSubject)
    {
        $lecturerSubject->delete();
        return response()->json(null, 204);
    }
}

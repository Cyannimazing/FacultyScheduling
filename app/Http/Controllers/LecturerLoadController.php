<?php

namespace App\Http\Controllers;

use App\Models\LecturerLoad;
use App\Http\Requests\StoreLecturerLoadRequest;
use App\Http\Requests\UpdateLecturerLoadRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LecturerLoadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lecturerLoad = LecturerLoad::first();

        return Inertia::render('Lecturer/Index', [
            'lecturerLoad' => $lecturerLoad
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Check if lecturer load already exists
        $existingLoad = LecturerLoad::first();

        if ($existingLoad) {
            return back()->withErrors([
                'message' => 'Lecturer load configuration already exists. Please edit the existing configuration.'
            ]);
        }

        return Inertia::render('LecturerLoad/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerLoadRequest $request)
    {
        // Check if lecturer load already exists (only allow one configuration)
        $existingLoad = LecturerLoad::first();

        if ($existingLoad) {
            return back()->withErrors([
                'message' => 'Lecturer load configuration already exists. Please edit the existing configuration.'
            ]);
        }

        $lecturerLoad = LecturerLoad::create([
            'max_load' => $request->validated()['max_load']
        ]);

        return redirect()->route('lecturer')->with('success', 'Lecturer Load created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(LecturerLoad $lecturerLoad)
    {
        return Inertia::render('LecturerLoad/Show', [
            'lecturerLoad' => $lecturerLoad
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LecturerLoad $lecturerLoad)
    {
        return Inertia::render('LecturerLoad/Edit', [
            'lecturerLoad' => $lecturerLoad
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLecturerLoadRequest $request, LecturerLoad $lecturerLoad)
    {
        $lecturerLoad->update([
            'max_load' => $request->validated()['max_load']
        ]);

        return redirect()->route('lecturer')->with('success', 'Lecturer Load created successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LecturerLoad $lecturerLoad)
    {
        $lecturerLoad->delete();

        return back()->with([
            'message' => 'Lecturer load configuration deleted successfully.',
            'lecturerLoad' => null
        ]);
    }

    /**
     * Get the current lecturer load configuration
     */
    public function current()
    {
        $lecturerLoad = LecturerLoad::first();

        return response()->json([
            'lecturerLoad' => $lecturerLoad
        ]);
    }
}

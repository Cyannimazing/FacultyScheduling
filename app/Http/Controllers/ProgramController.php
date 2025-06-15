<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Http\Requests\StoreProgramRequest;
use App\Http\Requests\UpdateProgramRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = 5;

        $programs = Program::where('name', 'LIKE', "%$search%")
                        ->orWhere('code', 'LIKE', "%$search%")
                        ->orderBy('name')
                        ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/program', [
            'data' => [
                'programs' => $programs
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProgramRequest $request)
    {
        $validated = $request->validated();

        Program::create($validated);

        return redirect()->route('program')->with('success', 'Program created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $program = Program::findOrFail($id);
        return Inertia::render('application/program', [
            'program' => $program
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProgramRequest $request, int $id)
    {
        $program = Program::find($id);
        if($program){
            $program->update([
                'code' => $request->code,
                'name' => $request->name,
                'description' => $request->description,
                'number_of_year' => $request->number_of_year
            ]);
        }
        return redirect()->route('program')->with('success', 'Program updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Program $program)
    {
        $program->delete();

        return redirect()->route('program')->with('success', 'Program deleted successfully.');
    }
}

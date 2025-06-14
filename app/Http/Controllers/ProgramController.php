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
        $perPage = 5;
        $search = $request->query('search', '');

        $programs = Program::where('name', 'LIKE', "%$search%")->paginate($perPage);

        return Inertia::render('application/program', [
            'programs' => [
                'data' => $programs->items(),
                'last_page' => $programs->lastPage(),
                'current_page' => $programs->currentPage(),
                'total' => $programs->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProgramRequest $request)
    {
        Program::create($request->validated());
        return Inertia::render('application/program');
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
        $p = Program::find($id);
        $p->name = $request->name;
        $p->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $program = Program::findOrFail($id);
        $program->delete();
    }
}

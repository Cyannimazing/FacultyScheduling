<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $prog_code = $request->input('prog_code');
        $page = $request->input('page', 1);
        $perPage = 5;

        $groups = Group::with('program')
                    ->where('name', 'LIKE', "%$search%")
                    ->whereHas('program', function($query) use ($prog_code){
                        $query->where('code', 'LIKE', "%$prog_code%");
                    })
                    ->orderBy('name')
                    ->paginate($perPage, ['*'], 'page', $page);

        $programs = Program::select(['code', 'name'])->orderBy('name')->get();

        return Inertia::render('application/class', [
            'data' => [
                'groups' => $groups,
                'programs' => $programs
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        $validated = $request->validated();

        Group::create($validated);

        return redirect()->route('class')->with('success', 'Group created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $group = Group::findOrFail($id);
        return Inertia::render('application/class', [
            'class' => $group
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, int $id)
    {
        $group = Group::find($id);
        if($group){
            $group->update([
                'name' => $request->name,
                'prog_code' => $request->prog_code
            ]);
        }
        return redirect()->route('class')->with('success', 'Group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        $group->delete();

        return redirect()->route('class')->with('success', 'Group deleted successfully.');
    }
}

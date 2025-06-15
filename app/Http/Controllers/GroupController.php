<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
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
        $page = $request->input('page', 1);
        $perPage = 5;

        $groups = Group::where('name', 'LIKE', "%$search%")
                        ->orderBy('name')
                        ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/group', [
            'groups' => $groups,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        $validated = $request->validated();

        Group::create($validated);

        return redirect()->route('group')->with('success', 'Group created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $group = Group::findOrFail($id);
        return Inertia::render('application/group', [
            'group' => $group
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
                'name' => $request->name
            ]);
        }
        return redirect()->route('group')->with('success', 'Group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        $group->delete();

        return redirect()->route('group')->with('success', 'Group deleted successfully.');
    }
}

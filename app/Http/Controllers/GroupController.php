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
        $perPage = 5;
        $search = $request->query('search', '');

        $groups = Group::where('name', 'LIKE', "%$search%")->paginate($perPage);

        return Inertia::render('application/group', [
            'groups' => [
                'data' => $groups->items(),
                'last_page' => $groups->lastPage(),
                'current_page' => $groups->currentPage(),
                'total' => $groups->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        Group::create($request->validated());
        return Inertia::render('application/group');
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
        $g = Group::find($id);
        $g->name = $request->name;
        $g->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $group = Group::findOrFail($id);
        $group->delete();
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = 5;
        $search = $request->query('search', '');

        $rooms = Room::where('name', 'LIKE', "%$search%")->paginate($perPage);

        return Inertia::render('application/room', [
            'rooms' => [
                'data' => $rooms->items(),
                'last_page' => $rooms->lastPage(),
                'current_page' => $rooms->currentPage(),
                'total' => $rooms->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomRequest $request)
    {
        Room::create($request->validated());
        return Inertia::render('application/room');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $room = Room::findOrFail($id);
        return Inertia::render('application/room', [
            'room' => $room
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomRequest $request, int $id)
    {
        $r = Room::find($id);
        $r->name = $request->name;
        $r->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $room = Room::findOrFail($id);
        $room->delete();
    }
}

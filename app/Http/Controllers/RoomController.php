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
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = 5;

        $rooms = Room::where('name', 'LIKE', "%$search%")
                        ->orderBy('name')
                        ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/room', [
           'data' => [
                'rooms' => $rooms
           ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomRequest $request)
    {
        $validated = $request->validated();

        Room::create($validated);

        return redirect()->route('room')->with('success', 'Room created successfully.');
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
        $room = Room::find($id);
        if($room){
            $room->update([
                'name' => $request->name
            ]);
        }
        return redirect()->route('room')->with('success', 'Room updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        $room->delete();

        return redirect()->route('room')->with('success', 'Room deleted successfully.');
    }
}

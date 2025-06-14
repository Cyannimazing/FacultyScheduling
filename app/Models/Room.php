<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    /** @use HasFactory<\Database\Factories\RoomFactory> */
    use HasFactory;

    protected $fillable = ['name', 'created_at', 'updated_at'];

    /**
     * Get the lecturer schedules for the room.
     */
    public function lecturerSchedules(): HasMany
    {
        return $this->hasMany(LecturerSchedule::class, 'room_code', 'name');
    }
}

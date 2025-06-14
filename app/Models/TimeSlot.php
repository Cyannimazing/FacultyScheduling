<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimeSlot extends Model
{
    /** @use HasFactory<\Database\Factories\TimeSlotFactory> */
    use HasFactory;

    // UNIQUE (day, time)
    protected $fillable = ['day', 'time'];

    /**
     * Get the lecturer schedules for the time slot.
     */
    public function lecturerSchedules(): HasMany
    {
        return $this->hasMany(LecturerSchedule::class);
    }
}

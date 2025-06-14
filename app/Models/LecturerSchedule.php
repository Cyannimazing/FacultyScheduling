<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LecturerSchedule extends Model
{
    /** @use HasFactory<\Database\Factories\LecturerScheduleFactory> */
    use HasFactory;

    //UNIQUE (room_code, time_slot_id, sy_term_id),
    // UNIQUE (lecturer_id, time_slot_id, sy_term_id),
    // UNIQUE (class_id, time_slot_id, sy_term_id),
    protected $fillable = ['lecturer_id', 'subj_code', 'room_code', 'time_slot_id', 'class_id', 'sy_term_id', 'created_at'];

    /**
     * Get the lecturer that owns the lecturer schedule.
     */
    public function lecturer(): BelongsTo
    {
        return $this->belongsTo(Lecturer::class);
    }

    /**
     * Get the subject that owns the lecturer schedule.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subj_code', 'code');
    }

    /**
     * Get the room that owns the lecturer schedule.
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_code', 'name');
    }

    /**
     * Get the time slot that owns the lecturer schedule.
     */
    public function timeSlot(): BelongsTo
    {
        return $this->belongsTo(TimeSlot::class);
    }

    /**
     * Get the group that owns the lecturer schedule.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'class_id', 'id');
    }

    /**
     * Get the academic calendar that owns the lecturer schedule.
     */
    public function academicCalendar(): BelongsTo
    {
        return $this->belongsTo(AcademicCalendar::class, 'sy_term_id', 'id');
    }
}

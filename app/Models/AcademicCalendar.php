<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicCalendar extends Model
{
    /** @use HasFactory<\Database\Factories\AcademicCalendarFactory> */
    use HasFactory;

    // UNIQUE (start_date, end_date),
    protected $fillable = ['term_id', 'school_year', 'start_date', 'end_date', 'prog_id','created_at', 'updated_at'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the term that owns the academic calendar.
     */
    public function term(): BelongsTo
    {
        return $this->belongsTo(Term::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class, 'prog_id');
    }

    /**
     * Get the lecturer subjects for the academic calendar.
     */
    public function lecturerSubjects(): HasMany
    {
        return $this->hasMany(LecturerSubject::class, 'sy_term_id', 'id');
    }

    /**
     * Get the lecturer schedules for the academic calendar.
     */
    public function lecturerSchedules(): HasMany
    {
        return $this->hasMany(LecturerSchedule::class, 'sy_term_id', 'id');
    }
}

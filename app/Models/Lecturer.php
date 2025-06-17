<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lecturer extends Model
{
    /** @use HasFactory<\Database\Factories\LecturerFactory> */
    use HasFactory;

    // UNIQUE (fname, lname)
    protected $fillable = ['title', 'fname', 'lname', 'created_at', 'updated_at'];

    /**
     * Get the subjects that belong to the lecturer.
     */
    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'lecturer_subjects', 'lecturer_id', 'prog_subj_id', 'id')
                    ->withPivot('sy_term_id')
                    ->withTimestamps();
    }

    /**
     * Get the lecturer subjects for the lecturer.
     */
    public function lecturerSubjects(): HasMany
    {
        return $this->hasMany(LecturerSubject::class);
    }

    /**
     * Get the lecturer schedules for the lecturer.
     */
    public function lecturerSchedules(): HasMany
    {
        return $this->hasMany(LecturerSchedule::class);
    }

    /**
     * Get the lecturer's full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->title . ' ' . $this->fname . ' ' . $this->lname;
    }
}

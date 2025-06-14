<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    /** @use HasFactory<\Database\Factories\SubjectFactory> */
    use HasFactory;

    // Unique(code)
    protected $fillable = ['code', 'name', 'unit', 'short', 'is_gen_ed', 'created_at', 'updated_at'];

    /**
     * Get the programs that belong to the subject.
     */
    public function programs(): BelongsToMany
    {
        return $this->belongsToMany(Program::class, 'program_subjects', 'subj_code', 'prog_code', 'code', 'code')
                    ->withPivot('year_level', 'term_id')
                    ->withTimestamps();
    }

    /**
     * Get the lecturers that belong to the subject.
     */
    public function lecturers(): BelongsToMany
    {
        return $this->belongsToMany(Lecturer::class, 'lecturer_subjects', 'subj_code', 'lecturer_id', 'code', 'id')
                    ->withPivot('sy_term_id')
                    ->withTimestamps();
    }

    /**
     * Get the program subjects for the subject.
     */
    public function programSubjects(): HasMany
    {
        return $this->hasMany(ProgramSubject::class, 'subj_code', 'code');
    }

    /**
     * Get the lecturer subjects for the subject.
     */
    public function lecturerSubjects(): HasMany
    {
        return $this->hasMany(LecturerSubject::class, 'subj_code', 'code');
    }

    /**
     * Get the lecturer schedules for the subject.
     */
    public function lecturerSchedules(): HasMany
    {
        return $this->hasMany(LecturerSchedule::class, 'subj_code', 'code');
    }
}

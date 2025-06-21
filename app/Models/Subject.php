<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    /** @use HasFactory<\Database\Factories\SubjectFactory> */
    use HasFactory;

    // Unique(code)
    protected $fillable = ['name', 'unit', 'is_gen_ed', 'created_at', 'updated_at'];

    /**
     * Get the programs that belong to the subject.
     */
    public function programs(): BelongsToMany
    {
        return $this->belongsToMany(Program::class, 'program_subjects', 'subj_id', 'prog_code', 'id', 'code')
                    ->withPivot('year_level', 'term_id')
                    ->withTimestamps();
    }

    /**
     * Get the program subjects for the subject.
     */
    public function programSubjects(): HasMany
    {
        return $this->hasMany(ProgramSubject::class, 'subj_id', 'id');
    }

    /**
     * Get the lecturer schedules for the subject.
     */
    public function lecturerSchedules(): HasMany
    {
        return $this->hasMany(LecturerSchedule::class, 'subj_id', 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Program extends Model
{
    /** @use HasFactory<\Database\Factories\ProgramFactory> */
    use HasFactory;

    // Unique(code)
    protected $fillable = ['code', 'type', 'description', 'number_of_year'];

    /**
     * Get the groups for the program.
     */
    public function groups(): HasMany
    {
        return $this->hasMany(Group::class, 'prog_code', 'code');
    }

    /**
     * Get the subjects that belong to the program.
     */
    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'program_subjects', 'prog_code', 'subj_code', 'code', 'code')
                    ->withPivot('year_level', 'term_id')
                    ->withTimestamps();
    }

    /**
     * Get the program subjects for the program.
     */
    public function programSubjects(): HasMany
    {
        return $this->hasMany(ProgramSubject::class, 'prog_code', 'code');
    }
}

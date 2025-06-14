<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Term extends Model
{
    /** @use HasFactory<\Database\Factories\TermFactory> */
    use HasFactory;

    protected $fillable = ['name', 'created_at', 'updated_at'];

    /**
     * Get the program subjects for the term.
     */
    public function programSubjects(): HasMany
    {
        return $this->hasMany(ProgramSubject::class);
    }

    /**
     * Get the academic calendars for the term.
     */
    public function academicCalendars(): HasMany
    {
        return $this->hasMany(AcademicCalendar::class);
    }
}

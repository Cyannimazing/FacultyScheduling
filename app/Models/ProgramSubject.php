<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgramSubject extends Model
{
    /** @use HasFactory<\Database\Factories\ProgramSubjectFactory> */
    use HasFactory;

    // PRIMARY KEY (prog_code, subj_code, term_id),
    protected $fillable = ['prog_code', 'subj_code', 'year_level', 'term_id', 'created_at', 'updated_at'];

    /**
     * Get the program that owns the program subject.
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class, 'prog_code', 'code');
    }

    /**
     * Get the subject that owns the program subject.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subj_code', 'code');
    }

    /**
     * Get the term that owns the program subject.
     */
    public function term(): BelongsTo
    {
        return $this->belongsTo(Term::class);
    }

    public function lecturerSubject(): HasMany
    {
        return $this->hasMany(LecturerSubject::class);
    }
}

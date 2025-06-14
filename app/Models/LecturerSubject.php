<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LecturerSubject extends Model
{
    /** @use HasFactory<\Database\Factories\LecturerSubjectFactory> */
    use HasFactory;

    // PRIMARY KEY (lecturer_id, subj_code),
    protected $fillable = ['lecturer_id', 'subj_code', 'sy_term_id', 'created_at', 'updated_at'];

    /**
     * Get the lecturer that owns the lecturer subject.
     */
    public function lecturer(): BelongsTo
    {
        return $this->belongsTo(Lecturer::class);
    }

    /**
     * Get the subject that owns the lecturer subject.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subj_code', 'code');
    }

    /**
     * Get the academic calendar that owns the lecturer subject.
     */
    public function academicCalendar(): BelongsTo
    {
        return $this->belongsTo(AcademicCalendar::class, 'sy_term_id', 'id');
    }
}

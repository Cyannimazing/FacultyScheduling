<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LecturerSubject extends Model
{
    /** @use HasFactory<\Database\Factories\LecturerSubjectFactory> */
    use HasFactory;

    // PRIMARY KEY (lecturer_id, prog_subj_id, sy_term_id)
    protected $fillable = ['lecturer_id', 'prog_subj_id', 'sy_term_id', 'created_at', 'updated_at'];

    /**
     * Get the lecturer that owns the lecturer subject.
     */
    public function lecturer()
    {
        return $this->belongsTo(Lecturer::class);
    }

    public function programSubject()
    {
        return $this->belongsTo(ProgramSubject::class, 'prog_subj_id');
    }

    public function academicCalendar()
    {
        return $this->belongsTo(AcademicCalendar::class, 'sy_term_id');
    }

}

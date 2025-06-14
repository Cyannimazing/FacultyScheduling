<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    /** @use HasFactory<\Database\Factories\GroupFactory> */
    use HasFactory;
    // UNIQUE (name, prog_code),
    protected $fillable = ['name', 'prog_code', 'created_at', 'updated_at'];

    /**
     * Get the program that owns the group.
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class, 'prog_code', 'code');
    }

    /**
     * Get the lecturer schedules for the group.
     */
    public function lecturerSchedules(): HasMany
    {
        return $this->hasMany(LecturerSchedule::class, 'class_id', 'id');
    }
}

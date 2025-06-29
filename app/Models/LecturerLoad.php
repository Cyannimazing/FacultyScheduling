<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LecturerLoad extends Model
{
    /** @use HasFactory<\Database\Factories\LecturerLoadFactory> */
    use HasFactory;

    protected $fillable = [
        'max_load',
        'created_at',
        'updated_at'
    ];
}

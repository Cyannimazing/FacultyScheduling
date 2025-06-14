<?php

namespace App\Policies;

use App\Models\LecturerSchedule;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LecturerSchedulePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LecturerSchedule $lecturerSchedule): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LecturerSchedule $lecturerSchedule): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LecturerSchedule $lecturerSchedule): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, LecturerSchedule $lecturerSchedule): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, LecturerSchedule $lecturerSchedule): bool
    {
        return false;
    }
}

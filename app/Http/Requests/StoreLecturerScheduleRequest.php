<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use Illuminate\Support\Facades\DB;

class StoreLecturerScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // You can implement proper authorization logic here
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'lecturer_id' => [
                'required',
                'integer',
                'exists:lecturers,id',
                // Note: Conflict checking is now handled by custom validation
                // which checks for overlapping schedules within the same batch
            ],
            'prog_subj_id' => 'required|integer|exists:program_subjects,id',
            'room_code' => [
                'required',
                'string',
                'exists:rooms,name',
                // Note: Conflict checking is now handled by custom validation
                // which checks for overlapping schedules within the same batch
            ],
            'day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => [
                'required',
                'date_format:H:i',
                'after:start_time'
            ],
            'class_id' => [
                'required',
                'integer',
                'exists:groups,id',
                // Note: Conflict checking is now handled by custom validation
                // which checks for overlapping schedules within the same batch
            ],
            'sy_term_id' => 'required|integer|exists:academic_calendars,id',
            'batch_no' => 'required|integer|min:1',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'lecturer_id.required' => 'Lecturer is required.',
            'lecturer_id.exists' => 'Selected lecturer does not exist.',
            'prog_subj_id.required' => 'Program Subject ID is required.',
            'prog_subj_id.exists' => 'Selected program subject does not exist.',
            'room_code.required' => 'Room is required.',
            'room_code.exists' => 'Selected room does not exist.',
            'day.required' => 'Day is required.',
            'day.in' => 'Please select a valid day.',
            'start_time.required' => 'Start time is required.',
            'start_time.date_format' => 'Start time must be in HH:MM format.',
            'end_time.required' => 'End time is required.',
            'end_time.date_format' => 'End time must be in HH:MM format.',
            'end_time.after' => 'End time must be after start time.',
            'class_id.required' => 'Class/Group is required.',
            'class_id.exists' => 'Selected class/group does not exist.',
            'sy_term_id.required' => 'Academic calendar/term is required.',
            'sy_term_id.exists' => 'Selected academic calendar/term does not exist.',
        ];
    }

    /**
     * Get custom validation attributes.
     */
    public function attributes(): array
    {
        return [
            'lecturer_id' => 'lecturer',
            'prog_subj_id' => 'program subject',
            'room_code' => 'room',
            'day' => 'day',
            'start_time' => 'start time',
            'end_time' => 'end time',
            'class_id' => 'class',
            'sy_term_id' => 'academic term',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            // Apply the same logic as database triggers
            $this->checkRoomAvailability($validator);
            $this->checkLecturerAvailability($validator);
            $this->checkClassAvailability($validator);
        });
    }

    /**
     * Check room availability - only within the same batch, regardless of term
     */
    protected function checkRoomAvailability(Validator $validator): void
    {
        $conflicts = DB::table('lecturer_schedules')
            ->where('room_code', $this->input('room_code'))
            ->where('day', $this->input('day'))
            ->where('batch_no', $this->input('batch_no')) // Only check within same batch
            ->where(function ($query) {
                // Check if time slots overlap
                $query->whereRaw('start_time < ?', [$this->input('end_time')])
                      ->whereRaw('end_time > ?', [$this->input('start_time')]);
            })
            ->exists();

        if ($conflicts) {
            $validator->errors()->add('room_code', 'Room is not available for this time slot - conflicts with existing schedule within the same batch');
        }
    }

    /**
     * Check lecturer availability - only within the same batch, regardless of term
     */
    protected function checkLecturerAvailability(Validator $validator): void
    {
        $conflicts = DB::table('lecturer_schedules')
            ->where('lecturer_id', $this->input('lecturer_id'))
            ->where('day', $this->input('day'))
            ->where('batch_no', $this->input('batch_no')) // Only check within same batch
            ->where(function ($query) {
                // Check if time slots overlap
                $query->whereRaw('start_time < ?', [$this->input('end_time')])
                      ->whereRaw('end_time > ?', [$this->input('start_time')]);
            })
            ->exists();

        if ($conflicts) {
            $validator->errors()->add('lecturer_id', 'Lecturer is not available for this time slot - conflicts with existing schedule within the same batch');
        }
    }

    /**
     * Check class availability - only within the same batch, regardless of term
     */
    protected function checkClassAvailability(Validator $validator): void
    {
        $conflicts = DB::table('lecturer_schedules')
            ->where('class_id', $this->input('class_id'))
            ->where('day', $this->input('day'))
            ->where('batch_no', $this->input('batch_no')) // Only check within same batch
            ->where(function ($query) {
                // Check if time slots overlap
                $query->whereRaw('start_time < ?', [$this->input('end_time')])
                      ->whereRaw('end_time > ?', [$this->input('start_time')]);
            })
            ->exists();

        if ($conflicts) {
            $validator->errors()->add('class_id', 'This group/class is not available for this time slot - conflicts with existing schedule within the same batch');
        }
    }
}

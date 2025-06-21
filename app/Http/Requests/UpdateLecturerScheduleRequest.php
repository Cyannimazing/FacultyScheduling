<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLecturerScheduleRequest extends FormRequest
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
        $lecturerScheduleId = $this->route('lecturerSchedule') ?? $this->route('facultySchedule');
        
        return [
            'lecturer_id' => [
                'required',
                'integer',
                'exists:lecturers,id',
                // Check if lecturer is already scheduled during this time and term (excluding current record)
                function ($attribute, $value, $fail) use ($lecturerScheduleId) {
                    $query = \App\Models\LecturerSchedule::where('lecturer_id', $value)
                        ->where('day', $this->input('day'))
                        ->where('sy_term_id', $this->input('sy_term_id'))
                        ->where(function ($query) {
                            $query->where('start_time', '<', $this->input('end_time'))
                                  ->where('end_time', '>', $this->input('start_time'));
                        });
                    
                    if ($lecturerScheduleId) {
                        $query->where('id', '!=', $lecturerScheduleId);
                    }
                    
                    if ($query->exists()) {
                        $fail('This lecturer is already scheduled during this time.');
                    }
                },
            ],
            'prog_subj_id' => 'required|integer|exists:program_subjects,id',
            'room_code' => [
                'required',
                'string',
                'exists:rooms,name',
                // Check if room is already booked during this time and term (excluding current record)
                function ($attribute, $value, $fail) use ($lecturerScheduleId) {
                    $query = \App\Models\LecturerSchedule::where('room_code', $value)
                        ->where('day', $this->input('day'))
                        ->where('sy_term_id', $this->input('sy_term_id'))
                        ->where(function ($query) {
                            $query->where('start_time', '<', $this->input('end_time'))
                                  ->where('end_time', '>', $this->input('start_time'));
                        });
                    
                    if ($lecturerScheduleId) {
                        $query->where('id', '!=', $lecturerScheduleId);
                    }
                    
                    if ($query->exists()) {
                        $fail('This room is already booked during this time.');
                    }
                },
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
                // Check if class is already scheduled during this time and term (excluding current record)
                function ($attribute, $value, $fail) use ($lecturerScheduleId) {
                    $query = \App\Models\LecturerSchedule::where('class_id', $value)
                        ->where('day', $this->input('day'))
                        ->where('sy_term_id', $this->input('sy_term_id'))
                        ->where(function ($query) {
                            $query->where('start_time', '<', $this->input('end_time'))
                                  ->where('end_time', '>', $this->input('start_time'));
                        });
                    
                    if ($lecturerScheduleId) {
                        $query->where('id', '!=', $lecturerScheduleId);
                    }
                    
                    if ($query->exists()) {
                        $fail('This class is already scheduled during this time.');
                    }
                },
            ],
            'sy_term_id' => 'required|integer|exists:academic_calendars,id',
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
}

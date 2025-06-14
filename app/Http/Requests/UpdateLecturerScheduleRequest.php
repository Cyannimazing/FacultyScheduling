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
        return [
            'lecturer_id' => 'required|integer|exists:lecturers,id',
            'subj_code' => 'required|string|exists:subjects,code',
            'room_code' => 'required|string|exists:rooms,name',
            'time_slot_id' => 'required|integer|exists:time_slots,id',
            'class_id' => 'required|integer|exists:groups,id',
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
            'subj_code.required' => 'Subject code is required.',
            'subj_code.exists' => 'Selected subject does not exist.',
            'room_code.required' => 'Room is required.',
            'room_code.exists' => 'Selected room does not exist.',
            'time_slot_id.required' => 'Time slot is required.',
            'time_slot_id.exists' => 'Selected time slot does not exist.',
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
            'subj_code' => 'subject',
            'room_code' => 'room',
            'time_slot_id' => 'time slot',
            'class_id' => 'class',
            'sy_term_id' => 'academic term',
        ];
    }
}

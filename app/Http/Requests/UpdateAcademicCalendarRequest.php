<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAcademicCalendarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $academicCalendarId = $this->route('academicCalendar') ?? $this->route('calendar');

        return [
            'term_id' => [
                'required',
                'integer',
                'exists:terms,id',
            ],
            'school_year' => 'required|regex:/^\d{4}-\d{4}$/|string',
            'start_date' => [
                'required',
                'date',
                'before:end_date',
            ],
            'end_date' => 'required|date|after:start_date',
            'prog_id' => [
                'required',
                'integer',
                'exists:programs,id',
            ],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'term_id.required' => 'Term is required.',
            'term_id.exists' => 'Selected term does not exist.',
            'school_year.required' => 'School year is required.',
            'school_year.regex' => 'School year must be in format YYYY-YYYY (e.g., 2024-2025).',
            'start_date.required' => 'Start date is required.',
            'start_date.date' => 'Start date must be a valid date.',
            'start_date.before' => 'Start date must be before end date.',
            'end_date.required' => 'End date is required.',
            'end_date.date' => 'End date must be a valid date.',
            'end_date.after' => 'End date must be after start date.',
            'prog_id.required' => 'Program is required.',
            'prog_id.integer' => 'Program must be a valid selection.',
            'prog_id.exists' => 'Selected program does not exist.',
        ];
    }

    /**
     * Get custom validation attributes.
     */
    public function attributes(): array
    {
        return [
            'term_id' => 'term',
            'school_year' => 'school year',
            'start_date' => 'start date',
            'end_date' => 'end date',
            'prog_id' => 'program',
        ];
    }
}

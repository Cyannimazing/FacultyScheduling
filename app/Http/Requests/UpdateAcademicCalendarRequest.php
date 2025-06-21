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
                // Unique validation for term_id + school_year combination (excluding current record)
                function ($attribute, $value, $fail) use ($academicCalendarId) {
                    $query = \App\Models\AcademicCalendar::where('term_id', $value)
                        ->where('school_year', $this->input('school_year'));
                    
                    if ($academicCalendarId) {
                        $query->where('id', '!=', $academicCalendarId);
                    }
                    
                    if ($query->exists()) {
                        $fail('This term already exists for the selected school year.');
                    }
                },
            ],
            'school_year' => 'required|regex:/^\d{4}-\d{4}$/|string',
            'start_date' => [
                'required',
                'date',
                'before:end_date',
                // Check for date overlaps with existing academic calendars (excluding current record)
                function ($attribute, $value, $fail) use ($academicCalendarId) {
                    $startDate = $value;
                    $endDate = $this->input('end_date');
                    
                    if (!$endDate) {
                        return; // Let end_date validation handle missing end_date
                    }
                    
                    // Check for any overlapping academic calendars
                    $query = \App\Models\AcademicCalendar::where(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<', $endDate)
                          ->where('end_date', '>', $startDate);
                    });
                    
                    // Exclude current record from validation
                    if ($academicCalendarId) {
                        $query->where('id', '!=', $academicCalendarId);
                    }
                    
                    if ($query->exists()) {
                        $fail('The selected dates overlap with an existing academic calendar.');
                    }
                },
            ],
            'end_date' => 'required|date|after:start_date',
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
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgramSubjectRequest extends FormRequest
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
            'prog_subj_code' => [
                'required',
                'string',
                'max:255',
                'unique:program_subjects,prog_subj_code',
            ],
            'prog_code' => [
                'required',
                'string',
                'exists:programs,code',
                // Unique validation for prog_code + subj_id combination
                function ($attribute, $value, $fail) {
                    $exists = \App\Models\ProgramSubject::where('prog_code', $value)
                        ->where('subj_id', $this->input('subj_id'))
                        ->exists();

                    if ($exists) {
                        $fail('This subject is already assigned to this program.');
                    }
                },
            ],
            'subj_id' => 'required|integer|exists:subjects,id',
            'year_level' => [
                'required',
                'integer',
                'min:1',
                'max:10',
                // Validate year_level doesn't exceed program's number_of_year
                function ($attribute, $value, $fail) {
                    $program = \App\Models\Program::where('code', $this->input('prog_code'))->first();
                    if ($program && $value > $program->number_of_year) {
                        $fail('Year level cannot exceed the program\'s total number of years (' . $program->number_of_year . ').');
                    }
                },
            ],
            'term_id' => 'required|integer|exists:terms,id',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'prog_code.required' => 'Program code is required.',
            'prog_code.exists' => 'Selected program does not exist.',
            'subj_id.required' => 'Subject ID is required.',
            'subj_id.exists' => 'Selected subject does not exist.',
            'year_level.required' => 'Year level is required.',
            'year_level.integer' => 'Year level must be an integer.',
            'year_level.min' => 'Year level must be at least 1.',
            'year_level.max' => 'Year level cannot exceed 10.',
            'term_id.required' => 'Term is required.',
            'term_id.exists' => 'Selected term does not exist.',
        ];
    }
}

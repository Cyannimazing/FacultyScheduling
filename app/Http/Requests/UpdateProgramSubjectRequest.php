<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgramSubjectRequest extends FormRequest
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
            'prog_code' => 'required|string|exists:programs,code',
            'subj_code' => 'required|string|exists:subjects,code',
            'year_level' => 'required|integer|min:1|max:10',
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
            'subj_code.required' => 'Subject code is required.',
            'subj_code.exists' => 'Selected subject does not exist.',
            'year_level.required' => 'Year level is required.',
            'year_level.integer' => 'Year level must be an integer.',
            'year_level.min' => 'Year level must be at least 1.',
            'year_level.max' => 'Year level cannot exceed 10.',
            'term_id.required' => 'Term is required.',
            'term_id.exists' => 'Selected term does not exist.',
        ];
    }
}

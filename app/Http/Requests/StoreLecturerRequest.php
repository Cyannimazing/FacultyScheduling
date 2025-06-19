<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLecturerRequest extends FormRequest
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
            'title' => 'nullable|string|max:255',
            'fname' => [
                'required',
                'string',
                'max:255',
                // Unique validation with composite key (fname + lname)
                function ($attribute, $value, $fail) {
                    $exists = \App\Models\Lecturer::where('fname', $value)
                        ->where('lname', $this->input('lname'))
                        ->exists();

                    if ($exists) {
                        $fail('A lecturer with this name already exists.');
                    }
                },
            ],
            'lname' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'fname.required' => 'First name is required.',
            'fname.string' => 'First name must be a string.',
            'fname.max' => 'First name cannot exceed 255 characters.',
        ];
    }
}

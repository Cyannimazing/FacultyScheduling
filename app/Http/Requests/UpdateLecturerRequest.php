<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLecturerRequest extends FormRequest
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
        $lecturerId = $this->route('lecturer'); // Assuming the route parameter is 'lecturer'
        
        return [
            'title' => 'nullable|string|max:255',
            'fname' => [
                'required',
                'string',
                'max:255',
                // Unique validation with composite key (fname + lname) excluding current record
                function ($attribute, $value, $fail) use ($lecturerId) {
                    $exists = \App\Models\Lecturer::where('fname', $value)
                        ->where('lname', $this->input('lname'))
                        ->where('id', '!=', $lecturerId)
                        ->exists();
                    
                    if ($exists) {
                        $fail('A lecturer with this name combination already exists.');
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

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:255',
                // Unique validation with composite key (name + prog_code)
                function ($attribute, $value, $fail) {
                    $exists = \App\Models\Group::where('name', $value)
                        ->where('prog_code', $this->input('prog_code'))
                        ->exists();

                    if ($exists) {
                        $fail('The program already have this group.');
                    }
                },
            ],
            'prog_code' => 'required|string|exists:programs,code',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Group name is required.',
            'name.string' => 'Group name must be a string.',
            'name.max' => 'Group name cannot exceed 255 characters.',
            'prog_code.required' => 'Program code is required.',
            'prog_code.exists' => 'Selected program does not exist.',
        ];
    }

    /**
     * Get custom validation attributes.
     */
    public function attributes(): array
    {
        return [
            'name' => 'group name',
            'prog_code' => 'program',
        ];
    }
}

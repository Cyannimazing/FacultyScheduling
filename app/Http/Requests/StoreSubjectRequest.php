<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubjectRequest extends FormRequest
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
            'code' => 'required|string|max:255|unique:subjects,code',
            'name' => 'required|string|max:255',
            'unit' => 'required|numeric|min:1',
            'short' => 'nullable|string|max:255',
            'is_gen_ed' => 'required|boolean',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Subject code is required.',
            'code.unique' => 'Subject code must be unique.',
            'name.required' => 'Subject name is required.',
            'unit.required' => 'Unit is required.',
            'unit.numeric' => 'Unit must be a number.',
            'unit.min' => 'Unit must be at least 1.',
            'is_gen_ed.required' => 'General Education status is required.',
            'is_gen_ed.boolean' => 'General Education status must be true or false.',
        ];
    }
}

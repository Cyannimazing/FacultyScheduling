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
            'name' => 'required|string|max:255|unique:subjects,name',
            'unit' => 'required|integer|min:1|max:10',
            'is_gen_ed' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.unique' => 'Subject name already exists.',
            'name.required' => 'Subject name is required.',
            'unit.required' => 'Unit is required.',
            'unit.integer' => 'Unit must be an integer.',
            'unit.min' => 'Unit must be at least 1.',
            'unit.max' => 'Unit cannot exceed 10.',
            'is_gen_ed.boolean' => 'General Education status must be true or false.',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgramRequest extends FormRequest
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
            'code' => 'required|string|max:255|unique:programs,code',
            'type' => 'required|string|max:255',
            'description' => 'required|string',
            'number_of_year' => 'required|integer|min:1|max:10',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Program code is required.',
            'code.unique' => 'Program code already exists.',
            'type.required' => 'Program type is required.',
            'number_of_year.required' => 'Number of years is required.',
            'number_of_year.integer' => 'Number of years must be an integer.',
            'number_of_year.min' => 'Number of years must be at least 1.',
            'number_of_year.max' => 'Number of years cannot exceed 10.',
        ];
    }
}

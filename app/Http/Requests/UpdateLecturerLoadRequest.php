<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLecturerLoadRequest extends FormRequest
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
        return [
            'max_load' => [
                'required',
                'integer',
                'min:1',
                'max:168', // Maximum hours in a week
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'max_load.required' => 'Maximum load is required.',
            'max_load.integer' => 'Maximum load must be a valid number.',
            'max_load.min' => 'Maximum load must be at least 1 hour.',
            'max_load.max' => 'Maximum load cannot exceed 168 hours (1 week).',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'max_load' => 'maximum load',
        ];
    }
}

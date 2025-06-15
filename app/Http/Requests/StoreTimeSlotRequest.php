<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTimeSlotRequest extends FormRequest
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
            'day' => [
                'required',
                'string',
                'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                // Unique validation with composite key (day + time)
                function ($attribute, $value, $fail) {
                    $exists = \App\Models\TimeSlot::where('day', $value)
                        ->where('time', $this->input('time'))
                        ->exists();
                    
                    if ($exists) {
                        $fail('This time slot already exists for the selected day.');
                    }
                },
            ],
            'time' => 'required|date_format:H:i',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'day.required' => 'Day is required.',
            'day.in' => 'Day must be a valid day of the week.',
            'time.required' => 'Time is required.',
            'time.date_format' => 'Time must be in HH:MM format.',
        ];
    }
}

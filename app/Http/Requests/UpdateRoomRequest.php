<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
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
        $roomId = $this->route('room'); // Get the room ID from route

        return [
            'name' => 'required|string|max:255|unique:rooms,name,' . $roomId . ',id',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Room name is required.',
            'name.unique' => 'Room name already exists.',
            'name.string' => 'Room name must be a string.',
            'name.max' => 'Room name cannot exceed 255 characters.',
        ];
    }
}

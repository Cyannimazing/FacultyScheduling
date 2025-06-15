<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLecturerSubjectRequest extends FormRequest
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
        // Since this uses compound primary key, we need to identify the record by all three fields
        $currentLecturerId = $this->route('lecturer_id');
        $currentProgSubjId = $this->route('prog_subj_id');
        $currentSyTermId = $this->route('sy_term_id');
        
        return [
            'lecturer_id' => [
                'required',
                'integer',
                'exists:lecturers,id',
                // Compound primary key validation excluding current record
                function ($attribute, $value, $fail) use ($currentLecturerId, $currentProgSubjId, $currentSyTermId) {
                    $exists = \App\Models\LecturerSubject::where('lecturer_id', $value)
                        ->where('prog_subj_id', $this->input('prog_subj_id'))
                        ->where('sy_term_id', $this->input('sy_term_id'))
                        ->whereNot([
                            'lecturer_id' => $currentLecturerId,
                            'prog_subj_id' => $currentProgSubjId,
                            'sy_term_id' => $currentSyTermId
                        ])
                        ->exists();
                    
                    if ($exists) {
                        $fail('This lecturer is already assigned to this subject in the selected term.');
                    }
                },
            ],
            'prog_subj_id' => 'required|integer|exists:program_subjects,id',
            'sy_term_id' => 'required|integer|exists:academic_calendars,id',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'lecturer_id.required' => 'Lecturer is required.',
            'lecturer_id.exists' => 'Selected lecturer does not exist.',
            'prog_subj_id.required' => 'Program subject is required.',
            'prog_subj_id.exists' => 'Selected program subject does not exist.',
            'sy_term_id.required' => 'Academic term is required.',
            'sy_term_id.exists' => 'Selected academic term does not exist.',
        ];
    }

    /**
     * Get custom validation attributes.
     */
    public function attributes(): array
    {
        return [
            'lecturer_id' => 'lecturer',
            'prog_subj_id' => 'program subject',
            'sy_term_id' => 'academic term',
        ];
    }
}

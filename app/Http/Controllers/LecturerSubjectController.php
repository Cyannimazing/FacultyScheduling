<?php

namespace App\Http\Controllers;

use App\Models\AcademicCalendar;
use App\Models\Lecturer;
use App\Models\LecturerSubject;
use App\Models\LecturerSchedule;
use App\Http\Requests\StoreLecturerSubjectRequest;
use App\Http\Requests\UpdateLecturerSubjectRequest;
use App\Models\Program;
use App\Models\ProgramSubject;
use App\Models\Term;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LecturerSubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $schoolyearFilter = $request->input('syFilter', '');
        $termFilter = $request->input('termFilter', '');
        $progCodeFilter = $request->input('progCodeFilter', '');
        $lecturerFilter = $request->input('lecturerFilter', '');
        $programChoice = $request->input('programChoice'); //sa add allocation
        $page = $request->input('page', 1);
        $perPage = 5;

        $lecturers = Lecturer::all(); //Add Alocation dropdown
        $programs = Program::with(['subjects']) //Add allocation dropdown
                        ->get();
        $academicCalendar = AcademicCalendar::with('term')//Add allocation dropdown
                    ->get();

        //MAIN Table data
        $lecturerSubjectsQuery = LecturerSubject::with([
                'lecturer',
                'programSubject.program',
                'programSubject.subject',
                'academicCalendar.term',
            ]);

        // Apply search filter only if search term is provided
        if (!empty($search)) {
            $lecturerSubjectsQuery->where(function ($query) use ($search) {
                $query->whereHas('programSubject.subject', function ($subQuery) use ($search) {
                    $subQuery->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                })
                ->orWhereHas('lecturer', function ($subQuery) use ($search) {
                    $subQuery->where('fname', 'like', "%{$search}%")
                        ->orWhere('lname', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%{$search}%")
                        ->orWhereRaw("(title || ' ' || fname || ' ' || lname) LIKE ?", ["%{$search}%"]);
                })
                ->orWhereHas('programSubject.program', function ($subQuery) use ($search) {
                    $subQuery->where('code', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
                ->orWhereHas('academicCalendar', function ($subQuery) use ($search) {
                    $subQuery->where('school_year', 'like', "%{$search}%");
                })
                ->orWhereHas('academicCalendar.term', function ($subQuery) use ($search) {
                    $subQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        // Apply school year filter only if provided
        if (!empty($schoolyearFilter)) {
            $lecturerSubjectsQuery->whereHas('academicCalendar', function ($query) use ($schoolyearFilter) {
                $query->where('school_year', $schoolyearFilter);
            });
        }

        // Apply term filter only if provided and not 'all'
        if (!empty($termFilter) && $termFilter !== 'all') {
            $lecturerSubjectsQuery->whereHas('academicCalendar', function ($query) use ($termFilter) {
                $query->where('term_id', $termFilter);
            });
        }

        // Apply program filter only if provided and not 'all'
        if (!empty($progCodeFilter) && $progCodeFilter !== 'all') {
            $lecturerSubjectsQuery->whereHas('programSubject.program', function ($query) use ($progCodeFilter) {
                $query->where('code', $progCodeFilter);
            });
        }

        // Apply lecturer filter only if provided and not 'all'
        if (!empty($lecturerFilter) && $lecturerFilter !== 'all') {
            $lecturerSubjectsQuery->where('lecturer_id', $lecturerFilter);
        }

        $lecturerSubjects = $lecturerSubjectsQuery->paginate($perPage, ['*'], 'page', $page);


        //Main Filters
        $academicCalendarFilterOption = LecturerSubject::with('academicCalendar.term')
                    ->groupBy('term_id')
                    ->get();

        $programFilterOption = Program::join('program_subjects', 'program_subjects.prog_code', '=', 'programs.code')
                    ->join('lecturer_subjects', 'lecturer_subjects.prog_subj_id', '=', 'program_subjects.id')
                    ->select('programs.code', 'programs.description')
                    ->distinct()
                    ->get();
        $lecturerFilterOption = LecturerSubject::with('lecturer')
                    ->groupBy('lecturer_id')
                    ->get();




        // return response()->json($programFilterOption);
        return Inertia::render('application/subject-allocation', [
                'data' => [
                    'programs' => $programs, //Kani with subjects nani. katung combobox nimo na pag mo pili kag program makita ang subjects na naa atu na program
                    'academicCalendars' => $academicCalendar, //sa add
                    'lecturers' => $lecturers,//sa add
                    'lecturerSubjects' => $lecturerSubjects, //Main table data
                    'academicCalendarFilterOption' => $academicCalendarFilterOption, //Filter option
                    'programFilterOption' => $programFilterOption, // Main Filter
                    'lecturerFilterOption' => $lecturerFilterOption
            ]
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLecturerSubjectRequest $request)
    {
        $validated = $request->validated();

        LecturerSubject::create($validated);

        return redirect()->route('subject-allocation')->with('success', 'Lecturer Subject created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $lecturerSubject = LecturerSubject::findOrFail($id);
        return Inertia::render('application/subject-allocation', [
            'lecturerSubject' => $lecturerSubject
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLecturerSubjectRequest $request, int $id)
    {
        DB::beginTransaction();
        try {
            $lecturerSubject = LecturerSubject::find($id);
            if ($lecturerSubject) {
                // Store old values before update
                $oldProgSubjId = $lecturerSubject->prog_subj_id;
                $oldLecturerId = $lecturerSubject->lecturer_id;
                $oldSyTermId = $lecturerSubject->sy_term_id;
                
                // Update the lecturer subject
                $lecturerSubject->update([
                    'lecturer_id' => $request->lecturer_id,
                    'prog_subj_id' => $request->prog_subj_id,
                    'sy_term_id' => $request->sy_term_id
                ]);
                
                // Update related LecturerSchedule records if any of the key fields changed
                if ($oldProgSubjId !== $request->prog_subj_id || 
                    $oldLecturerId !== $request->lecturer_id || 
                    $oldSyTermId !== $request->sy_term_id) {
                    
                    LecturerSchedule::where('lecturer_id', $oldLecturerId)
                        ->where('prog_subj_id', $oldProgSubjId)
                        ->where('sy_term_id', $oldSyTermId)
                        ->update([
                            'lecturer_id' => $request->lecturer_id,
                            'prog_subj_id' => $request->prog_subj_id,
                            'sy_term_id' => $request->sy_term_id
                        ]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to update Lecturer Subject and related schedules: ' . $e->getMessage());
            return redirect()->route('subject-allocation')->withErrors(['error' => 'Failed to update Lecturer Subject.']);
        }
        return redirect()->route('subject-allocation')->with('success', 'Lecturer Subject updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LecturerSubject $lecturerSubject)
    {
        $lecturerSubject->delete();

        return redirect()->route('subject-allocation')->with('success', 'Lecturer Subject deleted successfully.');
    }

    /**
     * Get subjects for a specific program
     */
    public function getSubjectsByProgram(Request $request, $programCode)
    {
        $yearLevel = $request->input('year_level');
        $termId = $request->input('term_id');

        $query = ProgramSubject::with(['subject', 'term'])
            ->where('prog_code', $programCode);

        // Filter by year level if provided
        if ($yearLevel) {
            $query->where('year_level', $yearLevel);
        }

        // Filter by term ID if provided
        if ($termId) {
            $query->where('term_id', $termId);
        }

        $programSubjects = $query->get();

        return response()->json($programSubjects);
    }

    /**
     * Get academic calendars filtered by term_id from selected subject
     */
    public function getAcademicCalendarsByTermId(Request $request, $termId)
    {
        $academicCalendars = AcademicCalendar::with('term')
            ->where('term_id', $termId)
            ->get();

        return response()->json($academicCalendars);
    }
}

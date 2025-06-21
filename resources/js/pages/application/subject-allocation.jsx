import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Edit,
    GraduationCap,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    User,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Subject Allocation',
        href: '/subject-allocation',
    },
];

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}

function SubjectAllocationSheet({ isOpen, onClose, allocation = null, onSave, existingAllocations = [], lecturers = [], programs = [], academicCalendars = [], onShowError }) {
    const [formData, setFormData] = useState({
        lecturer_id: '',
        prog_subj_id: '',
        sy_term_id: '',
        program_code: '',
        year_level: '',
        term_id: '',
    });
    const [validationError, setValidationError] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [filteredAcademicCalendars, setFilteredAcademicCalendars] = useState(academicCalendars);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [isLoadingCalendars, setIsLoadingCalendars] = useState(false);
    const [availableTerms, setAvailableTerms] = useState([]);

    React.useEffect(() => {
        if (allocation) {
            const programCode = allocation.program_subject?.program?.code || '';
            setFormData({
                lecturer_id: allocation.lecturer_id?.toString() || '',
                prog_subj_id: allocation.prog_subj_id?.toString() || '',
                sy_term_id: allocation.sy_term_id?.toString() || '',
                program_code: programCode,
                year_level: allocation.program_subject?.year_level?.toString() || '',
                term_id: allocation.program_subject?.term_id?.toString() || '',
            });

            // Load subjects for the program if editing
            if (programCode) {
                setIsLoadingSubjects(true);
                fetch(`/api/subjects-by-program/${programCode}`)
                    .then(response => response.json())
                    .then(programSubjects => {
                        setAvailableSubjects(programSubjects);

                        // Load academic calendars if we have a selected subject
                        const currentProgSubjId = allocation.prog_subj_id?.toString();
                        if (currentProgSubjId) {
                            const selectedSubject = programSubjects.find(ps => ps.id.toString() === currentProgSubjId);
                            if (selectedSubject && selectedSubject.term_id) {
                                setIsLoadingCalendars(true);
                                fetch(`/api/academic-calendars-by-term/${selectedSubject.term_id}`)
                                    .then(response => response.json())
                                    .then(filteredCalendars => {
                                        setFilteredAcademicCalendars(filteredCalendars);
                                    })
                                    .catch(error => {
                                        console.error('Error fetching academic calendars:', error);
                                        setFilteredAcademicCalendars([]);
                                    })
                                    .finally(() => setIsLoadingCalendars(false));
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching subjects:', error);
                        setAvailableSubjects([]);
                    })
                    .finally(() => setIsLoadingSubjects(false));
            }
        } else {
            setFormData({ lecturer_id: '', prog_subj_id: '', sy_term_id: '', program_code: '', year_level: '', term_id: '' });
            setAvailableSubjects([]);
            setFilteredAcademicCalendars(academicCalendars);
            setAvailableTerms([]);
        }
        setValidationError('');
    }, [allocation, academicCalendars]);
    const handleSave = () => {
        if (!formData.lecturer_id || !formData.prog_subj_id || !formData.sy_term_id) {
            setValidationError('Please fill all required fields');
            return;
        }

        // Check for duplicate allocation
        const isDuplicate = existingAllocations.some((alloc) => {
            return (
                alloc.lecturer_id === parseInt(formData.lecturer_id) &&
                alloc.prog_subj_id === parseInt(formData.prog_subj_id) &&
                alloc.sy_term_id === parseInt(formData.sy_term_id) &&
                alloc.id !== allocation?.id
            );
        });

        if (isDuplicate) {
            if (onShowError) {
                onShowError('Duplicate Allocation', 'This lecturer is already assigned to this subject in the selected term');
            } else {
                setValidationError('This lecturer is already assigned to this subject in the selected term');
            }
            return;
        }

        onSave({
            lecturer_id: parseInt(formData.lecturer_id),
            prog_subj_id: parseInt(formData.prog_subj_id),
            sy_term_id: parseInt(formData.sy_term_id),
        });
        onClose();
    };

    const programCodes = programs.map((p) => p.code);

    const getProgram = (programCode) => {
        return programs.find((p) => p.code === programCode);
    };

    const getCalendarInfo = (calendarId) => {
        return academicCalendars.find((c) => c.id === parseInt(calendarId));
    };

    const handleProgramChange = async (value) => {
        setFormData({ ...formData, program_code: value, prog_subj_id: '', sy_term_id: '', year_level: '', term_id: '' });
        setValidationError('');
        setAvailableSubjects([]);
        setFilteredAcademicCalendars(academicCalendars);
        setAvailableTerms([]);

        if (value) {
            setIsLoadingSubjects(true);
            try {
                const response = await fetch(`/api/subjects-by-program/${value}`);
                const programSubjects = await response.json();
                setAvailableSubjects(programSubjects);

                // Get unique terms from the program subjects
                const uniqueTerms = programSubjects.reduce((acc, ps) => {
                    if (ps.term && !acc.find(t => t.id === ps.term.id)) {
                        acc.push(ps.term);
                    }
                    return acc;
                }, []);
                setAvailableTerms(uniqueTerms);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                setAvailableSubjects([]);
                setAvailableTerms([]);
            } finally {
                setIsLoadingSubjects(false);
            }
        }
    };

    const handleYearLevelChange = async (value) => {
        setFormData({ ...formData, year_level: value, prog_subj_id: '', sy_term_id: '' });
        setValidationError('');
        setFilteredAcademicCalendars([]);
    };

    const handleTermChange = async (value) => {
        setFormData({ ...formData, term_id: value, prog_subj_id: '', sy_term_id: '' });
        setValidationError('');
        setFilteredAcademicCalendars([]);
    };

    const handleSubjectChange = async (value) => {
        setFormData({ ...formData, prog_subj_id: value, sy_term_id: '' });
        setValidationError('');
        setFilteredAcademicCalendars([]);

        // Find the selected program subject to get its term_id
        const selectedSubject = availableSubjects.find(ps => ps.id === parseInt(value));
        if (selectedSubject && selectedSubject.term_id) {
            setIsLoadingCalendars(true);
            try {
                const response = await fetch(`/api/academic-calendars-by-term/${selectedSubject.term_id}`);
                const filteredCalendars = await response.json();
                setFilteredAcademicCalendars(filteredCalendars);
            } catch (error) {
                console.error('Error fetching academic calendars:', error);
                setFilteredAcademicCalendars([]);
            } finally {
                setIsLoadingCalendars(false);
            }
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-[500px]">
                <SheetHeader>
                    <SheetTitle>{allocation ? 'Edit Subject Allocation' : 'Add New Subject Allocation'}</SheetTitle>
                    <SheetDescription>
                        {allocation ? 'Update the allocation details below.' : 'Assign a subject to a lecturer for a specific term.'}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6">
                    <div className="space-y-6 px-4">
                        {validationError && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-600">{validationError}</div>}

                        <div className="space-y-2">
                            <label
                                htmlFor="lecturer_id"
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Lecturer *
                            </label>
                            <Select value={formData.lecturer_id} onValueChange={(value) => setFormData({ ...formData, lecturer_id: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a lecturer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lecturers.map((lecturer) => (
                                        <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                <span>
                                                    {lecturer.title} {lecturer.fname} {lecturer.lname}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="program_code"
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Program *
                            </label>
                            <Select value={formData.program_code} onValueChange={handleProgramChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a program" />
                                </SelectTrigger>
                                <SelectContent>
                                        {programs.map((program) => (
                                            <SelectItem key={program.code} value={program.code}>
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4" />
                                                    <span>
                                                        {program.code} - {program.description}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex gap-4'>
                            <div className="space-y-2 w-full">
                                <label
                                    htmlFor="year_level"
                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Year Level *
                                </label>
                                <Select
                                    value={formData.year_level}
                                    onValueChange={handleYearLevelChange}
                                    disabled={!formData.program_code}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={
                                                !formData.program_code
                                                    ? 'Select a program first'
                                                    : 'Select year level'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formData.program_code && (() => {
                                            const selectedProgram = programs.find(p => p.code === formData.program_code);
                                            const numberOfYears = selectedProgram?.number_of_year || 0;
                                            return Array.from({ length: numberOfYears }, (_, i) => i + 1).map(year => (
                                                <SelectItem key={year} value={year.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <span>
                                                            {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ));
                                        })()}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 w-full">
                                <label
                                    htmlFor="term_id"
                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Term *
                                </label>
                                <Select
                                    value={formData.term_id}
                                    onValueChange={handleTermChange}
                                    disabled={!formData.program_code || availableTerms.length === 0}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={
                                                !formData.program_code
                                                    ? 'Select a program first'
                                                    : availableTerms.length === 0
                                                    ? 'No terms available'
                                                    : 'Select a term'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTerms.map((term) => (
                                            <SelectItem key={term.id} value={term.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <span>{term.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="subject_id"
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Subject *
                            </label>
                            <Select
                                value={formData.prog_subj_id}
                                onValueChange={handleSubjectChange}
                                disabled={!formData.program_code || !formData.year_level || !formData.term_id || isLoadingSubjects}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            !formData.program_code
                                                ? 'Select a program first'
                                                : !formData.year_level
                                                ? 'Select year level first'
                                                : !formData.term_id
                                                ? 'Select term first'
                                                : isLoadingSubjects
                                                ? 'Loading subjects...'
                                                : 'Select a subject'
                                        }
                                    />
                                </SelectTrigger>

                                <SelectContent className="!max-h-[250px] overflow-y-auto">
                                    {isLoadingSubjects ? (
                                        <div className="text-muted-foreground p-2 text-center text-sm">
                                            Loading subjects...
                                        </div>
                                    ) : formData.program_code && formData.year_level && formData.term_id && availableSubjects.length > 0 ? (
                                        availableSubjects
                                            .filter(ps =>
                                                ps.year_level.toString() === formData.year_level &&
                                                ps.term_id.toString() === formData.term_id
                                            )
                                            .map((programSubject) => {
                                                console.log(programSubject)
                                            if (!programSubject || !programSubject.subject) return null;
                                            const subject = programSubject;
                                            return (
                                                <SelectItem key={programSubject.id} value={programSubject.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{subject.prog_subj_code} - {subject.subject.name}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {subject.subject.unit || 0} unit{(subject.subject.unit || 0) !== 1 ? 's' : ''}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })
                                    ) : (
                                        <div className="text-muted-foreground p-2 text-center text-sm">
                                            {!formData.program_code
                                                ? 'Select a program first'
                                                : !formData.year_level
                                                ? 'Select year level first'
                                                : !formData.term_id
                                                ? 'Select term first'
                                                : 'No available subjects for this combination'}
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="calendar_id"
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Academic Term *
                            </label>
                            <Select
                                value={formData.sy_term_id}
                                onValueChange={(value) => setFormData({ ...formData, sy_term_id: value })}
                                disabled={!formData.prog_subj_id || isLoadingCalendars}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            !formData.prog_subj_id
                                                ? 'Select a subject first'
                                                : isLoadingCalendars
                                                ? 'Loading terms...'
                                                : 'Select a term'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingCalendars ? (
                                        <div className="text-muted-foreground p-2 text-center text-sm">
                                            Loading terms...
                                        </div>
                                    ) : filteredAcademicCalendars.length > 0 ? (
                                        filteredAcademicCalendars.map((calendar) => {
                                            const term = calendar.term;
                                            return (
                                                <SelectItem key={calendar.id} value={calendar.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="h-4 w-4" />
                                                        <span>
                                                            {term?.name || 'Unknown Term'} - {calendar.school_year}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })
                                    ) : (
                                        <div className="text-muted-foreground p-2 text-center text-sm">
                                            {!formData.prog_subj_id
                                                ? 'Select a subject first'
                                                : 'No academic terms available for this subject'}
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.sy_term_id && (
                            <div className="bg-muted/50 rounded-lg border p-4">
                                <h4 className="mb-2 flex items-center gap-2 font-medium">
                                    <CalendarIcon className="h-4 w-4" />
                                    Term Schedule
                                </h4>
                                {(() => {
                                    const calendar = getCalendarInfo(formData.sy_term_id);
                                    if (calendar) {
                                        const term = calendar.term;
                                        return (
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Term:</span>
                                                    <span className="font-medium">{term?.name || 'Unknown Term'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">School Year:</span>
                                                    <span className="font-medium">{calendar.school_year}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Start Date:</span>
                                                    <span className="font-medium">{new Date(calendar.start_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">End Date:</span>
                                                    <span className="font-medium">{new Date(calendar.end_date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        )}

                        {formData.prog_subj_id && formData.program_code && (
                            <div className="rounded-lg border bg-blue-50/50 p-4">
                                <h4 className="mb-2 flex items-center gap-2 font-medium">
                                    <BookOpen className="h-4 w-4" />
                                    Assignment Details
                                </h4>
                                {(() => {
                                    const programSubject = availableSubjects.find((ps) => ps.id === parseInt(formData.prog_subj_id));
                                    const subject = programSubject?.subject;
                                    const program = getProgram(formData.program_code);

                                    if (programSubject && subject) {
                                        return (
                                            <div className="space-y-2">
                                                <p className="text-muted-foreground text-sm">You are assigning:</p>
                                                <div className="space-y-1">
                                                    <div className="text-foreground text-xs font-medium">
                                                        {programSubject.prog_subj_code} - {subject.name}
                                                    </div>
                                                    <div className="text-foreground text-xs font-medium">
                                                        For: {program?.code} - {program?.description}
                                                    </div>
                                                    {formData.lecturer_id && (() => {
                                                        const selectedLecturer = lecturers.find(l => l.id.toString() === formData.lecturer_id);
                                                        return selectedLecturer && (
                                                            <div className="text-foreground text-xs font-medium">
                                                                To: {selectedLecturer.title} {selectedLecturer.fname} {selectedLecturer.lname}
                                                            </div>
                                                        );
                                                    })()}
                                                    <div className="flex flex-wrap gap-1 text-xs">
                                                        <Badge variant="secondary">{programSubject.year_level}{programSubject.year_level === 1 ? 'st' : programSubject.year_level === 2 ? 'nd' : programSubject.year_level === 3 ? 'rd' : 'th'} Year</Badge>
                                                        <Badge variant="outline">{subject.unit} unit{subject.unit !== 1 ? 's' : ''}</Badge>
                                                        <Badge variant="outline" className="bg-gray-100 text-gray-800">{programSubject.term?.name || 'Unknown Term'}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return <p className="text-muted-foreground text-sm">No subject found for this program combination.</p>;
                                })()}
                            </div>
                        )}
                    </div>
                </div>

                <SheetFooter className="px-4">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!formData.lecturer_id || !formData.prog_subj_id || !formData.sy_term_id}
                        className="flex-1"
                    >
                        {allocation ? 'Update' : 'Create'} Allocation
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default function SubjectAllocation() {
    // Get data from backend controller
    const { data } = usePage().props;
    const {
        lecturerSubjects = [],
        lecturers = [],
        academicCalendars = [],
        programs = [],
        academicCalendarFilterOption = [],
        programFilterOption = [],
        lecturerFilterOption = []
    } = data;

    // Handle pagination data structure from Laravel
    const lecturerSubjectsData = lecturerSubjects.data ? lecturerSubjects.data : (Array.isArray(lecturerSubjects) ? lecturerSubjects : []);
    const paginationInfo = lecturerSubjects.current_page ? {
        currentPage: lecturerSubjects.current_page,
        lastPage: lecturerSubjects.last_page,
        perPage: lecturerSubjects.per_page,
        total: lecturerSubjects.total
    } : null;

    const [currentPage, setCurrentPage] = useState(paginationInfo?.currentPage || 1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [schoolYearFilter, setSchoolYearFilter] = useState('');
    const [termFilter, setTermFilter] = useState('all');
    const [programFilter, setProgramFilter] = useState('all');
    const [lecturerFilter, setLecturerFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAllocation, setEditingAllocation] = useState(null);
    const [allocationsData, setAllocationsData] = useState(lecturerSubjectsData);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [allocationToDelete, setAllocationToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorTitle, setErrorTitle] = useState('');

    const itemsPerPage = 5;

    // Initialize school year filter with the first available year
    React.useEffect(() => {
        if (!schoolYearFilter && academicCalendars.length > 0) {
            const uniqueSchoolYears = [...new Set(academicCalendars.map((c) => c.school_year))];
            setSchoolYearFilter(uniqueSchoolYears[0] || '');
        }
    }, [academicCalendars, schoolYearFilter]);

    // Update allocations data when backend data changes
    React.useEffect(() => {
        setAllocationsData(lecturerSubjectsData);
    }, [lecturerSubjectsData]);

    // Send filter changes to backend
    const applyFilters = React.useCallback(() => {
        const params = new URLSearchParams();

        if (searchTerm) params.append('search', searchTerm);
        if (schoolYearFilter) params.append('syFilter', schoolYearFilter);
        if (termFilter && termFilter !== 'all') params.append('termFilter', termFilter);
        if (programFilter && programFilter !== 'all') params.append('progCodeFilter', programFilter);
        if (lecturerFilter && lecturerFilter !== 'all') params.append('lecturerFilter', lecturerFilter);

        // Reset to page 1 when applying filters
        params.append('page', '1');

        setIsLoading(true);
        router.get('/subject-allocation', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setIsLoading(false);
                setCurrentPage(1);
            },
        });
    }, [searchTerm, schoolYearFilter, termFilter, programFilter, lecturerFilter]);

    // Debounced filter application for search
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '') {
                applyFilters();
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchTerm, applyFilters]);

    // Immediate filter application for dropdowns
    React.useEffect(() => {
        // Only apply filters if the school year filter is set (prevents initial load issues)
        if (schoolYearFilter) {
            applyFilters();
        }
    }, [schoolYearFilter, termFilter, programFilter, lecturerFilter, applyFilters]);

    const getLecturer = (lecturerId) => lecturers.find((l) => l.id === lecturerId);
    const getCalendar = (calendarId) => academicCalendars.find((c) => c.id === calendarId);
    const getProgram = (programCode) => programs.find((p) => p.code === programCode);

    const transformedData = (allocationsData || []).map((allocation) => {
        // Data is already loaded from backend with relationships
        return {
            ...allocation,
            lecturer: allocation.lecturer,
            subject: allocation.program_subject?.subject,
            program: allocation.program_subject?.program,
            calendar: allocation.academic_calendar,
            term: allocation.academic_calendar?.term,
        };
    });

    // Use the backend-filtered data directly (no client-side filtering)
    const paginatedData = transformedData;

    const handlePageChange = (page) => {
        if (page > 0 && page <= (paginationInfo?.lastPage || 1)) {
            setIsLoading(true);
            const params = new URLSearchParams();

            if (searchTerm) params.append('search', searchTerm);
            if (schoolYearFilter) params.append('syFilter', schoolYearFilter);
            if (termFilter && termFilter !== 'all') params.append('termFilter', termFilter);
            if (programFilter && programFilter !== 'all') params.append('progCodeFilter', programFilter);
            if (lecturerFilter && lecturerFilter !== 'all') params.append('lecturerFilter', lecturerFilter);
            params.append('page', page.toString());

            router.get('/subject-allocation', Object.fromEntries(params), {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setIsLoading(false);
                    setCurrentPage(page);
                },
            });
        }
    };

    const handleAddAllocation = () => {
        setEditingAllocation(null);
        setIsDialogOpen(true);
    };

    const handleEditAllocation = (allocation) => {
        setEditingAllocation(allocation);
        setIsDialogOpen(true);
    };

    const showError = (title, message) => {
        setErrorTitle(title);
        setErrorMessage(message);
        setErrorDialogOpen(true);
    };

    const handleSaveAllocation = (formData) => {
        // Check for duplicate allocation by looking at existing allocations
        const existingAllocation = allocationsData.find((alloc) => {
            return (
                alloc.lecturer_id === formData.lecturer_id &&
                alloc.prog_subj_id === formData.prog_subj_id &&
                alloc.sy_term_id === formData.sy_term_id &&
                alloc.id !== editingAllocation?.id
            );
        });

        if (existingAllocation) {
            showError('Duplicate Allocation', 'This lecturer is already assigned to this subject in the selected term.');
            return;
        }

        // Backend request to store/update subject allocation
        if (editingAllocation) {
            // UPDATE: Edit existing allocation
            router.put(`/subject-allocation/${editingAllocation.id}`, {
                lecturer_id: formData.lecturer_id,
                prog_subj_id: formData.prog_subj_id,
                sy_term_id: formData.sy_term_id
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Allocation updated successfully');
                    setIsDialogOpen(false);
                },
                onError: (errors) => {
                    showError('Update Failed', errors.message || Object.values(errors).flat().join('\n'));
                }
            });
        } else {
            // CREATE: Add new allocation
            router.post('/subject-allocation', {
                lecturer_id: formData.lecturer_id,
                prog_subj_id: formData.prog_subj_id,
                sy_term_id: formData.sy_term_id
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Allocation created successfully');
                    setCurrentPage(1);
                    setIsDialogOpen(false);
                },
                onError: (errors) => {
                    showError('Save Failed', errors.message || Object.values(errors).flat().join('\n'));
                }
            });
        }

        if (!editingAllocation) {
            setCurrentPage(1);
        }
        setIsDialogOpen(false);
    };

    const handleDeleteAllocation = (allocation) => {
        setAllocationToDelete(allocation);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteAllocation = async () => {
        if (allocationToDelete && !isDeleting) {
            setIsDeleting(true);

            // Backend request to delete subject allocation
            router.delete(`/subject-allocation/${allocationToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {

                    // Check if we need to adjust the current page
                    const totalItems = paginationInfo?.total || paginatedData.length;
                    const newTotalPages = Math.ceil((totalItems - 1) / itemsPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(newTotalPages);
                    } else if (totalItems === 1) {
                        setCurrentPage(1);
                    }

                    setIsDeleting(false);
                    setDeleteDialogOpen(false);
                    setAllocationToDelete(null);
                },
                onError: (errors) => {
                    console.error('Error deleting allocation:', errors);
                    setIsDeleting(false);
                    setDeleteDialogOpen(false);
                    setAllocationToDelete(null);
                }
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const schoolYears = [...new Set(academicCalendars.map((c) => c.school_year))];
    const termNames = [
        ...new Set(
            academicCalendars
                .map((c) => c.term?.name)
                .filter(Boolean),
        ),
    ];
    const programCodes = programs.map((p) => p.code);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subject Allocation" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Subject Allocation</h1>
                        <p className="text-muted-foreground mt-2">Assign subjects to lecturers for different academic terms</p>
                    </div>
                    <Button onClick={handleAddAllocation} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Allocation
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                <div className="relative flex-1 md:max-w-sm">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="Search by lecturer, subject, program, term, or school year..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={schoolYearFilter} onValueChange={setSchoolYearFilter}>
                                    <SelectTrigger className="w-full md:w-[180px]">
                                        <SelectValue placeholder="School Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {schoolYears.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={termFilter} onValueChange={setTermFilter}>
                                    <SelectTrigger className="w-full md:w-[140px]">
                                        <SelectValue placeholder="Term" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Terms</SelectItem>
                                        {academicCalendarFilterOption.map((item) => {
                                            const term = item.academic_calendar?.term;
                                            if (!term) return null;
                                            return (
                                                <SelectItem key={term.id} value={term.id.toString()}>
                                                    {term.name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <Select value={programFilter} onValueChange={setProgramFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Programs</SelectItem>
                                        {programFilterOption.map((program) => (
                                            <SelectItem key={program.code} value={program.code}>
                                                {program.code} - {program.description}
                                            </SelectItem>
                                        ))
                                        }
                                    </SelectContent>
                                </Select>
                                <Select value={lecturerFilter} onValueChange={setLecturerFilter}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Lecturer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Lecturers</SelectItem>
                                        {lecturerFilterOption.map((lecturer) => (
                                            <SelectItem key={lecturer.lecturer.id} value={lecturer.lecturer.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span>
                                                        {lecturer.lecturer.title} {lecturer.lecturer.fname} {lecturer.lecturer?.lname}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {paginationInfo?.total || paginatedData.length} allocations
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : paginatedData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Lecturer</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Programs</TableHead>
                                            <TableHead className="text-center">Term</TableHead>
                                            <TableHead className="text-center">Academic Period</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.map((allocation) => {
                                            const lecturer = allocation.lecturer;
                                            const subject = allocation.program_subject;
                                            const calendar = allocation.calendar;
                                            const program = allocation.program;
                                            const term = allocation.term;
                                            console.log(subject)
                                            return (
                                                <TableRow key={allocation.lecturer_id + '' + allocation.prog_subj_id + '' + allocation.sy_term_id} className="hover:bg-muted/50">
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <User className="text-muted-foreground h-4 w-4" />
                                                            <div>
                                                                <div className="font-medium">
                                                                    {lecturer
                                                                        ? `${lecturer.title} ${lecturer.fname} ${(lecturer.lname) ? lecturer.lname : ''}`
                                                                        : 'Unknown Lecturer'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen className="text-muted-foreground h-4 w-4" />
                                                                <span className="font-mono text-sm font-medium">{allocation.program_subject.prog_subj_code || 'Unknown'}</span>
                                                            </div>
                                                            <div className="text-sm">{subject.subject?.name || 'Unknown Subject'}</div>
                                                            <div className="flex items-center gap-1">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {subject.subject?.unit || 0} unit{(subject.subject?.unit || 0) !== 1 ? 's' : ''}
                                                                </Badge>
                                                                {subject?.is_general_education && (
                                                                    <Badge variant="secondary" className="bg-green-100 text-xs text-green-800">
                                                                        GE
                                                                    </Badge>
                                                                )}
                                                                {allocation.program_subject?.year_level && (
                                                                    <Badge
                                                                        variant="default"
                                                                        className="bg-blue-100 text-xs text-blue-800"
                                                                    >
                                                                        {allocation.program_subject.year_level}{allocation.program_subject.year_level === 1 ? 'st' : allocation.program_subject.year_level === 2 ? 'nd' : allocation.program_subject.year_level === 3 ? 'rd' : 'th'} Year
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-xs">
                                                            <Badge variant="outline" className="text-xs">
                                                                {program?.code || 'Unknown'} - {program?.description || 'Unknown Program'}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <GraduationCap className="text-muted-foreground h-4 w-4" />
                                                            <span className="font-medium">
                                                                {term?.name || 'Unknown Term'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-medium">{calendar?.school_year}</div>
                                                            <div className="text-muted-foreground text-xs">
                                                                {calendar?.start_date && calendar?.end_date
                                                                    ? `${new Date(calendar.start_date).toLocaleDateString('en-US', {
                                                                          month: 'short',
                                                                          day: 'numeric',
                                                                      })} - ${new Date(calendar.end_date).toLocaleDateString('en-US', {
                                                                          month: 'short',
                                                                          day: 'numeric',
                                                                          year: 'numeric',
                                                                      })}`
                                                                    : 'N/A'}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleEditAllocation(allocation)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Allocation
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-red-600 focus:text-red-600"
                                                                    onClick={() => handleDeleteAllocation(allocation)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete Allocation
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CalendarIcon className="text-muted-foreground mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-semibold">No allocations found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm || termFilter !== 'all' || programFilter !== 'all' || lecturerFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by creating your first subject allocation.'}
                                </p>
                                {!searchTerm && termFilter === 'all' && programFilter === 'all' && lecturerFilter === 'all' && (
                                    <Button onClick={handleAddAllocation}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Allocation
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!isLoading && paginationInfo && paginationInfo.lastPage > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Page {paginationInfo.currentPage} of {paginationInfo.lastPage}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(paginationInfo.currentPage - 1)} disabled={paginationInfo.currentPage === 1}>
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                                disabled={paginationInfo.currentPage === paginationInfo.lastPage}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <SubjectAllocationSheet
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                allocation={editingAllocation}
                onSave={handleSaveAllocation}
                existingAllocations={allocationsData}
                lecturers={lecturers}
                programs={programs}
                academicCalendars={academicCalendars}
                onShowError={showError}
                />

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Subject Allocation</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this allocation? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteAllocation} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete Allocation'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Error Dialog */}
            <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            {errorTitle}
                        </DialogTitle>
                        <DialogDescription>
                            An error occurred while processing your request. Please review the details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error Details</AlertTitle>
                            <AlertDescription>
                                {errorMessage}
                            </AlertDescription>
                        </Alert>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setErrorDialogOpen(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

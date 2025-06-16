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
import { Head, router } from '@inertiajs/react';
import {
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
} from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Subject Allocation',
        href: '/subject-allocation',
    },
];

const sampleCalendars = [
    {
        id: 1,
        term_id: 1,
        school_year: '2025-2026',
        start_date: '2025-08-15',
        end_date: '2025-12-15',
        created_at: '2025-07-01 09:00',
        updated_at: '2025-07-02 14:30',
    },
    {
        id: 2,
        term_id: 2,
        school_year: '2025-2026',
        start_date: '2026-01-08',
        end_date: '2026-05-15',
        created_at: '2025-07-01 09:30',
        updated_at: '2025-07-03 10:15',
    },
];

const sampleTerms = [
    { id: 1, name: '1st Term' },
    { id: 2, name: '2nd Term' },
];

const samplePrograms = [
    {
        id: 1,
        unique_code: 'PROG001',
        name: 'Computer Science',
        description: 'Bachelor of Science in Computer Science',
        year_length: 4,
        created_at: '2025-06-10 09:00',
        updated_at: '2025-06-11 14:30',
    },
    {
        id: 2,
        unique_code: 'PROG002',
        name: 'Information Technology',
        description: 'Bachelor of Science in Information Technology',
        year_length: 4,
        created_at: '2025-06-10 09:00',
        updated_at: '2025-06-11 14:30',
    },
    {
        id: 3,
        unique_code: 'PROG003',
        name: 'Information Systems',
        description: 'Bachelor of Science in Information Systems',
        year_length: 4,
        created_at: '2025-06-10 09:00',
        updated_at: '2025-06-11 14:30',
    },
    {
        id: 4,
        unique_code: 'PROG004',
        name: 'Master in Information Technology',
        description: 'Master of Science in Information Technology',
        year_length: 2,
        created_at: '2025-06-10 09:00',
        updated_at: '2025-06-11 14:30',
    },
];

const getYearLevelsForProgram = (yearLength) => {
    if (!yearLength) return [];
    return Array.from({ length: yearLength }, (_, index) => ({
        id: index + 1,
        name: `${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Year`,
    }));
};

const sampleLecturers = [
    { id: 1, title: 'Dr.', fname: 'John', lname: 'Smith', created_at: '2025-06-01 09:00', updated_at: '2025-06-02 14:30' },
    { id: 2, title: 'Prof.', fname: 'Jane', lname: 'Johnson', created_at: '2025-06-03 11:00', updated_at: '2025-06-04 10:15' },
    { id: 3, title: 'Ms.', fname: 'Emily', lname: 'Davis', created_at: '2025-06-05 13:00', updated_at: '2025-06-06 16:45' },
    { id: 4, title: 'Dr.', fname: 'Michael', lname: 'Brown', created_at: '2025-06-07 15:30', updated_at: '2025-06-08 09:20' },
    { id: 5, title: 'Prof.', fname: 'Sarah', lname: 'Wilson', created_at: '2025-06-09 10:45', updated_at: '2025-06-10 16:15' },
];

const sampleSubjects = [
    {
        id: 1,
        code: 'CS101',
        name: 'Introduction to Computer Science',
        unit: 3,
        isGeneralEducation: false,
        created_at: '2025-06-10 09:00',
        updated_at: '2025-06-11 14:30',
    },
    {
        id: 2,
        code: 'MATH101',
        name: 'College Algebra',
        unit: 3,
        isGeneralEducation: true,
        created_at: '2025-06-09 11:00',
        updated_at: '2025-06-12 10:15',
    },
    {
        id: 3,
        code: 'ENG101',
        name: 'English Composition',
        unit: 3,
        isGeneralEducation: true,
        created_at: '2025-06-08 13:00',
        updated_at: '2025-06-11 16:45',
    },
    {
        id: 4,
        code: 'CS201',
        name: 'Data Structures and Algorithms',
        unit: 4,
        isGeneralEducation: false,
        created_at: '2025-06-07 15:30',
        updated_at: '2025-06-10 09:20',
    },
    {
        id: 5,
        code: 'PHIL101',
        name: 'Introduction to Philosophy',
        unit: 3,
        isGeneralEducation: true,
        created_at: '2025-06-06 10:45',
        updated_at: '2025-06-09 16:15',
    },
    {
        id: 6,
        code: 'CS301',
        name: 'Database Management Systems',
        unit: 3,
        isGeneralEducation: false,
        created_at: '2025-06-05 14:20',
        updated_at: '2025-06-08 11:30',
    },
];

const sampleCourseAssignments = [
    {
        id: 1,
        program_code: 'PROG001',
        subject_code: 'MATH101',
        year_level: 1,
        term_id: 1,
        created_at: '2025-06-01 09:00',
        updated_at: '2025-06-02 14:30',
    },
    {
        id: 2,
        program_code: 'PROG001',
        subject_code: 'ENG101',
        year_level: 1,
        term_id: 1,
        created_at: '2025-06-01 09:30',
        updated_at: '2025-06-02 14:45',
    },
    {
        id: 3,
        program_code: 'PROG001',
        subject_code: 'PHIL101',
        year_level: 1,
        term_id: 2,
        created_at: '2025-06-01 10:00',
        updated_at: '2025-06-02 15:00',
    },
    {
        id: 4,
        program_code: 'PROG001',
        subject_code: 'CS101',
        year_level: 2,
        term_id: 1,
        created_at: '2025-06-01 10:30',
        updated_at: '2025-06-02 15:15',
    },
    {
        id: 5,
        program_code: 'PROG001',
        subject_code: 'CS201',
        year_level: 2,
        term_id: 2,
        created_at: '2025-06-01 11:00',
        updated_at: '2025-06-02 15:30',
    },
    {
        id: 6,
        program_code: 'PROG001',
        subject_code: 'CS301',
        year_level: 3,
        term_id: 1,
        created_at: '2025-06-01 11:30',
        updated_at: '2025-06-02 15:45',
    },
    {
        id: 7,
        program_code: 'PROG002',
        subject_code: 'MATH101',
        year_level: 1,
        term_id: 1,
        created_at: '2025-06-01 12:00',
        updated_at: '2025-06-02 16:00',
    },
    {
        id: 8,
        program_code: 'PROG002',
        subject_code: 'ENG101',
        year_level: 1,
        term_id: 2,
        created_at: '2025-06-01 12:30',
        updated_at: '2025-06-02 16:15',
    },
    {
        id: 9,
        program_code: 'PROG002',
        subject_code: 'CS101',
        year_level: 1,
        term_id: 2,
        created_at: '2025-06-01 13:00',
        updated_at: '2025-06-02 16:30',
    },
    {
        id: 10,
        program_code: 'PROG002',
        subject_code: 'PHIL101',
        year_level: 2,
        term_id: 1,
        created_at: '2025-06-01 13:30',
        updated_at: '2025-06-02 16:45',
    },
    {
        id: 11,
        program_code: 'PROG002',
        subject_code: 'CS201',
        year_level: 3,
        term_id: 1,
        created_at: '2025-06-01 14:00',
        updated_at: '2025-06-02 17:00',
    },
    {
        id: 12,
        program_code: 'PROG003',
        subject_code: 'MATH101',
        year_level: 1,
        term_id: 1,
        created_at: '2025-06-01 15:00',
        updated_at: '2025-06-02 17:30',
    },
    {
        id: 13,
        program_code: 'PROG003',
        subject_code: 'ENG101',
        year_level: 1,
        term_id: 2,
        created_at: '2025-06-01 15:30',
        updated_at: '2025-06-02 17:45',
    },
    {
        id: 14,
        program_code: 'PROG003',
        subject_code: 'CS301',
        year_level: 2,
        term_id: 1,
        created_at: '2025-06-01 16:00',
        updated_at: '2025-06-02 18:00',
    },
    {
        id: 15,
        program_code: 'PROG004',
        subject_code: 'CS201',
        year_level: 1,
        term_id: 1,
        created_at: '2025-06-01 16:30',
        updated_at: '2025-06-02 18:15',
    },
    {
        id: 16,
        program_code: 'PROG004',
        subject_code: 'CS301',
        year_level: 2,
        term_id: 1,
        created_at: '2025-06-01 17:00',
        updated_at: '2025-06-02 18:30',
    },
];

const initialLecturerSubjects = [
    {
        id: 1,
        lecturer_id: 1,
        course_assignment_id: 4,
        calendar_id: 2,
        created_at: '2025-06-01 09:00',
        updated_at: '2025-06-02 14:30',
    },
    {
        id: 2,
        lecturer_id: 2,
        course_assignment_id: 1,
        calendar_id: 2,
        created_at: '2025-06-03 11:00',
        updated_at: '2025-06-04 10:15',
    },
    {
        id: 3,
        lecturer_id: 3,
        course_assignment_id: 8,
        calendar_id: 2,
        created_at: '2025-06-05 13:00',
        updated_at: '2025-06-06 16:45',
    },
    {
        id: 4,
        lecturer_id: 1,
        course_assignment_id: 5,
        calendar_id: 2,
        created_at: '2025-06-07 15:30',
        updated_at: '2025-06-08 09:20',
    },
    {
        id: 5,
        lecturer_id: 4,
        course_assignment_id: 10,
        calendar_id: 2,
        created_at: '2025-06-09 10:45',
        updated_at: '2025-06-10 16:15',
    },
    {
        id: 6,
        lecturer_id: 5,
        course_assignment_id: 14,
        calendar_id: 2,
        created_at: '2025-06-11 14:20',
        updated_at: '2025-06-12 11:30',
    },
];

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}

function SubjectAllocationSheet({ isOpen, onClose, allocation = null, onSave, existingAllocations = [] }) {
    const [formData, setFormData] = useState({
        lecturer_id: '',
        course_assignment_id: '',
        calendar_id: '',
        program_code: '',
    });
    const [validationError, setValidationError] = useState('');

    React.useEffect(() => {
        if (allocation) {
            const courseAssignment = sampleCourseAssignments.find((ca) => ca.id === allocation.course_assignment_id);
            setFormData({
                lecturer_id: allocation.lecturer_id?.toString() || '',
                course_assignment_id: allocation.course_assignment_id?.toString() || '',
                calendar_id: allocation.calendar_id?.toString() || '',
                program_code: courseAssignment?.program_code || '',
            });
        } else {
            setFormData({ lecturer_id: '', course_assignment_id: '', calendar_id: '2', program_code: '' });
        }
        setValidationError('');
    }, [allocation]);

    const handleSave = () => {
        if (!formData.lecturer_id || !formData.course_assignment_id || !formData.calendar_id || !formData.program_code) {
            setValidationError('Please fill all required fields');
            return;
        }

        const courseAssignment = sampleCourseAssignments.find((ca) => ca.id === parseInt(formData.course_assignment_id));
        if (!courseAssignment) {
            setValidationError('Invalid course assignment');
            return;
        }

        // Check for duplicate allocation
        const isDuplicate = existingAllocations.some((alloc) => {
            const allocCourseAssignment = sampleCourseAssignments.find((ca) => ca.id === alloc.course_assignment_id);
            return (
                allocCourseAssignment &&
                allocCourseAssignment.subject_code === courseAssignment.subject_code &&
                allocCourseAssignment.program_code === courseAssignment.program_code &&
                alloc.calendar_id === parseInt(formData.calendar_id) &&
                alloc.id !== allocation?.id
            );
        });

        if (isDuplicate) {
            setValidationError('This subject is already allocated to this program in the selected term');
            return;
        }

        onSave({
            lecturer_id: parseInt(formData.lecturer_id),
            course_assignment_id: parseInt(formData.course_assignment_id),
            calendar_id: parseInt(formData.calendar_id),
        });
        onClose();
    };

    const getSubjectsForProgram = (programCode) => {
        if (!programCode) return [];
        const subjectCodes = sampleCourseAssignments.filter((ca) => ca.program_code === programCode).map((ca) => ca.subject_code);
        return sampleSubjects.filter((subject) => subjectCodes.includes(subject.code));
    };

    const getAvailableSubjects = () => {
        const programSubjects = getSubjectsForProgram(formData.program_code);
        if (!programSubjects.length || !formData.calendar_id) return programSubjects;

        // Get current calendar term
        const calendar = sampleCalendars.find((c) => c.id === parseInt(formData.calendar_id));
        if (!calendar) return programSubjects;

        return programSubjects.filter((subject) => {
            // Check if this subject is already allocated to this program in this term
            const isAlreadyAllocated = existingAllocations.some((alloc) => {
                const allocCourseAssignment = sampleCourseAssignments.find((ca) => ca.id === alloc.course_assignment_id);
                return (
                    allocCourseAssignment &&
                    allocCourseAssignment.subject_code === subject.code &&
                    allocCourseAssignment.program_code === formData.program_code &&
                    alloc.calendar_id === parseInt(formData.calendar_id) &&
                    alloc.id !== allocation?.id
                );
            });

            return !isAlreadyAllocated;
        });
    };

    const availableSubjects = getAvailableSubjects();
    const programCodes = samplePrograms.map((p) => p.unique_code);

    const getProgram = (programCode) => {
        return samplePrograms.find((p) => p.unique_code === programCode);
    };

    const getCalendarInfo = (calendarId) => {
        return sampleCalendars.find((c) => c.id === parseInt(calendarId));
    };

    const handleProgramChange = (value) => {
        setFormData({ ...formData, program_code: value, course_assignment_id: '' });
        setValidationError('');
    };

    const handleCalendarChange = (value) => {
        setFormData({ ...formData, calendar_id: value });
        setValidationError('');
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
                                    {sampleLecturers.map((lecturer) => (
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
                                    {samplePrograms.map((program) => (
                                        <SelectItem key={program.unique_code} value={program.unique_code}>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4" />
                                                <span>
                                                    {program.unique_code} - {program.name}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="subject_id"
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Subject *
                            </label>
                            <Select
                                value={formData.course_assignment_id}
                                onValueChange={(value) => setFormData({ ...formData, course_assignment_id: value })}
                                disabled={!formData.program_code || !formData.calendar_id}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            !formData.program_code
                                                ? 'Select a program first'
                                                : !formData.calendar_id
                                                  ? 'Select a term first'
                                                  : 'Select a subject'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent className="!max-h-[250px] overflow-y-auto">
                                    {availableSubjects.length > 0 ? (
                                        availableSubjects.map((subject) => {
                                            const courseAssignment = sampleCourseAssignments.find(
                                                (ca) => ca.subject_code === subject.code && ca.program_code === formData.program_code,
                                            );
                                            return (
                                                <SelectItem key={courseAssignment?.id} value={courseAssignment?.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{subject.name}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {subject.unit} unit{subject.unit !== 1 ? 's' : ''}
                                                        </Badge>
                                                        {subject.isGeneralEducation && (
                                                            <Badge variant="secondary" className="bg-green-100 text-xs text-green-800">
                                                                GE
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })
                                    ) : (
                                        <div className="text-muted-foreground p-2 text-center text-sm">
                                            {!formData.program_code
                                                ? 'Select a program first'
                                                : !formData.calendar_id
                                                  ? 'Select a term first'
                                                  : 'No available subjects for this program and term'}
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
                            <Select value={formData.calendar_id} onValueChange={handleCalendarChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a term" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sampleCalendars.map((calendar) => {
                                        const term = sampleTerms.find((t) => t.id === calendar.term_id);
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
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.calendar_id && (
                            <div className="bg-muted/50 rounded-lg border p-4">
                                <h4 className="mb-2 flex items-center gap-2 font-medium">
                                    <CalendarIcon className="h-4 w-4" />
                                    Term Schedule
                                </h4>
                                {(() => {
                                    const calendar = getCalendarInfo(formData.calendar_id);
                                    if (calendar) {
                                        const term = sampleTerms.find((t) => t.id === calendar.term_id);
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

                        {formData.course_assignment_id && formData.program_code && (
                            <div className="rounded-lg border bg-blue-50/50 p-4">
                                <h4 className="mb-2 flex items-center gap-2 font-medium">
                                    <BookOpen className="h-4 w-4" />
                                    Assignment Details
                                </h4>
                                {(() => {
                                    const assignment = sampleCourseAssignments.find((ca) => ca.id === parseInt(formData.course_assignment_id));
                                    const subject = sampleSubjects.find((s) => s.code === assignment?.subject_code);
                                    const program = getProgram(assignment?.program_code);

                                    if (assignment) {
                                        const yearLevels = getYearLevelsForProgram(program?.year_length);
                                        const yearLevel = yearLevels.find((y) => y.id === assignment.year_level);
                                        const term = sampleTerms.find((t) => t.id === assignment.term_id);

                                        return (
                                            <div className="space-y-2">
                                                <p className="text-muted-foreground text-sm">You are assigning:</p>
                                                <div className="space-y-1">
                                                    <div className="text-foreground text-xs font-medium">
                                                        {subject?.code} - {subject?.name}
                                                    </div>
                                                    <div className="text-foreground text-xs font-medium">
                                                        For: {program?.unique_code} - {program?.name}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 text-xs">
                                                        <Badge variant="secondary">{yearLevel?.name || `${assignment.year_level} Year`}</Badge>
                                                        <Badge variant="outline">{term?.name || 'Unknown Term'}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return <p className="text-muted-foreground text-sm">No assignment found for this subject-program combination.</p>;
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
                        disabled={!formData.lecturer_id || !formData.course_assignment_id || !formData.calendar_id || !formData.program_code}
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
    // TODO: BACKEND REQUEST - Initialize data using Inertia.js
    // Replace sample data with props from backend controller:
    // 
    // const { data } = usePage().props;
    // const { 
    //     lecturerSubjects = [], 
    //     lecturers = [], 
    //     academicCalendars = [], 
    //     programs = [], 
    //     programSubjects = [], 
    //     subjects = [], 
    //     terms = [] 
    // } = data;
    // 
    // Backend controller should return all necessary data via Inertia::render()
    // Example: LecturerSubjectController@index should return:
    // return Inertia::render('application/subject-allocation', [
    //     'data' => [
    //         'lecturerSubjects' => LecturerSubject::with(['lecturer', 'programSubject', 'academicCalendar'])->get(),
    //         'lecturers' => Lecturer::all(),
    //         'academicCalendars' => AcademicCalendar::with('term')->get(),
    //         'programs' => Program::all(),
    //         'programSubjects' => ProgramSubject::with(['program', 'subject'])->get(),
    //         'subjects' => Subject::all(),
    //         'terms' => Term::all()
    //     ]
    // ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [schoolYearFilter, setSchoolYearFilter] = useState('2025-2026');
    const [termFilter, setTermFilter] = useState('all');
    const [programFilter, setProgramFilter] = useState('all');
    const [lecturerFilter, setLecturerFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAllocation, setEditingAllocation] = useState(null);
    const [allocationsData, setAllocationsData] = useState(initialLecturerSubjects);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [allocationToDelete, setAllocationToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const itemsPerPage = 5;

    const getLecturer = (lecturerId) => sampleLecturers.find((l) => l.id === lecturerId);
    const getSubject = (subjectCode) => sampleSubjects.find((s) => s.code === subjectCode);
    const getCalendar = (calendarId) => sampleCalendars.find((c) => c.id === calendarId);
    const getProgram = (programCode) => samplePrograms.find((p) => p.unique_code === programCode);
    const getCourseAssignment = (courseAssignmentId) => sampleCourseAssignments.find((ca) => ca.id === courseAssignmentId);

    const transformedData = allocationsData.map((allocation) => {
        const lecturer = getLecturer(allocation.lecturer_id);
        const courseAssignment = getCourseAssignment(allocation.course_assignment_id);
        const subject = getSubject(courseAssignment?.subject_code);
        const program = getProgram(courseAssignment?.program_code);
        const calendar = getCalendar(allocation.calendar_id);

        return {
            ...allocation,
            lecturer,
            subject,
            program,
            courseAssignment,
            calendar,
        };
    });

    const filteredData = transformedData.filter((allocation) => {
        if (!allocation.lecturer || !allocation.subject || !allocation.calendar) {
            return false;
        }

        const matchesSearch =
            allocation.lecturer.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            allocation.lecturer.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            allocation.subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            allocation.subject.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSchoolYear = allocation.calendar.school_year === schoolYearFilter;
        const term = sampleTerms.find((t) => t.id === allocation.calendar.term_id);
        const matchesTerm = termFilter === 'all' || term?.name === termFilter;
        const matchesProgram = programFilter === 'all' || allocation.program?.unique_code === programFilter;
        const matchesLecturer = lecturerFilter === 'all' || allocation.lecturer_id.toString() === lecturerFilter;

        return matchesSearch && matchesSchoolYear && matchesTerm && matchesProgram && matchesLecturer;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setIsLoading(true);
            setTimeout(() => {
                setCurrentPage(page);
                setIsLoading(false);
            }, 800);
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

    const handleSaveAllocation = (formData) => {
        const courseAssignment = sampleCourseAssignments.find((ca) => ca.id === formData.course_assignment_id);
        if (!courseAssignment) return;

        // Check for duplicate allocation
        const existingAllocation = allocationsData.find((alloc) => {
            const allocCourseAssignment = sampleCourseAssignments.find((ca) => ca.id === alloc.course_assignment_id);
            return (
                allocCourseAssignment &&
                allocCourseAssignment.subject_code === courseAssignment.subject_code &&
                allocCourseAssignment.program_code === courseAssignment.program_code &&
                alloc.calendar_id === formData.calendar_id &&
                alloc.id !== editingAllocation?.id
            );
        });

        if (existingAllocation) {
            alert('This subject is already allocated to this program in the selected term.');
            return;
        }

        // TODO: BACKEND REQUEST - Store/Update subject allocation
        if (editingAllocation) {
            // UPDATE: Edit existing allocation
            // router.put(`/subject-allocation/${editingAllocation.id}`, {
            //     lecturer_id: formData.lecturer_id,
            //     prog_subj_id: formData.course_assignment_id,
            //     sy_term_id: formData.calendar_id
            // }, {
            //     preserveScroll: true,
            //     onSuccess: () => {
            //         console.log('Allocation updated successfully');
            //         setIsDialogOpen(false);
            //     },
            //     onError: (errors) => {
            //         console.error('Error updating allocation:', errors);
            //     }
            // });
            
            // TEMPORARY: Local state update (remove when backend is implemented)
            setAllocationsData((prevData) =>
                prevData.map((allocation) =>
                    allocation.id === editingAllocation.id
                        ? {
                              ...allocation,
                              ...formData,
                              updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                          }
                        : allocation,
                ),
            );
        } else {
            // CREATE: Add new allocation
            // router.post('/subject-allocation', {
            //     lecturer_id: formData.lecturer_id,
            //     prog_subj_id: formData.course_assignment_id,
            //     sy_term_id: formData.calendar_id
            // }, {
            //     preserveScroll: true,
            //     onSuccess: () => {
            //         console.log('Allocation created successfully');
            //         setCurrentPage(1);
            //         setIsDialogOpen(false);
            //     },
            //     onError: (errors) => {
            //         console.error('Error creating allocation:', errors);
            //     }
            // });
            
            // TEMPORARY: Local state update (remove when backend is implemented)
            const newAllocation = {
                id: Math.max(...allocationsData.map((a) => a.id), 0) + 1,
                ...formData,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };
            setAllocationsData((prevData) => [...prevData, newAllocation]);
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

            // TODO: BACKEND REQUEST - Delete subject allocation
            // DELETE: Remove existing allocation
            // router.delete(`/subject-allocation/${allocationToDelete.id}`, {
            //     preserveScroll: true,
            //     onSuccess: () => {
            //         console.log('Allocation deleted successfully');
            //         
            //         // Adjust current page if necessary
            //         const newTotalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
            //         if (currentPage > newTotalPages && newTotalPages > 0) {
            //             setCurrentPage(newTotalPages);
            //         } else if (filteredData.length === 1) {
            //             setCurrentPage(1);
            //         }
            //         
            //         setIsDeleting(false);
            //         setDeleteDialogOpen(false);
            //         setAllocationToDelete(null);
            //     },
            //     onError: (errors) => {
            //         console.error('Error deleting allocation:', errors);
            //         setIsDeleting(false);
            //         setDeleteDialogOpen(false);
            //         setAllocationToDelete(null);
            //     }
            // });

            try {
                // TEMPORARY: Simulate API call (remove when backend is implemented)
                await new Promise((resolve) => setTimeout(resolve, 1000));

                setAllocationsData((prevData) => prevData.filter((allocation) => allocation.id !== allocationToDelete.id));

                // Adjust current page if necessary
                const newTotalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                } else if (filteredData.length === 1) {
                    setCurrentPage(1);
                }
            } finally {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
                setAllocationToDelete(null);
            }
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

    const schoolYears = [...new Set(sampleCalendars.map((c) => c.school_year))];
    const termNames = [
        ...new Set(
            sampleCalendars
                .map((c) => {
                    const term = sampleTerms.find((t) => t.id === c.term_id);
                    return term?.name;
                })
                .filter(Boolean),
        ),
    ];
    const programCodes = samplePrograms.map((p) => p.unique_code);

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
                                        placeholder="Search allocations..."
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
                                        {termNames.map((term) => (
                                            <SelectItem key={term} value={term}>
                                                {term}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={programFilter} onValueChange={setProgramFilter}>
                                    <SelectTrigger className="w-full md:w-[140px]">
                                        <SelectValue placeholder="Program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Programs</SelectItem>
                                        {samplePrograms.map((program) => (
                                            <SelectItem key={program.unique_code} value={program.unique_code}>
                                                {program.unique_code} - {program.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={lecturerFilter} onValueChange={setLecturerFilter}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Lecturer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Lecturers</SelectItem>
                                        {sampleLecturers.map((lecturer) => (
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
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {filteredData.length} allocations
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
                                            const lecturer = getLecturer(allocation.lecturer_id);
                                            const courseAssignment = getCourseAssignment(allocation.course_assignment_id);
                                            const subject = getSubject(courseAssignment?.subject_code);
                                            const calendar = getCalendar(allocation.calendar_id);
                                            const program = getProgram(courseAssignment?.program_code);

                                            return (
                                                <TableRow key={allocation.id} className="hover:bg-muted/50">
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <User className="text-muted-foreground h-4 w-4" />
                                                            <div>
                                                                <div className="font-medium">
                                                                    {lecturer
                                                                        ? `${lecturer.title} ${lecturer.fname} ${lecturer.lname}`
                                                                        : 'Unknown Lecturer'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen className="text-muted-foreground h-4 w-4" />
                                                                <span className="font-mono text-sm font-medium">{subject?.code || 'Unknown'}</span>
                                                            </div>
                                                            <div className="text-sm">{subject?.name || 'Unknown Subject'}</div>
                                                            <div className="flex items-center gap-1">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {subject?.unit || 0} unit{(subject?.unit || 0) !== 1 ? 's' : ''}
                                                                </Badge>
                                                                {subject?.isGeneralEducation && (
                                                                    <Badge variant="secondary" className="bg-green-100 text-xs text-green-800">
                                                                        GE
                                                                    </Badge>
                                                                )}
                                                                {(() => {
                                                                    const assignments = sampleCourseAssignments.filter(
                                                                        (ca) => ca.subject_code === subject?.code,
                                                                    );
                                                                    if (assignments.length > 0) {
                                                                        const uniqueYearLevels = [...new Set(assignments.map((a) => a.year_level))];
                                                                        return uniqueYearLevels.map((yearLevel, index) => {
                                                                            const yearLevelName =
                                                                                getYearLevelsForProgram(4).find((y) => y.id === yearLevel)?.name ||
                                                                                `${yearLevel} Year`;
                                                                            return (
                                                                                <Badge
                                                                                    key={index}
                                                                                    variant="default"
                                                                                    className="bg-blue-100 text-xs text-blue-800"
                                                                                >
                                                                                    {yearLevelName}
                                                                                </Badge>
                                                                            );
                                                                        });
                                                                    }
                                                                    return null;
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-xs">
                                                            <Badge variant="outline" className="text-xs">
                                                                {program?.unique_code || 'Unknown'} - {program?.name || 'Unknown Program'}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <GraduationCap className="text-muted-foreground h-4 w-4" />
                                                            <span className="font-medium">
                                                                {(() => {
                                                                    const term = sampleTerms.find((t) => t.id === calendar?.term_id);
                                                                    return term?.name || 'Unknown Term';
                                                                })()}
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

                {!isLoading && filteredData.length > itemsPerPage && (
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
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
        </AppLayout>
    );
}

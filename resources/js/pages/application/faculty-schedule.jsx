import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { BookOpen, Calendar as CalendarIcon, Clock, Edit, Grid3x3, List, MapPin, MoreHorizontal, Plus, Trash2, User, Users } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Faculty Schedule',
        href: '/faculty-schedule',
    },
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'];

// Time slots as key-value pairs: key = 24h format (for backend), value = 12h format (for display)
const TIME_SLOTS = {
    '08:00': '8:00 AM',
    '08:30': '8:30 AM',
    '09:00': '9:00 AM',
    '09:30': '9:30 AM',
    '10:00': '10:00 AM',
    '10:30': '10:30 AM',
    '11:00': '11:00 AM',
    '11:30': '11:30 AM',
    '12:00': '12:00 PM',
    '12:30': '12:30 PM',
    '13:00': '1:00 PM',
    '13:30': '1:30 PM',
    '14:00': '2:00 PM',
    '14:30': '2:30 PM',
    '15:00': '3:00 PM',
    '15:30': '3:30 PM',
    '16:00': '4:00 PM',
    '16:30': '4:30 PM',
    '17:00': '5:00 PM',
    '17:30': '5:30 PM',
    '18:00': '6:00 PM',
};

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}

// Generate color for each unique class-subject combination
function generateColors() {
    const colors = [
        'bg-blue-100 border-blue-300 text-blue-800',
        'bg-green-100 border-green-300 text-green-800',
        'bg-purple-100 border-purple-300 text-purple-800',
        'bg-orange-100 border-orange-300 text-orange-800',
        'bg-pink-100 border-pink-300 text-pink-800',
        'bg-indigo-100 border-indigo-300 text-indigo-800',
        'bg-yellow-100 border-yellow-300 text-yellow-800',
        'bg-red-100 border-red-300 text-red-800',
        'bg-teal-100 border-teal-300 text-teal-800',
        'bg-cyan-100 border-cyan-300 text-cyan-800',
        'bg-emerald-100 border-emerald-300 text-emerald-800',
        'bg-violet-100 border-violet-300 text-violet-800',
    ];
    return colors;
}

// Create time slot grid
function ScheduleGrid({ schedules }) {
    const timeSlots = Object.keys(TIME_SLOTS);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const colors = generateColors();

    // Create color mapping for each unique class-subject combination
    const getClassSubjectKey = (schedule) => `${schedule.class_id}-${schedule.subj_code}`;
    const uniqueClassSubjects = [...new Set(schedules.map(getClassSubjectKey))];
    const colorMap = {};
    uniqueClassSubjects.forEach((key, index) => {
        colorMap[key] = colors[index % colors.length];
    });

    // Calculate time slot spans for each schedule
    const getTimeSlotSpan = (startTime, endTime) => {
        const startIndex = timeSlots.indexOf(startTime);
        const endIndex = timeSlots.findIndex((slot) => slot >= endTime);

        if (startIndex === -1) return { startIndex: 0, span: 1 };

        // If endTime is not found or is beyond our slots, calculate span differently
        let span;
        if (endIndex === -1) {
            // End time is beyond our time slots, span to the end
            span = timeSlots.length - startIndex;
        } else {
            span = Math.max(1, endIndex - startIndex);
        }

        return { startIndex, span };
    };

    // Create a grid structure to track occupied cells and schedule placements
    const gridData = {};
    days.forEach((day) => {
        gridData[day] = {};
        timeSlots.forEach((slot) => {
            gridData[day][slot] = {
                schedules: [],
                isOccupied: false,
                isSpanned: false, // Indicates this cell is part of a multi-slot schedule
                spanningSchedule: null, // Reference to the schedule that spans this cell
            };
        });
    });

    // Place schedules in the grid
    schedules.forEach((schedule) => {
        const day = schedule.day;
        const { startIndex, span } = getTimeSlotSpan(schedule.start_time, schedule.end_time);

        if (startIndex >= 0 && startIndex < timeSlots.length) {
            const startSlot = timeSlots[startIndex];

            // Place the schedule in the starting time slot
            gridData[day][startSlot].schedules.push({
                ...schedule,
                span: span,
            });

            // Mark all spanned cells as occupied
            for (let i = startIndex; i < Math.min(startIndex + span, timeSlots.length); i++) {
                const slot = timeSlots[i];
                gridData[day][slot].isOccupied = true;
                if (i > startIndex) {
                    gridData[day][slot].isSpanned = true;
                    gridData[day][slot].spanningSchedule = schedule;
                }
            }
        }
    });

    const formatTime = (time) => {
        return TIME_SLOTS[time] || time;
    };

    return (
        <div className="overflow-x-auto">
            <div className="relative min-w-[800px]">
                {/* Header */}
                <div className="mb-2 grid grid-cols-8 gap-1">
                    <div className="rounded bg-gray-100 p-3 text-center font-semibold">Time</div>
                    {days.map((day) => (
                        <div key={day} className="rounded bg-gray-100 p-3 text-center font-semibold">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Generate all time slots from TIME_SLOTS */}
                {timeSlots.map((timeSlot, timeIndex) => {
                    return (
                        <div key={timeSlot} className="relative mb-1 grid grid-cols-8 gap-1">
                            {/* Time column */}
                            <div className="rounded border bg-gray-50 p-3 text-center text-sm font-medium">
                                <div>{formatTime(timeSlot)}</div>
                            </div>

                            {/* Day columns */}
                            {days.map((day, colIndex) => {
                                const cellData = gridData[day][timeSlot];

                                // If this cell is spanned by a schedule from a previous time slot, render empty space
                                if (cellData.isSpanned && cellData.schedules.length === 0) {
                                    return (
                                        <div key={`${day}-${timeSlot}`} className="rounded border" style={{ minHeight: '60px' }}>
                                            {/* Empty space - consumed by spanning schedule above */}
                                        </div>
                                    );
                                }

                                return (
                                    <div key={`${day}-${timeSlot}`} className="relative rounded border" style={{ minHeight: '60px' }}>
                                        {cellData.schedules.map((schedule, index) => {
                                            const classSubjectKey = getClassSubjectKey(schedule);
                                            const colorClass = colorMap[classSubjectKey];
                                            const span = schedule.span;

                                            // Calculate the height to span across multiple time slots
                                            const spanHeight = span * 60 + (span - 1) * 4; // 80px per slot + 4px gap between slots

                                            return (
                                                <div
                                                    key={`${schedule.id}-${index}`}
                                                    className={`absolute inset-0 rounded border-l-4 p-2 text-xs ${colorClass} z-10 flex flex-col items-center justify-center text-center`}
                                                    style={{
                                                        height: `${spanHeight}px`,
                                                        top: '0px',
                                                    }}
                                                >
                                                    <div className="mb-1 text-sm font-semibold">{schedule.subject?.name || schedule.subj_code}</div>
                                                    <div className="mb-1 text-xs opacity-75">{schedule.group?.name}</div>
                                                    <div className="mb-1 text-xs opacity-75">Room: {schedule.room_code}</div>
                                                    <div className="text-xs opacity-75">
                                                        <div>{formatTime(schedule.start_time)}</div>
                                                        <div>{formatTime(schedule.end_time)}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ScheduleDialog({ isOpen, onClose, schedule = null, onSave, lecturers, academicCalendars, rooms, errors = null }) {
    const [formData, setFormData] = useState({
        lecturer_id: '',
        sy_term_id: '',
        subj_code: '',
        room_code: '',
        class_id: '',
        day: '',
        start_time: '',
        end_time: '',
    });
    const [validationError, setValidationError] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            if (schedule) {
                // Edit mode - populate form with existing schedule data
                setFormData({
                    lecturer_id: schedule.lecturer_id?.toString() || '',
                    sy_term_id: schedule.sy_term_id?.toString() || '',
                    subj_code: schedule.subj_code || '',
                    room_code: schedule.room_code || '',
                    class_id: schedule.class_id?.toString() || '',
                    day: schedule.day || '',
                    start_time: schedule.start_time || '',
                    end_time: schedule.end_time || '',
                });

                // Load subjects and classes if we have the required data
                if (schedule.lecturer_id && schedule.sy_term_id) {
                    loadSubjects(schedule.sy_term_id, schedule.lecturer_id);
                }
            } else {
                // Add mode - clear form
                setFormData({
                    lecturer_id: '',
                    sy_term_id: '',
                    subj_code: '',
                    room_code: '',
                    class_id: '',
                    day: '',
                    start_time: '',
                    end_time: '',
                });
                setAvailableSubjects([]);
                setAvailableClasses([]);
            }
        }
        setValidationError('');
    }, [schedule, isOpen]);

    const loadSubjects = async (syTermId, lecturerId) => {
        if (!syTermId || !lecturerId) return;

        setIsLoadingSubjects(true);
        try {
            const response = await fetch(`/api/subject-by-lecturer-schoolyear/${syTermId}/${lecturerId}`);
            const subjects = await response.json();
            console.log(subjects);
            setAvailableSubjects(subjects);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setAvailableSubjects([]);
        } finally {
            setIsLoadingSubjects(false);
        }
    };

    const loadClasses = async (progCode) => {
        if (!progCode) return;

        setIsLoadingClasses(true);
        try {
            const response = await fetch(`/api/classes-by-prog-code/${progCode}`);
            const classes = await response.json();
            setAvailableClasses(classes);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setAvailableClasses([]);
        } finally {
            setIsLoadingClasses(false);
        }
    };

    const loadClassesForExistingSubject = async (subjCode) => {
        // Find the subject in the current availableSubjects to get its program code
        const selectedProgramSubject = availableSubjects.find((programSubject) => programSubject.subject?.code === subjCode);

        if (selectedProgramSubject && selectedProgramSubject.prog_code) {
            console.log('Loading classes for existing subject:', selectedProgramSubject);
            await loadClasses(selectedProgramSubject.prog_code);
        } else {
            console.warn('Could not find program code for existing subject:', subjCode);
        }
    };

    const handleLecturerTermChange = async () => {
        const { lecturer_id, sy_term_id } = formData;
        if (lecturer_id && sy_term_id) {
            await loadSubjects(sy_term_id, lecturer_id);
        }
    };

    const handleSubjectChange = async (subjCode) => {
        // Always reset class selection when subject changes
        setFormData({ ...formData, subj_code: subjCode, class_id: '' });
        setAvailableClasses([]); // Clear existing classes first

        // If no subject selected, just clear classes
        if (!subjCode) {
            return;
        }

        // Find the selected subject from availableSubjects including its prog_code
        const selectedProgramSubject = availableSubjects.find((programSubject) => programSubject.subject?.code === subjCode);

        if (selectedProgramSubject) {
            console.log('Selected Subject:', {
                subject: selectedProgramSubject.subject,
                prog_code: selectedProgramSubject.prog_code,
            });

            // Load classes based on the program code
            if (selectedProgramSubject.prog_code) {
                await loadClasses(selectedProgramSubject.prog_code);
            }
        } else {
            console.warn('No program found for selected subject');
        }
    };

    React.useEffect(() => {
        handleLecturerTermChange();
    }, [formData.lecturer_id, formData.sy_term_id]);

    // Watch for availableSubjects changes in edit mode to load classes
    React.useEffect(() => {
        if (schedule && availableSubjects.length > 0 && formData.subj_code && availableClasses.length === 0) {
            // This is edit mode and subjects have been loaded, now load classes for the existing subject
            console.log('Edit mode: Loading classes for existing subject', formData.subj_code);
            loadClassesForExistingSubject(formData.subj_code);
        }
    }, [availableSubjects, formData.subj_code, schedule]);

    const handleSave = () => {
        console.log('Saving schedule with data:', formData);
        if (
            !formData.lecturer_id ||
            !formData.sy_term_id ||
            !formData.subj_code ||
            !formData.room_code ||
            !formData.class_id ||
            !formData.day ||
            !formData.start_time ||
            !formData.end_time
        ) {
            setValidationError('Please fill all required fields');
            return;
        }

        if (formData.start_time >= formData.end_time) {
            setValidationError('End time must be after start time');
            return;
        }

        onSave({
            lecturer_id: parseInt(formData.lecturer_id),
            sy_term_id: parseInt(formData.sy_term_id),
            subj_code: formData.subj_code,
            room_code: formData.room_code,
            class_id: parseInt(formData.class_id),
            day: formData.day,
            start_time: formData.start_time,
            end_time: formData.end_time,
        });
        // Don't close dialog here - let the parent component handle closing on success
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{schedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
                    <DialogDescription>{schedule ? 'Update the schedule details below.' : 'Create a new faculty schedule entry.'}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {validationError && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-600">{validationError}</div>}
                    {errors && (
                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-600">
                            <div className="mb-2 font-semibold">⚠️ Please fix the following errors:</div>
                            <ul className="list-inside list-disc space-y-1">
                                {Object.entries(errors).map(([field, messages]) => (
                                    <li key={field}>
                                        <span className="font-medium capitalize">{field.replace('_', ' ')}:</span>{' '}
                                        {Array.isArray(messages) ? messages[0] : messages}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lecturer_id">Lecturer *</Label>
                            <Select value={formData.lecturer_id} onValueChange={(value) => setFormData({ ...formData, lecturer_id: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select lecturer" />
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
                            <Label htmlFor="sy_term_id">Academic Term *</Label>
                            <Select value={formData.sy_term_id} onValueChange={(value) => setFormData({ ...formData, sy_term_id: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select term" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicCalendars.map((calendar) => (
                                        <SelectItem key={calendar.id} value={calendar.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4" />
                                                <span>
                                                    {calendar.term?.name} - {calendar.school_year}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="subj_code">Subject *</Label>
                            <Select
                                value={formData.subj_code}
                                onValueChange={handleSubjectChange}
                                disabled={!formData.lecturer_id || !formData.sy_term_id || isLoadingSubjects}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            !formData.lecturer_id || !formData.sy_term_id
                                                ? 'Select lecturer and term first'
                                                : isLoadingSubjects
                                                  ? 'Loading subjects...'
                                                  : 'Select subject'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSubjects.map((programSubject) => {
                                        const subject = programSubject.subject;
                                        return subject ? (
                                            <SelectItem key={subject.code} value={subject.code}>
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4" />
                                                    <span>
                                                        {subject.code} - {subject.name}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ) : null;
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="class_id">Class/Group *</Label>
                            <Select
                                value={formData.class_id}
                                onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                                disabled={!formData.subj_code || isLoadingClasses}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            !formData.subj_code ? 'Select subject first' : isLoadingClasses ? 'Loading classes...' : 'Select class'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableClasses.map((group) => (
                                        <SelectItem key={group.id} value={group.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span>{group.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="room_code">Room *</Label>
                        <Select value={formData.room_code} onValueChange={(value) => setFormData({ ...formData, room_code: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select room" />
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.map((room) => (
                                    <SelectItem key={room.name} value={room.name}>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{room.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="day">Day *</Label>
                            <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DAYS_OF_WEEK.map((day) => (
                                        <SelectItem key={day} value={day}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start_time">Start Time *</Label>
                            <Select value={formData.start_time} onValueChange={(value) => setFormData({ ...formData, start_time: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Start time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(TIME_SLOTS).map(([value24h, display12h]) => (
                                        <SelectItem key={value24h} value={value24h}>
                                            {display12h}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_time">End Time *</Label>
                            <Select value={formData.end_time} onValueChange={(value) => setFormData({ ...formData, end_time: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="End time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(TIME_SLOTS).map(([value24h, display12h]) => (
                                        <SelectItem key={value24h} value={value24h}>
                                            {display12h}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>{schedule ? 'Update' : 'Create'} Schedule</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function FacultySchedule() {
    const { data } = usePage().props;
    const {
        schedules = [],
        academicCalendars = [],
        lecturers = [],
        rooms = [],
        statistics = {
            totalSchedules: 0,
            totalActiveLecturers: 0,
            totalRoomsInUse: 0,
        },
    } = data;

    const [isLoading, setIsLoading] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState('');
    const [selectedLecturer, setSelectedLecturer] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [scheduleErrors, setScheduleErrors] = useState(null);

    // Use statistics from backend (independent of current filters)
    const { totalSchedules, totalActiveLecturers, totalRoomsInUse } = statistics;

    const handleAddSchedule = () => {
        setEditingSchedule(null);
        setScheduleErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleEditSchedule = (schedule) => {
        setEditingSchedule(schedule);
        setScheduleErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleSaveSchedule = (formData) => {
        setScheduleErrors(null); // Clear previous errors

        // Add current filter parameters to preserve them after redirect
        const dataWithFilters = {
            ...formData,
            term_filter: selectedCalendar,
            lecturer_filter: selectedLecturer,
            class_filter: selectedClass || null,
        };

        if (editingSchedule) {
            router.put(`/faculty-schedule/${editingSchedule.id}`, dataWithFilters, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setScheduleErrors(null);
                },
                onError: (errors) => {
                    console.error('Error updating schedule:', errors);
                    setScheduleErrors(errors);
                },
            });
        } else {
            router.post('/faculty-schedule', dataWithFilters, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setScheduleErrors(null);
                },
                onError: (errors) => {
                    console.error('Error creating schedule:', errors);
                    setScheduleErrors(errors);
                },
            });
        }
    };

    const handleDeleteSchedule = (schedule) => {
        setScheduleToDelete(schedule);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteSchedule = () => {
        if (scheduleToDelete) {
            setIsDeleting(true);

            // Add current filter parameters to preserve them after redirect
            const dataWithFilters = {
                term_filter: selectedCalendar,
                lecturer_filter: selectedLecturer,
                class_filter: selectedClass || null,
            };

            router.delete(`/faculty-schedule/${scheduleToDelete.id}`, {
                data: dataWithFilters,
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            });
        }
    };

    const formatTime = (time) => {
        return new Date(`1970-01-01T${time}:00`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Apply filters - only when both lecturer and term are selected
    React.useEffect(() => {
        if (selectedLecturer && selectedCalendar) {
            applyFilters();
        }
    }, [selectedCalendar, selectedLecturer, selectedClass]);

    const applyFilters = React.useCallback(() => {
        // Don't make API call if required filters are missing
        if (!selectedLecturer || !selectedCalendar) {
            return;
        }

        const params = new URLSearchParams();

        params.append('term_filter', selectedCalendar);
        params.append('lecturer_filter', selectedLecturer);
        if (selectedClass) params.append('class_filter', selectedClass);

        setIsLoading(true);
        router.get('/faculty-schedule', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    }, [selectedCalendar, selectedLecturer, selectedClass]);

    const handleGenerateReport = () => {
        if (!selectedLecturer || !selectedCalendar) {
            alert('Please select both lecturer and term before generating report.');
            return;
        }

        // Get lecturer details
        const selectedLecturerData = lecturers.find((l) => l.id.toString() === selectedLecturer);
        const selectedTermData = academicCalendars.find((c) => c.id.toString() === selectedCalendar);

        // Get unique subjects taught
        const uniqueSubjects = [...new Set(schedules.map((s) => s.subject?.name || s.subj_code))];
        const teachingLoad = schedules.length;

        // Create print content
        const printContent = createPrintableReport({
            lecturer: selectedLecturerData,
            term: selectedTermData,
            subjects: uniqueSubjects,
            teachingLoad: teachingLoad,
            schedules: schedules,
        });

        // Open print dialog
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    const createPrintableReport = ({ lecturer, term, subjects, teachingLoad, schedules }) => {
        const lecturerName = `${lecturer?.title || ''} ${lecturer?.fname || ''} ${lecturer?.lname || ''}`.trim();
        const termInfo = `${term?.term?.name || ''} - ${term?.school_year || ''}`;

        const generateScheduleGrid = (schedules) => {
            const timeSlots = Object.keys(TIME_SLOTS);
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const colors = ['blue-card', 'green-card', 'purple-card', 'orange-card', 'pink-card', 'indigo-card', 'yellow-card', 'red-card'];

            // Define base height for each time slot
            const BASE_SLOT_HEIGHT = 30; // Height for each 30-minute slot
            const GAP_HEIGHT = 5; // Gap between rows

            // Create color mapping for each unique class-subject combination
            const getClassSubjectKey = (schedule) => `${schedule.class_id}-${schedule.subj_code}`;
            const uniqueClassSubjects = [...new Set(schedules.map(getClassSubjectKey))];
            const colorMap = {};
            uniqueClassSubjects.forEach((key, index) => {
                colorMap[key] = colors[index % colors.length];
            });

            // Calculate time slot spans for each schedule
            const getTimeSlotSpan = (startTime, endTime) => {
                const startIndex = timeSlots.indexOf(startTime);
                const endIndex = timeSlots.findIndex((slot) => slot >= endTime);

                if (startIndex === -1) {
                    console.warn(`Invalid start time: ${startTime}`);
                    return { startIndex: 0, span: 1 };
                }

                let span;
                if (endIndex === -1) {
                    console.warn(`End time beyond slots: ${endTime}`);
                    span = timeSlots.length - startIndex;
                } else {
                    span = Math.max(1, endIndex - startIndex);
                }

                return { startIndex, span };
            };

            // Create a grid structure to track occupied cells and schedule placements
            const gridData = {};
            days.forEach((day) => {
                gridData[day] = {};
                timeSlots.forEach((slot) => {
                    gridData[day][slot] = {
                        schedules: [],
                        isOccupied: false,
                        isSpanned: false,
                        spanningSchedule: null,
                    };
                });
            });

            // Place schedules in the grid
            schedules.forEach((schedule) => {
                const day = schedule.day;
                const { startIndex, span } = getTimeSlotSpan(schedule.start_time, schedule.end_time);

                if (startIndex >= 0 && startIndex < timeSlots.length) {
                    const startSlot = timeSlots[startIndex];

                    // Place the schedule in the starting time slot
                    gridData[day][startSlot].schedules.push({
                        ...schedule,
                        span: span,
                    });

                    // Mark all spanned cells as occupied
                    for (let i = startIndex; i < Math.min(startIndex + span, timeSlots.length); i++) {
                        const slot = timeSlots[i];
                        gridData[day][slot].isOccupied = true;
                        if (i > startIndex) {
                            gridData[day][slot].isSpanned = true;
                            gridData[day][slot].spanningSchedule = schedule;
                        }
                    }
                } else {
                    console.warn(`Schedule out of bounds: ${schedule.subj_code} on ${day} at ${schedule.start_time}`);
                }
            });

            let gridHTML = `
        <div class="schedule-container">
            <div class="grid-header">
                <div class="header-cell">Time</div>
                ${days.map((day) => `<div class="header-cell">${day}</div>`).join('')}
            </div>
        `;

            timeSlots.forEach((timeSlot, timeIndex) => {
                gridHTML += `<div class="grid-row">`;
                gridHTML += `<div class="time-cell">${TIME_SLOTS[timeSlot]}</div>`;

                days.forEach((day) => {
                    const cellData = gridData[day][timeSlot];

                    // If this cell is spanned by a schedule from a previous time slot, don't render anything
                    if (cellData.isSpanned && cellData.schedules.length === 0) {
                        gridHTML += `<div class="day-cell" style="height: ${BASE_SLOT_HEIGHT}px; border: none;"></div>`;
                        return;
                    }

                    // Empty cell - show grid lines
                    if (cellData.schedules.length === 0) {
                        gridHTML += `<div class="day-cell" style="height: ${BASE_SLOT_HEIGHT}px;"></div>`;
                        return;
                    }

                    // Cell with schedule
                    gridHTML += `<div class="day-cell" style="height: ${BASE_SLOT_HEIGHT}px; border: none;">`;

                    cellData.schedules.forEach((schedule, index) => {
                        const classSubjectKey = getClassSubjectKey(schedule);
                        const colorClass = colorMap[classSubjectKey];
                        const span = schedule.span;
                        const spanHeight = span * BASE_SLOT_HEIGHT + (span - 1) * GAP_HEIGHT;

                        gridHTML += `
                    <div class="schedule-card ${colorClass}" style="height: ${spanHeight}px;">
                        <div class="subject-name">${schedule.subject?.name || schedule.subj_code}</div>
                        <div class="class-name">${schedule.group?.name}</div>
                        <div class="room-info">Room: ${schedule.room_code}</div>
                        <div class="time-info">
                            <div>${TIME_SLOTS[schedule.start_time]}</div>
                            <div>${TIME_SLOTS[schedule.end_time]}</div>
                        </div>
                    </div>
                `;
                    });

                    gridHTML += `</div>`;
                });

                gridHTML += `</div>`;
            });

            gridHTML += `</div>`;

            return gridHTML;
        };

        return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Faculty Schedule Report</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 15px;
                color: #000;
                font-size: 12px;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .program-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
                text-align: center;
            }
            .report-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 15px;
            }
            .info-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                margin-top: 20px;
            }
            .info-left, .info-right {
                flex: 1;
            }
            .schedule-container {
                width: 100%;
                margin-top: 20px;
            }
            .grid-header {
                display: grid;
                grid-template-columns: 80px repeat(7, 1fr);
                gap: 2px;
                margin-bottom: 2px;
            }
            .header-cell {
                background-color: #f3f4f6;
                padding: 6px;
                text-align: center;
                font-weight: bold;
                border: 1px solid #d1d5db;
                font-size: 9px;
            }
            .grid-row {
                display: grid;
                grid-template-columns: 80px repeat(7, 1fr);
                gap: 2px;
                margin-bottom: 2px;
            }
            .time-cell {
                background-color: #f9fafb;
                padding: 4px;
                text-align: center;
                font-weight: bold;
                border: 1px solid #d1d5db;
                font-size: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .day-cell {
                position: relative;
                border: 1px solid #d1d5db;
            }
            .schedule-card {
                position: absolute;
                left: -1px;
                right: -1px;
                top: 0px;
                padding: 2px;
                border-left: 3px solid;
                font-size: 7px;
                line-height: 1.1;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                z-index: 1;
            }
            .blue-card { background-color: #dbeafe; border-left-color: #3b82f6; color: #1e3a8a; }
            .green-card { background-color: #dcfce7; border-left-color: #22c55e; color: #166534; }
            .purple-card { background-color: #f3e8ff; border-left-color: #a855f7; color: #6b21a8; }
            .orange-card { background-color: #fed7aa; border-left-color: #fb923c; color: #c2410c; }
            .pink-card { background-color: #fce7f3; border-left-color: #ec4899; color: #be185d; }
            .indigo-card { background-color: #e0e7ff; border-left-color: #6366f1; color: #3730a3; }
            .yellow-card { background-color: #fef3c7; border-left-color: #fbbf24; color: #92400e; }
            .red-card { background-color: #fecaca; border-left-color: #ef4444; color: #991b1b; }
            .subject-name { 
                font-weight: bold; 
                margin-bottom: 1px; 
                font-size: 8px; 
            }
            .class-name { 
                margin-bottom: 1px; 
                opacity: 0.8; 
            }
            .room-info { 
                margin-bottom: 1px; 
                opacity: 0.8; 
            }
            .time-info { 
                opacity: 0.8; 
            }
            @media print {
                body { margin: 0; }
                .no-print { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="header">
        </div>
        
        <div class="program-title">FOUNDATION PROGRAM</div>
        <div class="program-title">LECTURER'S LOAD</div>
        <div class="info-section">
            <div class="info-left">
                <strong>Lecturer Name:</strong> ${lecturerName}<br>
                <strong>Subjects Taught:</strong> ${subjects.join(', ')}
            </div>
            <div class="info-right">
                <strong>No. of Teaching Load:</strong> ${teachingLoad}<br>
            </div>
        </div>
        
        ${generateScheduleGrid(schedules)}
    </body>
    </html>
`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faculty Schedule" />
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Faculty Schedule</h1>
                        <p className="text-muted-foreground mt-2">Manage faculty class schedules and time slots</p>
                    </div>
                    <Button onClick={handleAddSchedule} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Schedule
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Schedules</CardTitle>
                            <CalendarIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalSchedules}</div>
                            <p className="text-muted-foreground text-xs">Active schedule entries</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Lecturers</CardTitle>
                            <User className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalActiveLecturers}</div>
                            <p className="text-muted-foreground text-xs">Lecturers with schedules</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rooms in Use</CardTitle>
                            <MapPin className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalRoomsInUse}</div>
                            <p className="text-muted-foreground text-xs">Rooms being utilized</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Schedule Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                {/* View Toggle */}
                                <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="h-8"
                                    >
                                        <Grid3x3 className="mr-1 h-4 w-4" />
                                        Grid
                                    </Button>
                                    <Button
                                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('table')}
                                        className="h-8"
                                    >
                                        <List className="mr-1 h-4 w-4" />
                                        Table
                                    </Button>
                                </div>

                                {/* Primary Filters: Lecturer and Term are required first */}
                                <Select value={selectedLecturer} onValueChange={setSelectedLecturer}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Select Lecturer *" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lecturers.map((lecturer) => (
                                            <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                                                {lecturer.title} {lecturer.fname} {lecturer.lname}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Select Term *" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicCalendars.map((calendar) => (
                                            <SelectItem key={calendar.id} value={calendar.id.toString()}>
                                                {calendar.term?.name} - {calendar.school_year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Secondary Filter: Class (only show if lecturer and term are selected) */}
                                {selectedLecturer && selectedCalendar && (
                                    <>
                                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                                            <SelectTrigger className="w-full md:w-[200px]">
                                                <SelectValue placeholder="Filter by Class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Classes</SelectItem>
                                                {/* Extract unique classes from schedules */}
                                                {[...new Set(schedules.map((s) => s.group?.name).filter(Boolean))].map((className) => (
                                                    <SelectItem key={className} value={className}>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>{className}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {/* Generate Report Button */}
                                        <Button
                                            onClick={handleGenerateReport}
                                            variant="outline"
                                            className="w-full md:w-auto"
                                            disabled={!schedules.length}
                                        >
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Generate Report
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : schedules.length > 0 ? (
                            viewMode === 'grid' ? (
                                <ScheduleGrid schedules={schedules} />
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Subject</TableHead>
                                                <TableHead>Room</TableHead>
                                                <TableHead>Class</TableHead>
                                                <TableHead>Schedule</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {schedules.map((schedule) => (
                                                <TableRow key={schedule.id} className="hover:bg-muted/50">
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="text-muted-foreground h-4 w-4" />
                                                            <div>
                                                                <div className="font-medium">{schedule.subject?.name}</div>
                                                                <div className="text-muted-foreground text-sm">{schedule.subj_code}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="text-muted-foreground h-4 w-4" />
                                                            <span>{schedule.room_code}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="text-muted-foreground h-4 w-4" />
                                                            <span>{schedule.group?.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="font-medium">{schedule.day}</div>
                                                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                                                <Clock className="h-3 w-3" />
                                                                <span>
                                                                    {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                                </span>
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
                                                                <DropdownMenuItem onClick={() => handleEditSchedule(schedule)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Schedule
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-red-600 focus:text-red-600"
                                                                    onClick={() => handleDeleteSchedule(schedule)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete Schedule
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CalendarIcon className="text-muted-foreground mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-semibold">No schedules found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {selectedCalendar || selectedLecturer || selectedClass
                                        ? 'Try adjusting your filter criteria.'
                                        : 'Select a lecturer and term to view schedules.'}
                                </p>
                                {!selectedCalendar && !selectedLecturer && !selectedClass && (
                                    <Button onClick={handleAddSchedule}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Schedule
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Schedule Dialog */}
            <ScheduleDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                schedule={editingSchedule}
                onSave={handleSaveSchedule}
                lecturers={lecturers}
                academicCalendars={academicCalendars}
                rooms={rooms}
                errors={scheduleErrors}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Schedule</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this schedule? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteSchedule} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete Schedule'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

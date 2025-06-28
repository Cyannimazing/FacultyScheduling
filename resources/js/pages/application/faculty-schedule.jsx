import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { BookOpen, Calendar as CalendarIcon, Clock, Edit, Grid3x3, List, MapPin, MoreHorizontal, Plus, Trash2, User, Users } from 'lucide-react';
import React, { useState } from 'react';
import { formatTime, getTimeRangeDisplay, TIME_SLOTS } from '../../lib/timeFormatter';

const breadcrumbs = [
    {
        title: 'Faculty Schedule',
        href: '/faculty-schedule',
    },
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

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
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const colors = generateColors();
    // Create color mapping for each unique class-subject combination
    const getClassSubjectKey = (schedule) => `${schedule.class_id}-${schedule.prog_subj_id}`;
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

    return (
        <div className="overflow-x-auto">
            <div className="relative min-w-[800px]">
                {/* Header */}
                <div className="mb-2 grid grid-cols-6 gap-1">
                    <div className="rounded bg-gray-100 p-3 text-center font-semibold">Time</div>
                    {days.map((day) => (
                        <div key={day} className="rounded bg-gray-100 p-3 text-center font-semibold">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Generate all time slots from TIME_SLOTS */}
                {timeSlots.map((timeSlot, timeIndex) => {
                    const timeRangeDisplay = getTimeRangeDisplay(timeSlot);
                    if (timeRangeDisplay) {
                        return (
                            <div key={timeSlot} className="relative mb-1 grid grid-cols-6 gap-1">
                                {/* Time column */}
                                <div className="rounded border bg-gray-50 p-3 text-center text-sm font-medium">
                                    <div>{timeRangeDisplay}</div>
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
                                                        <div className="text-xs font-semibold">({schedule.program_subject.prog_subj_code})</div>
                                                        <div className="mb-1 text-sm font-semibold">{schedule.program_subject.subject?.name}</div>
                                                        <div className="mb-1 text-xs opacity-75">
                                                            Class: {schedule.group.prog_code}({schedule.group?.name})
                                                        </div>
                                                        <div className="mb-1 text-xs opacity-75">Room: {schedule.room_code}</div>
                                                        <div className="text-xs opacity-75">
                                                            <div>
                                                                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}

function ScheduleDialog({ isOpen, onClose, schedule = null, onSave, lecturers, academicCalendars, rooms, existingBatches = [], errors = null }) {
    const [formData, setFormData] = useState({
        lecturer_id: '',
        sy_term_id: '',
        prog_subj_id: '',
        room_code: '',
        class_id: '',
        batch_no: '',
        day: '',
        start_time: '',
        end_time: '',
        selectedSubjectValue: '',
    });
    const [validationError, setValidationError] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [availableEndTimes, setAvailableEndTimes] = useState([]);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);
    const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
    const [isDialogLoading, setIsDialogLoading] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            if (schedule) {
                console.log(schedule);
                // Edit mode - populate form with existing schedule data
                setIsDialogLoading(true);
                setFormData({
                    lecturer_id: schedule.lecturer_id?.toString() || '',
                    sy_term_id: schedule.sy_term_id?.toString() || '',
                    prog_subj_id: schedule.prog_subj_id?.toString() || '',
                    room_code: schedule.room_code || '',
                    class_id: schedule.class_id?.toString() || '',
                    batch_no: schedule.batch_no?.toString() || '', // Read-only during edit
                    day: schedule.day || '',
                    start_time: schedule.start_time || '',
                    end_time: schedule.end_time || '',
                    selectedSubjectValue: schedule.prog_subj_id?.toString() || '',
                });

                // Load subjects first, then classes
                if (schedule.lecturer_id && schedule.sy_term_id) {
                    console.log('Edit mode: Loading subjects for lecturer', schedule.lecturer_id, 'and term', schedule.sy_term_id);
                    loadSubjects(schedule.sy_term_id, schedule.lecturer_id, schedule.prog_subj_id).finally(() => {
                        setIsDialogLoading(false);
                    });
                } else {
                    setIsDialogLoading(false);
                }
            } else {
                // Add mode - clear form
                setIsDialogLoading(false);
                setFormData({
                    lecturer_id: '',
                    sy_term_id: '',
                    prog_subj_id: '',
                    room_code: '',
                    class_id: '',
                    batch_no: existingBatches.length > 0 ? (Math.max(...existingBatches) + 1).toString() : '1', // Auto-select next batch
                    day: '',
                    start_time: '',
                    end_time: '',
                    selectedSubjectValue: '',
                });
                setAvailableSubjects([]);
                setAvailableClasses([]);
                setAvailableTimeSlots([]);
                setAvailableEndTimes([]);
            }
        }
        setValidationError('');
    }, [schedule, isOpen]);

    const loadSubjects = async (syTermId, lecturerId, progSubjId = null) => {
        if (!syTermId || !lecturerId) return Promise.resolve([]);

        console.log('loadSubjects called with:', { syTermId, lecturerId, progSubjId });
        setIsLoadingSubjects(true);
        try {
            const url = `/api/subject-by-lecturer-schoolyear/${syTermId}/${lecturerId}`;
            console.log('Fetching subjects from URL:', url);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const subjects = await response.json();
            console.log('Loaded subjects:', subjects);
            setAvailableSubjects(subjects);

            // In edit mode, if we have a prog_subj_id, ensure the selectedSubjectValue is set and load classes
            if (schedule && progSubjId) {
                const matchingSubject = subjects.find((s) => s.id === parseInt(progSubjId));
                if (matchingSubject) {
                    console.log('Edit mode: Found matching subject, updating form data and loading classes');
                    setFormData((prev) => ({
                        ...prev,
                        selectedSubjectValue: progSubjId.toString(),
                    }));

                    // Also load classes if we have the program code
                    if (matchingSubject.prog_code) {
                        console.log('Loading classes for program code:', matchingSubject.prog_code);
                        await loadClasses(matchingSubject.prog_code);
                    } else {
                        console.warn('No program code found for subject:', matchingSubject);
                    }
                } else {
                    console.warn('No matching subject found for prog_subj_id:', progSubjId);
                }
            }

            return subjects; // Return the subjects for chaining
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setAvailableSubjects([]);
            return [];
        } finally {
            setIsLoadingSubjects(false);
        }
    };

    const loadClasses = async (progCode) => {
        if (!progCode) return [];

        setIsLoadingClasses(true);
        try {
            const response = await fetch(`/api/classes-by-prog-code/${progCode}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const classes = await response.json();
            console.log('Loaded classes for program code:', progCode, classes);
            setAvailableClasses(classes);
            return classes;
        } catch (error) {
            console.error('Error fetching classes:', error);
            setAvailableClasses([]);
            return [];
        } finally {
            setIsLoadingClasses(false);
        }
    };

    // This function is no longer needed - we'll handle this directly in the useEffect

    const loadAvailableTimeSlots = async () => {
        const { day, sy_term_id, lecturer_id, room_code, class_id, start_time, end_time } = formData;

        // Only load if we have the required data
        if (!day || !sy_term_id) {
            setAvailableTimeSlots([]);
            setAvailableEndTimes([]);
            return;
        }

        setIsLoadingTimeSlots(true);
        try {
            // Check if this is a new batch (not in existing batches)
            const isNewBatch = formData.batch_no && !existingBatches.includes(parseInt(formData.batch_no));

            const params = new URLSearchParams({
                day,
                sy_term_id,
                ...(lecturer_id && { lecturer_id }),
                ...(room_code && { room_code }),
                ...(class_id && { class_id }),
                ...(schedule && { exclude_schedule_id: schedule.id }), // Exclude current schedule when editing
                ...(formData.batch_no && { batch_no: formData.batch_no }), // Include batch_no for conflict detection
                ...(isNewBatch && { is_new_batch: true }), // Mark as new batch if applicable
            });

            const response = await fetch(`/api/available-time-slots?${params}`);
            const data = await response.json();

            console.log('Available time slots:', data);
            const availableSlots = data.available_time_slots || [];

            // In edit mode, ensure the existing start_time is available
            if (schedule && start_time) {
                const startTimeExists = availableSlots.some((slot) => slot.start_time === start_time);

                if (!startTimeExists) {
                    console.log('Edit mode: Adding preserved start time to available options');
                    // Create a slot for the existing start time with the existing end time as an option
                    const preservedSlot = {
                        start_time: start_time,
                        possible_end_times: end_time ? [end_time] : [],
                    };
                    availableSlots.push(preservedSlot);
                }
            }

            setAvailableTimeSlots(availableSlots);

            // Set available end times based on current start time
            // In edit mode, preserve the existing start_time value from formData
            updateAvailableEndTimes(start_time, availableSlots);
        } catch (error) {
            console.error('Error fetching available time slots:', error);

            // In edit mode, provide fallback with existing times
            if (schedule && formData.start_time) {
                const fallbackSlots = [
                    {
                        start_time: formData.start_time,
                        possible_end_times: formData.end_time ? [formData.end_time] : [],
                    },
                ];
                setAvailableTimeSlots(fallbackSlots);
                setAvailableEndTimes(formData.end_time ? [formData.end_time] : []);
            } else {
                setAvailableTimeSlots([]);
                setAvailableEndTimes([]);
            }
        } finally {
            setIsLoadingTimeSlots(false);
        }
    };

    const updateAvailableEndTimes = (startTime, timeSlots) => {
        if (!startTime) {
            setAvailableEndTimes([]);
            return;
        }

        const matchingSlot = timeSlots.find((slot) => slot.start_time === startTime);
        if (matchingSlot) {
            const newEndTimes = matchingSlot.possible_end_times || [];

            // In edit mode, always include the current end_time if it exists and is valid
            if (schedule && formData.end_time && formData.end_time > startTime) {
                // Create a merged list that includes both available times and the current end_time
                const mergedEndTimes = [...new Set([...newEndTimes, formData.end_time])].sort();
                setAvailableEndTimes(mergedEndTimes);
                console.log('Edit mode: Preserved end_time', formData.end_time, 'in available options');
            } else {
                setAvailableEndTimes(newEndTimes);
            }
        } else {
            // If start time is not in available slots but we're in edit mode, preserve the end_time
            if (schedule && formData.end_time && formData.end_time > startTime) {
                setAvailableEndTimes([formData.end_time]);
                console.log('Edit mode: Start time not in available slots, preserving end_time only');
            } else {
                setAvailableEndTimes([]);
            }
        }
    };

    const handleStartTimeChange = (startTime) => {
        setFormData({ ...formData, start_time: startTime, end_time: '' });
        updateAvailableEndTimes(startTime, availableTimeSlots);
    };

    const handleLecturerTermChange = async () => {
        const { lecturer_id, sy_term_id } = formData;
        if (lecturer_id && sy_term_id) {
            // Clear selected subject when term changes since subjects will be different
            setFormData((prev) => ({ ...prev, prog_subj_id: '', selectedSubjectValue: '', class_id: '' }));
            setAvailableSubjects([]);
            setAvailableClasses([]);
            await loadSubjects(sy_term_id, lecturer_id);
        } else {
            // Clear subjects if either lecturer or term is not selected
            setAvailableSubjects([]);
            setAvailableClasses([]);
        }
    };

    const handleSubjectChange = async (progSubjId) => {
        // Store the program subject ID and reset class selection when subject changes
        setFormData({ ...formData, prog_subj_id: progSubjId, selectedSubjectValue: progSubjId, class_id: '' });
        setAvailableClasses([]); // Clear existing classes first

        // If no program subject selected, just clear classes
        if (!progSubjId) {
            return;
        }

        // Find the selected program subject from availableSubjects
        const selectedProgramSubject = availableSubjects.find((programSubject) => programSubject.id === parseInt(progSubjId));

        if (selectedProgramSubject) {
            console.log('Selected Program Subject:', {
                id: selectedProgramSubject.id,
                subject: selectedProgramSubject.subject,
                prog_code: selectedProgramSubject.prog_code,
            });

            // Load classes based on the program code
            if (selectedProgramSubject.prog_code) {
                await loadClasses(selectedProgramSubject.prog_code);
            } else {
                console.warn('Selected program subject does not have a program code.');
            }
        } else {
            console.warn('No program subject found for ID:', progSubjId);
        }
    };

    React.useEffect(() => {
        if (!schedule) {
            // Only for add mode, not edit mode
            handleLecturerTermChange();
        }
    }, [formData.lecturer_id, formData.sy_term_id, schedule]);

    // This useEffect is no longer needed since we handle class loading directly in loadSubjects
    // Keeping it commented for reference
    // React.useEffect(() => {
    //     if (schedule && availableSubjects.length > 0 && formData.prog_subj_id) {
    //         // This logic is now handled in loadSubjects function
    //     }
    // }, [availableSubjects, schedule?.id]);

    // Watch for class loading completion in edit mode
    React.useEffect(() => {
        if (schedule && availableClasses.length > 0 && formData.class_id) {
            // In edit mode, once classes are loaded, ensure the selected class is available
            const classIdInt = parseInt(formData.class_id);
            const classExists = availableClasses.some((cls) => cls.id === classIdInt);

            if (classExists) {
                console.log('Edit mode: Class found in available classes, class_id:', formData.class_id);
            } else {
                console.warn('Edit mode: Selected class not found in available classes:', {
                    selectedClassId: formData.class_id,
                    availableClasses: availableClasses.map((c) => ({ id: c.id, name: c.name })),
                });
            }
        }
    }, [availableClasses, schedule?.id, formData.class_id]);

    // Additional effect to ensure classes are loaded when both subjects are available and we have a class_id in edit mode
    React.useEffect(() => {
        if (schedule && availableSubjects.length > 0 && formData.class_id && availableClasses.length === 0) {
            // In edit mode, if we have a class_id but no classes are loaded yet, trigger class loading
            const progSubjIdInt = parseInt(formData.prog_subj_id);
            const matchingProgramSubject = availableSubjects.find((ps) => ps.id === progSubjIdInt);

            if (matchingProgramSubject && matchingProgramSubject.prog_code) {
                console.log('Edit mode: Re-loading classes to ensure class selection is available');
                loadClasses(matchingProgramSubject.prog_code);
            }
        }
    }, [availableSubjects, schedule?.id, formData.class_id, availableClasses.length, formData.prog_subj_id]);

    // Load available time slots when relevant form data changes
    React.useEffect(() => {
        // Always load time slots when the required dependencies change
        if (formData.day && formData.sy_term_id) {
            loadAvailableTimeSlots();
        }
    }, [formData.day, formData.sy_term_id, formData.lecturer_id, formData.room_code, formData.class_id, formData.batch_no]);

    // In edit mode, reset start and end times when room or day changes
    React.useEffect(() => {
        if (schedule && isOpen) {
            // Only reset times if we're in edit mode and the dialog is open
            setFormData((prev) => ({
                ...prev,
                start_time: '',
                end_time: '',
            }));
            setAvailableEndTimes([]);
        }
    }, [formData.day, formData.room_code, schedule?.id, isOpen]);

    const handleSave = () => {
        console.log('Saving schedule with data:', formData);
        if (
            !formData.lecturer_id ||
            !formData.sy_term_id ||
            !formData.prog_subj_id ||
            !formData.room_code ||
            !formData.class_id ||
            (!schedule && !formData.batch_no) || // Only require batch_no for new schedules
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

        const saveData = {
            lecturer_id: parseInt(formData.lecturer_id),
            sy_term_id: parseInt(formData.sy_term_id),
            prog_subj_id: parseInt(formData.prog_subj_id),
            room_code: formData.room_code,
            class_id: parseInt(formData.class_id),
            day: formData.day,
            start_time: formData.start_time,
            end_time: formData.end_time,
        };

        // Include batch_no only for new schedules (not editing)
        if (!schedule && formData.batch_no) {
            saveData.batch_no = parseInt(formData.batch_no);
        }

        onSave(saveData);
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

                    {isDialogLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-4">
                                <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                                <span className="text-muted-foreground text-sm">Loading schedule data...</span>
                                <span className="text-muted-foreground text-xs">Please wait while we fetch the details</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lecturer_id">Lecturer *</Label>
                                    <Select value={formData.lecturer_id} onValueChange={(value) => setFormData({ ...formData, lecturer_id: value })}>
                                        <SelectTrigger className="w-full">
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
                                        <SelectTrigger className="w-full">
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
                                {/* Batch Number Selection - Only show for new schedules */}
                                {!schedule && (
                                    <div className="space-y-2">
                                        <Label htmlFor="batch_no">Batch Number *</Label>
                                        <Select value={formData.batch_no} onValueChange={(value) => setFormData({ ...formData, batch_no: value })}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select batch number" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {existingBatches.map((batch) => (
                                                    <SelectItem key={batch} value={batch.toString()}>
                                                        {batch}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value={existingBatches.length > 0 ? (Math.max(...existingBatches) + 1).toString() : '1'}>
                                                    {existingBatches.length > 0 ? Math.max(...existingBatches) + 1 : 1} (New Batch)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Show current batch in read-only mode for editing */}
                                {schedule && (
                                    <div className="space-y-2">
                                        <Label htmlFor="batch_no">Batch Number (Read-only)</Label>
                                        <Input value={formData.batch_no || 'N/A'} disabled className="bg-gray-100" />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="room_code">Room *</Label>
                                    <Select value={formData.room_code} onValueChange={(value) => setFormData({ ...formData, room_code: value })}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms.map((room) => (
                                                <SelectItem key={room.name} value={room.name}>
                                                    <div>
                                                        <span>{room.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prog_subj_id">Subject *</Label>
                                    <Select
                                        value={formData.selectedSubjectValue || ''}
                                        onValueChange={handleSubjectChange}
                                        disabled={!formData.lecturer_id || !formData.sy_term_id || isLoadingSubjects}
                                    >
                                        <SelectTrigger className="w-full">
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
                                                const program = programSubject.program;
                                                return subject ? (
                                                    <SelectItem key={programSubject.id} value={programSubject.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4" />
                                                            <span>
                                                                {programSubject.prog_subj_code} - {subject.name} -{' '}
                                                                {program?.code || programSubject.prog_code}
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
                                        disabled={!formData.prog_subj_id || isLoadingClasses}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={
                                                    !formData.prog_subj_id
                                                        ? 'Select subject first'
                                                        : isLoadingClasses
                                                          ? 'Loading classes...'
                                                          : 'Select class'
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

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="day">Day *</Label>
                                    <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                                        <SelectTrigger className="w-full">
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
                                    <Select
                                        value={formData.start_time}
                                        onValueChange={handleStartTimeChange}
                                        disabled={!formData.day || !formData.sy_term_id || isLoadingTimeSlots}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={
                                                    !formData.day || !formData.sy_term_id
                                                        ? 'Select day and term first'
                                                        : isLoadingTimeSlots
                                                          ? 'Loading available times...'
                                                          : availableTimeSlots.length === 0
                                                            ? 'No available times'
                                                            : schedule && schedule.start_time
                                                              ? `Current: ${TIME_SLOTS[schedule.start_time] || schedule.start_time}`
                                                              : 'Select start time'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableTimeSlots.map((slot) => (
                                                <SelectItem key={slot.start_time} value={slot.start_time}>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{TIME_SLOTS[slot.start_time]}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_time">End Time *</Label>
                                    <Select
                                        value={formData.end_time}
                                        onValueChange={(value) => setFormData({ ...formData, end_time: value })}
                                        disabled={!formData.start_time || availableEndTimes.length === 0}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={
                                                    !formData.start_time
                                                        ? 'Select start time first'
                                                        : availableEndTimes.length === 0
                                                          ? 'No available end times'
                                                          : schedule && schedule.end_time
                                                            ? `Current: ${TIME_SLOTS[schedule.end_time] || schedule.end_time}`
                                                            : 'Select end time'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableEndTimes.map((endTime) => (
                                                <SelectItem key={endTime} value={endTime}>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{TIME_SLOTS[endTime]}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isDialogLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isDialogLoading}>
                        {schedule ? 'Update' : 'Create'} Schedule
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ReportDialog({ isOpen, onClose, onGenerate, availableTerms = [] }) {
    const [formData, setFormData] = useState({
        programTitle: 'FOUNDATION PROGRAM',
        preparedBy: '',
        selectedTermId: '',
        reviewerCount: 1,
        reviewers: [''],
    });
    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                programTitle: 'FOUNDATION PROGRAM',
                preparedBy: '',
                selectedTermId: availableTerms.length > 0 ? availableTerms[0].id.toString() : '',
                reviewerCount: 1,
                reviewers: [''],
            });
        }
    }, [isOpen, availableTerms]);
    const handleReviewerCountChange = (count) => {
        const newCount = parseInt(count);
        const newReviewers = Array(newCount)
            .fill('')
            .map((_, index) => formData.reviewers[index] || '');
        setFormData({
            ...formData,
            reviewerCount: newCount,
            reviewers: newReviewers,
        });
    };

    const handleReviewerChange = (index, value) => {
        const newReviewers = [...formData.reviewers];
        newReviewers[index] = value;
        setFormData({ ...formData, reviewers: newReviewers });
    };

    const handleGenerate = () => {
        const hasRequiredFields = formData.programTitle && formData.preparedBy && formData.selectedTermId && formData.reviewers.every((reviewer) => reviewer.trim() !== '');

        if (hasRequiredFields) {
            onGenerate(formData);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Generate Report</DialogTitle>
                    <DialogDescription>Please enter the program title and prepared by information for the report.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="programTitle" className="text-right text-sm font-medium">
                            Program Title
                        </label>
                        <Input
                            id="programTitle"
                            value={formData.programTitle}
                            onChange={(e) => setFormData({ ...formData, programTitle: e.target.value })}
                            className="col-span-3"
                            placeholder="Enter program title (e.g., FOUNDATION PROGRAM)"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="selectedTermId" className="text-right text-sm font-medium">
                            Academic Term *
                        </label>
                        <Select value={formData.selectedTermId} onValueChange={(value) => setFormData({ ...formData, selectedTermId: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select term for report" />
                            </SelectTrigger>
                            <SelectContent>
                                                {availableTerms.map((term) => (
                                                    <SelectItem key={term.id} value={term.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <CalendarIcon className="h-4 w-4" />
                                                            <span>
                                                                {term.term?.name} - {term.school_year}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="preparedBy" className="text-right text-sm font-medium">
                            Prepared By
                        </label>
                        <Input
                            id="preparedBy"
                            value={formData.preparedBy}
                            onChange={(e) => setFormData({ ...formData, preparedBy: e.target.value })}
                            className="col-span-3"
                            placeholder="Enter prepared by"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="reviewerCount" className="text-right text-sm font-medium">
                            Number of Reviewers
                        </label>
                        <Select value={formData.reviewerCount.toString()} onValueChange={handleReviewerCountChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select number of reviewers" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.reviewers.map((reviewer, index) => (
                        <div key={index} className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor={`reviewer${index}`} className="text-right text-sm font-medium">
                                Reviewed and approved by {index + 1}:
                            </label>
                            <Input
                                id={`reviewer${index}`}
                                value={reviewer}
                                onChange={(e) => handleReviewerChange(index, e.target.value)}
                                className="col-span-3"
                                placeholder={`Enter reviewer ${index + 1} name`}
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        disabled={!formData.programTitle || !formData.preparedBy || !formData.selectedTermId || formData.reviewers.some((reviewer) => reviewer.trim() === '')}
                    >
                        Generate Report
                    </Button>
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
        existingBatches = [],
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
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

    const [logo, setLogo] = useState('');
    const [logoLoading, setLogoLoading] = useState(true);
    const [logoError, setLogoError] = useState(false);

    const toBase64 = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch logo: ${response.status}`);
            }
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('Failed to read file as base64'));
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting logo to base64:', error);
            throw error;
        }
    };

    React.useEffect(() => {
        toBase64('/PDFLogo.svg')
            .then((base64) => {
                setLogo(base64);
                setLogoError(false);
            })
            .catch((error) => {
                console.error('Failed to load logo:', error);
                setLogoError(true);
                setLogo(''); // Use empty string as fallback
            })
            .finally(() => {
                setLogoLoading(false);
            });
    }, []);

    // Use statistics from backend (independent of current filters)
    const { totalSchedules, totalActiveLecturers, totalRoomsInUse } = statistics;

    // Calculate total occupied hours from current schedules
    const calculateTotalOccupiedHours = (schedules) => {
        if (!schedules || schedules.length === 0) return 0;

        let totalMinutes = 0;

        schedules.forEach((schedule) => {
            const startTime = schedule.start_time;
            const endTime = schedule.end_time;

            if (startTime && endTime) {
                // Convert time strings to minutes
                const [startHour, startMin] = startTime.split(':').map(Number);
                const [endHour, endMin] = endTime.split(':').map(Number);

                const startTotalMinutes = startHour * 60 + startMin;
                const endTotalMinutes = endHour * 60 + endMin;

                // Calculate duration in minutes
                const duration = endTotalMinutes - startTotalMinutes;
                totalMinutes += duration;
            }
        });

        // Convert minutes to hours (with decimal)
        return totalMinutes / 60;
    };

    const totalOccupiedHours = calculateTotalOccupiedHours(schedules);

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

        // For the save operation, we need the actual sy_term_id from formData
        // The batch_filter is used for filtering/display purposes only
        const dataWithFilters = {
            ...formData,
            batch_filter: selectedCalendar,
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
                batch_filter: selectedCalendar,
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

    // Apply filters - only when both lecturer and batch are selected
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

        params.append('batch_filter', selectedCalendar);
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
        setIsReportDialogOpen(true);
    };

    const handleGenerateReportWithParams = (reportData) => {
        try {
            // Validate inputs first
            if (!selectedLecturer || !selectedCalendar) {
                throw new Error('Missing lecturer or calendar selection');
            }

            if (!reportData || !reportData.programTitle || !reportData.preparedBy) {
                throw new Error('Missing required report data');
            }

            if (logoLoading) {
                alert('Please wait for the logo to load before generating the report.');
                return;
            }

            // Get lecturer details
            const selectedLecturerData = lecturers.find((l) => l.id.toString() === selectedLecturer);

            // Get the selected term data based on the user's selection in the report dialog
            const selectedTermId = parseInt(reportData.selectedTermId);
            const selectedTermData = schedules.find(s => s.academic_calendar?.id === selectedTermId)?.academic_calendar || 
                                   (schedules.length > 0 ? schedules[0].academic_calendar : null);
            
            // Filter schedules to only include those from the selected term
            const filteredSchedules = schedules.filter(s => s.academic_calendar?.id === selectedTermId);

            if (!selectedLecturerData) {
                throw new Error('Selected lecturer not found');
            }

            if (!selectedTermData) {
                throw new Error('No term data found for the selected batch/schedule');
            }

            if (!filteredSchedules || filteredSchedules.length === 0) {
                throw new Error('No schedules available for the selected term to generate report');
            }

            // Get unique subjects taught for the selected term - with null checks
            const uniqueSubjects = [
                ...new Set(
                    filteredSchedules.map((s) => s.program_subject?.prog_subj_code).filter((code) => code), // Remove null/undefined values
                ),
            ];

            const teachingLoad = calculateTotalOccupiedHours(filteredSchedules);

            // Create print content with error handling using filtered schedules
            const printContent = createPrintableReport({
                lecturer: selectedLecturerData,
                term: selectedTermData,
                subjects: uniqueSubjects,
                teachingLoad: teachingLoad,
                schedules: filteredSchedules, // Use filtered schedules for the selected term
                programTitle: reportData.programTitle,
                preparedBy: reportData.preparedBy,
                reviewers: reportData.reviewers,
            });

            if (!printContent) {
                throw new Error('Failed to create printable report content');
            }

            // Create a hidden iframe and print
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.width = '210mm';
            iframe.style.height = '297mm';

            // Add error handling for iframe operations
            iframe.onerror = (err) => {
                console.error('Iframe error:', err);
                document.body.removeChild(iframe);
                throw new Error('Failed to create print iframe');
            };

            document.body.appendChild(iframe);

            // Check if iframe was created successfully
            if (!iframe.contentDocument) {
                throw new Error('Failed to access iframe document');
            }

            // Write content to iframe with error handling
            try {
                iframe.contentDocument.open();
                iframe.contentDocument.write(printContent);
                iframe.contentDocument.close();
            } catch (writeError) {
                console.error('Error writing to iframe:', writeError);
                document.body.removeChild(iframe);
                throw new Error('Failed to write content to print document');
            }

            // Wait for content to load then print
            setTimeout(() => {
                try {
                    if (iframe.contentWindow) {
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    } else {
                        throw new Error('Iframe window not available');
                    }

                    // Clean up after print dialog
                    setTimeout(() => {
                        try {
                            if (iframe.parentNode) {
                                document.body.removeChild(iframe);
                            }
                        } catch (cleanupError) {
                            console.warn('Error cleaning up iframe:', cleanupError);
                        }
                    }, 1000);
                } catch (printError) {
                    console.error('Error during print operation:', printError);
                    // Clean up iframe on error
                    try {
                        if (iframe.parentNode) {
                            document.body.removeChild(iframe);
                        }
                    } catch (cleanupError) {
                        console.warn('Error cleaning up iframe after print error:', cleanupError);
                    }
                    throw printError;
                }
            }, 500);
        } catch (error) {
            console.error('Error generating report with parameters:', error);

            // Provide more specific error messages
            let errorMessage = 'An error occurred while generating the report.';

            if (error.message.includes('Missing')) {
                errorMessage = `Report generation failed: ${error.message}`;
            } else if (error.message.includes('not found')) {
                errorMessage = `Data error: ${error.message}. Please refresh the page and try again.`;
            } else if (error.message.includes('logo')) {
                errorMessage = 'Logo is still loading. Please wait a moment and try again.';
            } else if (error.message.includes('iframe') || error.message.includes('print')) {
                errorMessage = 'Print system error. Please try again or check your browser settings.';
            }

            alert(errorMessage);
        }
    };

    // Helper function to get unique academic calendars from current schedules
    const getAvailableTermsFromSchedules = (schedules) => {
        if (!schedules || schedules.length === 0) return [];
        
        // Extract unique academic calendars based on ID
        const uniqueTerms = schedules
            .map(schedule => schedule.academic_calendar)
            .filter(calendar => calendar) // Remove null/undefined
            .filter((calendar, index, self) => 
                self.findIndex(c => c.id === calendar.id) === index
            ); // Remove duplicates by ID
            
        return uniqueTerms;
    };

    const createPrintableReport = ({ lecturer, term, subjects, teachingLoad, schedules, programTitle, preparedBy, reviewers }) => {
        const lecturerName = `${lecturer?.title || ''} ${lecturer?.fname || ''} ${lecturer?.lname || ''}`.trim();
        const termInfo = `${term?.term?.name || ''} - ${term?.school_year || ''}`;
        const startDate = formatDate(term.start_date);
        const endDate = formatDate(term.end_date);

        function getOrdinalSuffix(day) {
            if (day % 100 >= 11 && day % 100 <= 13) {
                return 'th';
            }
            switch (day % 10) {
                case 1:
                    return 'st';
                case 2:
                    return 'nd';
                case 3:
                    return 'rd';
                default:
                    return 'th';
            }
        }

        function formatDate(dateInput) {
            const date = new Date(dateInput);

            const day = date.getDate();
            const dayFormatted = (day < 10 ? '0' : '') + day;
            const ordinal = getOrdinalSuffix(day);

            const monthNames = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            const month = monthNames[date.getMonth()];

            const year = date.getFullYear();

            return `${dayFormatted}${ordinal} ${month} ${year}`;
        }

        const generateScheduleGrid = (schedules) => {
            const timeSlots = Object.keys(TIME_SLOTS);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
            const colors = ['blue-card', 'green-card', 'purple-card', 'orange-card', 'pink-card', 'indigo-card', 'yellow-card', 'red-card'];
            // Define base height for each time slot
            const BASE_SLOT_HEIGHT = 30; // Height for each 30-minute slot
            const GAP_HEIGHT = 4; // Gap between rows

            // Create color mapping for each unique class-subject combination
            const getClassSubjectKey = (schedule) => `${schedule.class_id}-${schedule.prog_subj_id}`;
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
                const timeRangeDisplay = getTimeRangeDisplay(timeSlot);

                if (timeRangeDisplay) {
                    gridHTML += `<div class="grid-row">`;
                    gridHTML += `<div class="time-cell">${timeRangeDisplay}</div>`;

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
                            const spanHeight = span * BASE_SLOT_HEIGHT + (span - 0.5) * GAP_HEIGHT;

                            gridHTML += `
                            <div class="schedule-card ${colorClass}" style="height: ${spanHeight}px;">
                            <div class="subject-name" style="font-size:6px; font-weight: normal;">(${schedule.program_subject?.prog_subj_code})</div>
                            <div class="subject-name">${schedule.program_subject.subject?.name}</div>
                            <div class="class-name">Class: ${schedule.group.prog_code + '(' + schedule.group?.name + ')'}</div>
                            <div class="room-info">Room: ${schedule.room_code}</div>
                            <div class="time-info">
                            <div>${TIME_SLOTS[schedule.start_time]} - ${TIME_SLOTS[schedule.end_time]}</div>
                            </div>
                            </div>
                            `;
                        });

                        gridHTML += `</div>`;
                    });

                    gridHTML += `</div>`;
                }
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
                text-align: end;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .program-title {
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                font-family: 'Times New Roman', Times, serif;
            }
            .program-subtitle {
                margin-bottom: 5px;
                text-align: center;
                font-family: 'Times New Roman', Times, serif;
            }
            .report-title {
                font-size: 16px;
                font-weight: bold;
                font-family: 'Times New Roman', Times, serif;
                margin-bottom: 15px;
            }
            .info-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                margin-top: 20px;
            }
            .info-left, .info-right {
                font-family: 'Times New Roman', Times, serif;
                flex: 1;
            }
            .info-right{
                display:flex;
                flex-direction: column;
                margin-right: 20px;
                text-align: end;
            }
            .schedule-container {
                width: 100%;
                margin-top: 20px;
            }
            .grid-header {
                display: grid;
                grid-template-columns: 80px repeat(5, 1fr);
                gap: 4px;
                margin-bottom: 2px;
            }
            .header-cell {
                background-color: #f3f4f6;
                padding: 6px;
                text-align: center;
                font-weight: bold;
                border: 1px solid #d1d5db;
                font-size: 9px;
                border-radius: 2px

            }
            .grid-row {
                display: grid;
                grid-template-columns: 80px repeat(5, 1fr);
                gap: 4px;
                margin-bottom: 2px;
            }
            .time-cell {
                background-color: #f9fafb;
                padding: 4px;
                text-align: center;
                font-weight: bold;
                border: 1px solid #d1d5db;
                font-size: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 2px

            }
            .day-cell {
                position: relative;
                border: 1px solid #d1d5db;
                border-radius: 2px
            }
            .schedule-card {
                position: absolute;
                left: -1px;
                right: -1px;
                top: 0px;
                margin: 0px 2px;
                padding: 2px;
                border-left: 3px solid;
                border-top: 1px solid #d1d5db;
                border-bottom: 1px solid #d1d5db;
                border-right: 1px solid #d1d5db;
                border-top-right-radius: 6px;
                border-bottom-right-radius: 6px;
                font-size: 5px;
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
                font-size: 8px;
                margin-bottom: 2px;
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
            .signed-by {
                font-weight: bold;
                font-style: italic;
                font-size: 17px;
                font-family: 'Times New Roman', Times, serif;
            }
            .logo{
                width: 200px;
                height: auto;
                margin-right: 10px;

            }
            .thin-text {
                font-weight: 100;
            }
            .footer {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background-color: #f1f1f1;
                padding: 10px 0;
                font-style: italic;
                font-weight: bold;
                font-size: 11px;
                z-index: 100;
                font-family: 'Times New Roman', Times, serif;
            }
            .load-format{
                display: inline-block;
                border-bottom: 1px solid #000;
                width: 50px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img class="logo" src="${logo}" alt="logo"/>
        </div>
        <div class="program-title">${programTitle} <br/> LECTURER'S LOAD</div>
        <div class="program-subtitle">${term.term.name} ${term.school_year}</div>
        <div class="info-section">
            <div class="info-left">
                <strong>Lecturer Name:</strong> <u>${lecturerName}</u><br>
                <strong>Subjects Assigned:</strong> ${subjects.join(', ')}
            </div>
            <div class="info-right">
                <span>No. of Teaching Load:<span class="load-format">${teachingLoad}</span></span>
                <span>No. of Overload:<span class="load-format"></span></span>
                <span>Total No. of Load:<span class="load-format"></span></span>
            </div>
        </div>

        ${generateScheduleGrid(schedules)}
        <p style="margin: 0; font-family: 'Times New Roman', Times, serif;"><i>*Tentative: </i>${startDate} to ${endDate} </p>
        <br/>
        <div ">
            <div style="margin-bottom: 20px" class="info-section">
                <strong>Signed by: Lecturer/Instructor</strong>
                <strong style="margin-right: 35px;">Prepared by: ${preparedBy}</strong>
            </div>
            <br/>
            <br/>
            <br/>
            <div style="margin-bottom: 20px; text-align: center; font-family: 'Times New Roman', Times, serif;">
                <p style="font-size: 12px; margin-bottom: 10px;"><b>Reviewed and approved by:</b></p>
                <div style="display: flex; justify-content: center; gap: 50px; margin-top: 20px;">
                    ${reviewers
                        .map(
                            (reviewer, index) => `
                        <div style="text-align: center;">
                            <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px; height: 20px;"></div>
                            <p style="font-size: 10px; margin: 0; font-weight: bold;">${reviewer}</p>
                        </div>
                    `,
                        )
                        .join('')}
                </div>
            </div>

        </div>
        <div class="footer">NCAT/${preparedBy}/Class Program / ${term.term.name}/ ${term.school_year}</div>
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
                                        <SelectValue placeholder="Select Schedule No *" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Show existing batch numbers from backend */}
                                        {existingBatches.map((batchNo) => (
                                            <SelectItem key={batchNo} value={batchNo.toString()}>
                                                Schedule No: {batchNo}
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
                        {/* Teaching Load Display - below filters, above content */}
                        {schedules.length > 0 && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                    Teaching Load: <span className="font-bold">{totalOccupiedHours.toFixed(1)} hours</span>
                                </span>
                            </div>
                        )}
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
                                                                <div className="font-medium">{schedule.program_subject.subject?.name}</div>
                                                                <div className="text-muted-foreground text-sm">
                                                                    {schedule.program_subject.prog_subj_code}
                                                                </div>
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
                existingBatches={existingBatches}
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

            <ReportDialog 
                isOpen={isReportDialogOpen} 
                onClose={() => setIsReportDialogOpen(false)} 
                onGenerate={handleGenerateReportWithParams}
                availableTerms={getAvailableTermsFromSchedules(schedules)}
            />
        </AppLayout>
    );
}

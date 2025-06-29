import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar as CalendarIcon, FileText, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { formatTime, getTimeRangeDisplay, TIME_SLOTS } from '../../lib/timeFormatter';

const breadcrumbs = [
    {
        title: 'Class Schedule',
        href: '/class-schedule',
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

// Generate color for each unique subject-lecturer combination for class schedule
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

// Create dynamic time slot grid with accurate time blocks (no extra end slots)
function ClassScheduleGrid({ schedules }) {
    // Get all time slots that are needed based on schedules
    const getTimeSlotsFromSchedules = (schedules) => {
        if (!schedules || schedules.length === 0) {
            return Object.keys(TIME_SLOTS); // Default time slots
        }

        const allTimes = new Set();
        schedules.forEach((schedule) => {
            // Add all time slots between start and end time
            const allSlots = Object.keys(TIME_SLOTS);
            const startIndex = allSlots.indexOf(schedule.start_time);
            const endIndex = allSlots.indexOf(schedule.end_time);

            if (startIndex !== -1 && endIndex !== -1) {
                // Add all slots from start to end (excluding end)
                for (let i = startIndex; i < endIndex; i++) {
                    allTimes.add(allSlots[i]);
                }
            }
        });

        // Convert to array and sort
        const timeSlots = Array.from(allTimes).sort();
        return timeSlots.length > 0 ? timeSlots : Object.keys(TIME_SLOTS);
    };

    const timeSlots = getTimeSlotsFromSchedules(schedules);
    const days = DAYS_OF_WEEK;
    const colors = generateColors();

    // Create color mapping for each unique subject-lecturer combination
    const getSubjectLecturerKey = (schedule) => `${schedule.prog_subj_id}-${schedule.lecturer_id}`;
    const uniqueSubjectLecturers = [...new Set(schedules.map(getSubjectLecturerKey))];
    const colorMap = {};
    uniqueSubjectLecturers.forEach((key, index) => {
        colorMap[key] = colors[index % colors.length];
    });

    // Calculate time slot spans for each schedule
    const getTimeSlotSpan = (startTime, endTime) => {
        const allSlots = Object.keys(TIME_SLOTS);
        const startIndex = allSlots.indexOf(startTime);
        const endIndex = allSlots.indexOf(endTime);

        if (startIndex === -1 || endIndex === -1) return { startIndex: 0, span: 1 };

        const span = Math.max(1, endIndex - startIndex);

        // Map to our filtered timeSlots array
        const filteredStartIndex = timeSlots.indexOf(startTime);
        return { startIndex: filteredStartIndex, span };
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

            gridData[day][startSlot].schedules.push({
                ...schedule,
                span: span,
            });

            // Mark all spanned cells as occupied
            for (let i = startIndex; i < Math.min(startIndex + span, timeSlots.length); i++) {
                const slot = timeSlots[i];
                if (gridData[day][slot]) {
                    // Safety check
                    gridData[day][slot].isOccupied = true;
                    if (i > startIndex) {
                        gridData[day][slot].isSpanned = true;
                        gridData[day][slot].spanningSchedule = schedule;
                    }
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

                {/* Generate time slots dynamically */}
                {timeSlots.map((timeSlot, timeIndex) => {
                    const timeRangeDisplay = getTimeRangeDisplay(timeSlot);
                    if(timeRangeDisplay){

                        return (
                            <div key={timeSlot} className="relative mb-1 grid grid-cols-6 gap-1">
                            {/* Time column - show time range with consistent styling */}
                            <div className="rounded bg-gray-100 p-3 text-center text-sm font-semibold">{timeRangeDisplay}</div>

                            {/* Day columns */}
                            {days.map((day, colIndex) => {
                                const cellData = gridData[day][timeSlot];

                                // If this cell is spanned by a schedule from a previous time slot, render completely empty
                                if (cellData && cellData.isSpanned && cellData.schedules.length === 0) {
                                    return (
                                        <div key={`${day}-${timeSlot}`} style={{ minHeight: '60px', background: 'transparent' }}>
                                            {/* Completely empty - no border, no background */}
                                        </div>
                                    );
                                }

                                // If this cell has schedules, render them with proper spanning
                                if (cellData && cellData.schedules.length > 0) {
                                    return (
                                        <div key={`${day}-${timeSlot}`} className="relative" style={{ minHeight: '60px', background: 'transparent' }}>
                                            {cellData.schedules.map((schedule, index) => {
                                                const subjectLecturerKey = getSubjectLecturerKey(schedule);
                                                const colorClass = colorMap[subjectLecturerKey];
                                                const span = schedule.span;

                                                // Calculate the height to span across multiple time slots
                                                const spanHeight = span * 60 + (span - 1) * 4; // 60px per slot + 4px gap between slots

                                                return (
                                                    <div
                                                    key={`${schedule.id}-${index}`}
                                                    className={`absolute rounded border-l-4 p-2 text-xs ${colorClass} z-20 flex flex-col items-center justify-center text-center`}
                                                    style={{
                                                        height: `${spanHeight}px`,
                                                        top: '0px',
                                                        left: '-2px',
                                                        right: '-2px',
                                                        border: 'none',
                                                        borderLeft: '4px solid',
                                                    }}
                                                    >
                                                        <div className="text-xs font-semibold">({schedule.program_subject.prog_subj_code})</div>
                                                        <div className="mb-1 text-sm font-semibold">{schedule.program_subject.subject?.name}</div>
                                                        <div className="mb-1 text-xs opacity-75">
                                                            {schedule.lecturer?.title} {schedule.lecturer?.fname} {schedule.lecturer?.lname}
                                                        </div>
                                                        <div className="mb-1 text-xs opacity-75">Room: {schedule.room_code}</div>
                                                        <div className="text-xs opacity-75">
                                                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                }

                                // Empty cell with border
                                return (
                                    <div key={`${day}-${timeSlot}`} className="relative rounded border" style={{ minHeight: '60px' }}>
                                        {/* Empty cell */}
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

function ReportDialog({ isOpen, onClose, onGenerate, program_type, availableTerms = [] }) {
    const [formData, setFormData] = useState({
        batchNumber: '',
        preparedBy: '',
        selectedTermId: '',
        reviewerCount: 1,
        reviewers: [''],
    });

    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                batchNumber: '',
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
        // For Vocational Foundation Program, both fields are required
        // For other programs, only preparedBy is required
        const basicFieldsValid = program_type === 'Vocational Foundation Program' ? formData.batchNumber && formData.preparedBy : formData.preparedBy;

        const reviewersValid = formData.reviewers.every((reviewer) => reviewer.trim() !== '');
        const termSelected = formData.selectedTermId;

        if (basicFieldsValid && reviewersValid && termSelected) {
            onGenerate(formData);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Generate Report</DialogTitle>
                    <DialogDescription>Please enter the batch number and prepared by information for the report.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {program_type === 'Vocational Foundation Program' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="batchNumber" className="text-right text-sm font-medium">
                                Batch Number
                            </label>
                            <Input
                                id="batchNumber"
                                value={formData.batchNumber}
                                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                className="col-span-3"
                                placeholder="Enter batch number"
                            />
                        </div>
                    )}
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
                        disabled={
                            program_type === 'Vocational Foundation Program'
                                ? !formData.batchNumber || !formData.preparedBy || !formData.selectedTermId || formData.reviewers.some((reviewer) => reviewer.trim() === '')
                                : !formData.preparedBy || !formData.selectedTermId || formData.reviewers.some((reviewer) => reviewer.trim() === '')
                        }
                    >
                        Generate Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function ClassSchedule() {
    const { data } = usePage().props;
    const {
        schedules = [],
        academicCalendars = [],
        groups = [],
        programs = [],
        existingBatches = [],
        statistics = {
            totalSchedules: 0,
            totalActiveClasses: 0,
            totalRoomsInUse: 0,
        },
    } = data;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [logo, setLogo] = useState('');

    const toBase64 = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    toBase64('/PDFLogo.svg').then((base64) => {
        setLogo(base64);
    });

    // Apply filters and fetch schedules
    const applyFilters = React.useCallback(() => {
        if (!selectedBatch || !selectedGroup) {
            return;
        }

        const params = {
            batch_filter: selectedBatch,
            class_filter: selectedGroup,
        };

        setIsLoading(true);
        router.get('/class-schedule', params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    }, [selectedBatch, selectedGroup]);

    // Apply filters when batch or group changes
    useEffect(() => {
        if (selectedBatch && selectedGroup) {
            applyFilters();
        }
    }, [selectedBatch, selectedGroup, applyFilters]);

    // Generate report function
    const handleGenerateReport = () => {
        if (!selectedBatch || !selectedGroup) {
            alert('Please select both batch and group before generating report.');
            return;
        }
        setIsReportDialogOpen(true);
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

    // Handle report generation with parameters
    const handleGenerateReportWithParams = (reportData) => {
        try {
            const selectedGroupData = groups.find((g) => g.id.toString() === selectedGroup);
            
            // Get the selected term data based on the user's selection in the report dialog
            const selectedTermId = parseInt(reportData.selectedTermId);
            const selectedTermData = schedules.find(s => s.academic_calendar?.id === selectedTermId)?.academic_calendar || 
                                   (schedules.length > 0 ? schedules[0].academic_calendar : null);
            
            // Use all schedules from the current batch instead of filtering by term
            // This ensures we include all schedules regardless of which academic term they belong to
            const filteredSchedules = schedules; // All schedules are already filtered by batch in the backend

            if (!filteredSchedules || filteredSchedules.length === 0) {
                throw new Error('No schedules available for the selected term to generate report');
            }

            // Get unique subjects and lecturers for the selected term
            const uniqueSubjects = [...new Set(filteredSchedules.map((s) => s.program_subject.prog_subj_code))];
            const uniqueLecturers = [
                ...new Set(filteredSchedules.map((s) => `${s.lecturer?.title || ''} ${s.lecturer?.fname || ''} ${s.lecturer?.lname || ''}`.trim())),
            ];

            // Create print content with report parameters using filtered schedules
            const printContent = createPrintableReport({
                group: selectedGroupData,
                term: selectedTermData,
                subjects: uniqueSubjects,
                lecturers: uniqueLecturers,
                totalClasses: filteredSchedules.length,
                schedules: filteredSchedules, // Use filtered schedules for the selected term
                batchNumber: reportData.batchNumber,
                preparedBy: reportData.preparedBy,
                reviewers: reportData.reviewers,
            });

            // Create a hidden iframe and print
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.width = '210mm';
            iframe.style.height = '297mm';
            document.body.appendChild(iframe);

            // Write content to iframe
            iframe.contentDocument.open();
            iframe.contentDocument.write(printContent);
            iframe.contentDocument.close();

            // Wait for content to load then print
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                // Clean up after print dialog
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }, 500);
        } catch (error) {
            console.error('Error generating report with parameters:', error);
            alert('An error occurred while generating the report.');
        }
    };

    const createPrintableReport = ({ group, term, subjects, lecturers, totalClasses, schedules, batchNumber, preparedBy, reviewers }) => {
        const groupName = group?.name || '';
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
            // Fixed time slot generation - only include actual time slots that classes occupy
            const getTimeSlotsFromSchedules = (schedules) => {
                if (!schedules || schedules.length === 0) {
                    return [];
                }

                const allTimes = new Set();
                schedules.forEach((schedule) => {
                    // Add all time slots between start and end time
                    const allSlots = Object.keys(TIME_SLOTS);
                    const startIndex = allSlots.indexOf(schedule.start_time);
                    const endIndex = allSlots.indexOf(schedule.end_time);

                    if (startIndex !== -1 && endIndex !== -1) {
                        // Add all slots from start to end (excluding end)
                        for (let i = startIndex; i < endIndex; i++) {
                            allTimes.add(allSlots[i]);
                        }
                    }
                });

                // Convert to array and sort
                const timeSlots = Array.from(allTimes).sort();
                return timeSlots.length > 0 ? timeSlots : [];
            };

            const timeSlots = getTimeSlotsFromSchedules(schedules);
            const days = DAYS_OF_WEEK;
            const colors = ['blue-card', 'green-card', 'purple-card', 'orange-card', 'pink-card'];

            const getSubjectLecturerKey = (schedule) => `${schedule.prog_subj_id}-${schedule.lecturer_id}`;
            const uniqueSubjectLecturers = [...new Set(schedules.map(getSubjectLecturerKey))];
            const colorMap = {};
            uniqueSubjectLecturers.forEach((key, index) => {
                colorMap[key] = colors[index % colors.length];
            });

            // Calculate time slot spans for each schedule using the same logic as main grid
            const getTimeSlotSpan = (startTime, endTime) => {
                const allSlots = Object.keys(TIME_SLOTS);
                const startIndex = allSlots.indexOf(startTime);
                const endIndex = allSlots.indexOf(endTime);

                if (startIndex === -1 || endIndex === -1) return { startIndex: 0, span: 1 };

                const span = Math.max(1, endIndex - startIndex);

                // Map to our filtered timeSlots array
                const filteredStartIndex = timeSlots.indexOf(startTime);
                return { startIndex: filteredStartIndex, span };
            };

            // Create a grid structure to track occupied cells
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

                    gridData[day][startSlot].schedules.push({
                        ...schedule,
                        span: span,
                    });

                    // Mark all spanned cells as occupied
                    for (let i = startIndex; i < Math.min(startIndex + span, timeSlots.length); i++) {
                        const slot = timeSlots[i];
                        if (gridData[day][slot]) {
                            // Safety check
                            gridData[day][slot].isOccupied = true;
                            if (i > startIndex) {
                                gridData[day][slot].isSpanned = true;
                                gridData[day][slot].spanningSchedule = schedule;
                            }
                        }
                    }
                }
            });

            // Build grid HTML for printing with exact same structure as display grid
            let gridHTML = `
                <div class="schedule-container">
                    <div class="grid-header">
                        <div class="header-cell">Time</div>
                        ${days.map((day) => `<div class="header-cell">${day}</div>`).join('')}
                    </div>
                `;

            // Add only the time slots that are actually used
            timeSlots.forEach((timeSlot, timeIndex) => {
                const timeRangeDisplay = getTimeRangeDisplay(timeSlot);

                if(timeRangeDisplay){

                    gridHTML += `<div class="grid-row">`;
                    gridHTML += `<div class="time-cell">${timeRangeDisplay}</div>`;

                    days.forEach((day) => {
                    const cellData = gridData[day][timeSlot];

                    // If this cell is spanned by a schedule from a previous time slot, render empty space
                    if (cellData && cellData.isSpanned && cellData.schedules.length === 0) {
                        gridHTML += `<div class="day-cell" style="height: 30px; border: none; background: transparent;"></div>`;
                        return;
                    }

                    if (cellData && cellData.schedules.length > 0) {
                        const schedule = cellData.schedules[0];
                        const colorClass = colorMap[getSubjectLecturerKey(schedule)];
                        const span = schedule.span;
                        const spanHeight = span * 32 + (span - 1) * 2;

                        gridHTML += `
                            <div class="day-cell occupied" style="height: 30px; position: relative; background: transparent;">
                            <div class="schedule-card ${colorClass}" style="
                            height: ${spanHeight}px;
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            z-index: 10;
                            ">
                            <div class="subject-name" style="font-size:6px; font-weight: normal;">(${schedule.program_subject?.prog_subj_code})</div>
                            <div class="subject-name">${schedule.program_subject.subject?.name}</div>
                            <div class="lecturer-name">${schedule.lecturer?.title || ''} ${schedule.lecturer?.fname || ''} ${schedule.lecturer?.lname || ''}</div>
                            <div class="room-info">Room: ${schedule.room_code}</div>
                            <div class="time-info">
                            <div>${TIME_SLOTS[schedule.start_time]} - ${TIME_SLOTS[schedule.end_time]}</div>
                            </div>
                            </div>
                            </div>
                            `;
                    } else {
                        gridHTML += `<div class="day-cell" style="height: 30px;"></div>`;
                    }
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
            <title>Class Schedule Report</title>
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
                    margin-bottom: 5px;
                    text-align: center;
                    font-family: 'Times New Roman', Times, serif;
                }
                .info-section {
                    font-size: 12px;
                    display: flex;
                    justify-content: space-between;
                    margin-top: 30px;
                    font-family: 'Times New Roman', Times, serif;
                }
                .info-left, .info-right {
                    font-family: 'Times New Roman', Times, serif;
                    flex: 1;
                }
                .info-right{
                    text-align: end;
                    margin-right: 20px;
                }
                .schedule-container {
                    width: 100%;
                    margin-top: 10px;
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
                    border: 1px solid #d1d5db; /* Default border for unoccupied cells */
                    border-radius: 2px;
                }
                .day-cell.occupied {
                    border: none; /* Remove border for cells with schedule cards */
                    background: transparent;
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
                    font-size: 7px;
                    line-height: 1.1;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                    z-index: 0;
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
                .lecturer-name {
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
                .program-desc{
                    font-size: 15px;
                }
                .subtext {
                    font-size: 13px;
                    font-weight: semibold;
                }
                .program-desc, .subtext {
                    text-align: center;
                    font-family: 'Times New Roman', Times, serif;
                    margin: 0;
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
                .logo{
                    width: 200px;
                    height: auto;
                    margin-right: 10px;
                    background-image:
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img class="logo" src="${logo}" alt="logo"/>
            </div>
            <div>
                <h1 class="program-desc">${group.program.type}</h1>
                <p class="subtext">Group/Class Timetable</p>
            </div>
            <div class="info-section">
                <div>
                    <strong>Program: <u>${group.prog_code + ' ' + batchNumber}</u><br></strong>
                    <strong>Subjects: <u>${subjects.join(', ')}</u></strong>
                </div>
                <div style="margin-right: 35px;">
                    <u><strong>Group: ${groupName}</u><br></strong>
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
            <Head title="Class Schedule" />
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
                        <p className="text-muted-foreground mt-2">View class schedules and generate reports</p>
                    </div>
                </div>

                {/* Filters and Schedule Display */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                {/* Primary Filters */}
                                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
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

                                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Select Group/Class *" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {groups.map((group) => (
                                            <SelectItem key={group.id} value={group.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>{group.name} ({group.prog_code})</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Generate Report Button */}
                                {selectedBatch && selectedGroup && (
                                    <Button
                                        onClick={handleGenerateReport}
                                        variant="outline"
                                        className="w-full md:w-auto"
                                        disabled={!schedules.length}
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        Generate Report
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Teaching Load Display - below filters, above content */}
                        {schedules.length > 0 && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                    Total Classes: <span className="font-bold">{schedules.length}</span>
                                </span>
                            </div>
                        )}
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : schedules.length > 0 ? (
                            <ClassScheduleGrid schedules={schedules} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CalendarIcon className="text-muted-foreground mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-semibold">No schedule found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {selectedBatch && selectedGroup
                                        ? 'No classes scheduled for this group and batch.'
                                        : 'Select a batch and group to view the class schedule.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ReportDialog
                isOpen={isReportDialogOpen}
                onClose={() => setIsReportDialogOpen(false)}
                onGenerate={handleGenerateReportWithParams}
                program_type={(() => {
                    const selectedGroupData = groups.find(g => g.id.toString() === selectedGroup);
                    return selectedGroupData?.program?.type || '';
                })()}
                availableTerms={getAvailableTermsFromSchedules(schedules)}
            />
        </AppLayout>
    );
}

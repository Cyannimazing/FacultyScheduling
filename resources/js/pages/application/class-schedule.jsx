import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar as CalendarIcon, FileText, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Class Schedule',
        href: '/class-schedule',
    },
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

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

// Create dynamic time slot grid based on class schedule times
function ClassScheduleGrid({ schedules }) {
    // Get unique time slots from schedules to create dynamic grid
    const getTimeSlotsFromSchedules = (schedules) => {
        if (!schedules || schedules.length === 0) {
            return Object.keys(TIME_SLOTS); // Default time slots
        }

        const allTimes = [];
        schedules.forEach((schedule) => {
            allTimes.push(schedule.start_time, schedule.end_time);
        });

        // Get unique times and sort them
        const uniqueTimes = [...new Set(allTimes)].sort();

        // Find earliest and latest times
        const earliestTime = uniqueTimes[0];
        const latestTime = uniqueTimes[uniqueTimes.length - 1];

        // Generate 30-minute slots from earliest to latest
        const timeSlots = [];
        const allAvailableSlots = Object.keys(TIME_SLOTS);

        const startIndex = allAvailableSlots.findIndex((slot) => slot >= earliestTime);
        const endIndex = allAvailableSlots.findIndex((slot) => slot >= latestTime);

        if (startIndex !== -1) {
            const finalEndIndex = endIndex === -1 ? allAvailableSlots.length : endIndex + 1;
            return allAvailableSlots.slice(startIndex, finalEndIndex);
        }

        return Object.keys(TIME_SLOTS); // Fallback to all slots
    };

    const timeSlots = getTimeSlotsFromSchedules(schedules);
    const days = DAYS_OF_WEEK;
    const colors = generateColors();

    // Create color mapping for each unique subject-lecturer combination
    const getSubjectLecturerKey = (schedule) => `${schedule.subj_code}-${schedule.lecturer_id}`;
    const uniqueSubjectLecturers = [...new Set(schedules.map(getSubjectLecturerKey))];
    const colorMap = {};
    uniqueSubjectLecturers.forEach((key, index) => {
        colorMap[key] = colors[index % colors.length];
    });

    // Calculate time slot spans for each schedule (same as faculty-schedule)
    const getTimeSlotSpan = (startTime, endTime) => {
        const startIndex = timeSlots.indexOf(startTime);
        const endIndex = timeSlots.findIndex((slot) => slot >= endTime);

        if (startIndex === -1) return { startIndex: 0, span: 1 };

        let span;
        if (endIndex === -1) {
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
                    return (
                        <div key={timeSlot} className="relative mb-1 grid grid-cols-6 gap-1">
                            {/* Time column */}
                            <div className="rounded border bg-gray-50 p-3 text-center text-sm font-medium">
                                <div>{formatTime(timeSlot)}</div>
                            </div>

                            {/* Day columns */}
                            {days.map((day, colIndex) => {
                                const cellData = gridData[day][timeSlot];

                                // If this cell is spanned by a schedule from a previous time slot, render completely empty
                                if (cellData.isSpanned && cellData.schedules.length === 0) {
                                    return (
                                        <div key={`${day}-${timeSlot}`} style={{ minHeight: '60px', background: 'transparent' }}>
                                            {/* Completely empty - no border, no background */}
                                        </div>
                                    );
                                }

                                // If this cell has schedules, render completely without any background
                                if (cellData.schedules.length > 0) {
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
                                                        <div className="mb-1 text-sm font-semibold">
                                                            {schedule.subject?.name || schedule.subj_code}
                                                        </div>
                                                        <div className="mb-1 text-xs opacity-75">
                                                            {schedule.lecturer?.title} {schedule.lecturer?.fname} {schedule.lecturer?.lname}
                                                        </div>
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
                })}
            </div>
        </div>
    );
}

export default function ClassSchedule() {
    const { data } = usePage().props;
    const { schedules = [], academicCalendars = [], groups = [] } = data;

    const [isLoading, setIsLoading] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');

    // Apply filters and fetch schedules
    const applyFilters = React.useCallback(() => {
        if (!selectedTerm || !selectedGroup) {
            return;
        }

        const params = {
            sy_term_id: selectedTerm,
            class_id: selectedGroup,
        };

        setIsLoading(true);
        router.get('/class-schedule', params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    }, [selectedTerm, selectedGroup]);

    // Apply filters when term or group changes
    useEffect(() => {
        if (selectedTerm && selectedGroup) {
            applyFilters();
        }
    }, [selectedTerm, selectedGroup, applyFilters]);

    // Generate report function
    const handleGenerateReport = () => {
        if (!selectedTerm || !selectedGroup) {
            alert('Please select both term and group before generating report.');
            return;
        }

        const selectedGroupData = groups.find((g) => g.id.toString() === selectedGroup);
        const selectedTermData = academicCalendars.find((c) => c.id.toString() === selectedTerm);

        // Get unique subjects and lecturers
        const uniqueSubjects = [...new Set(schedules.map((s) => s.subject?.name || s.subj_code))];
        const uniqueLecturers = [
            ...new Set(schedules.map((s) => `${s.lecturer?.title || ''} ${s.lecturer?.fname || ''} ${s.lecturer?.lname || ''}`.trim())),
        ];

        // Create print content
        const printContent = createPrintableReport({
            group: selectedGroupData,
            term: selectedTermData,
            subjects: uniqueSubjects,
            lecturers: uniqueLecturers,
            totalClasses: schedules.length,
            schedules: schedules,
        });

        // Open print dialog
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    const createPrintableReport = ({ group, term, subjects, lecturers, totalClasses, schedules }) => {
        const groupName = group?.name || '';
        const startDate = formatDate(term.start_date);
        const endDate = formatDate(term.end_date);

        function getOrdinalSuffix(day) {
            if (day % 100 >= 11 && day % 100 <= 13) {
                return "th";
            }
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        }

        function formatDate(dateInput) {
            const date = new Date(dateInput);

            const day = date.getDate();
            const dayFormatted = (day < 10 ? "0" : "") + day;
            const ordinal = getOrdinalSuffix(day);

            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const month = monthNames[date.getMonth()];

            const year = date.getFullYear();

            return `${dayFormatted}${ordinal} ${month} ${year}`;
        }

        console.log(group);
        const generateScheduleGrid = (schedules) => {
            // Use the same dynamic time slot logic as the main grid
            const getTimeSlotsFromSchedules = (schedules) => {
                if (!schedules || schedules.length === 0) {
                    return [];
                }

                console.log(term)
                const allTimes = [];
                schedules.forEach((schedule) => {
                    allTimes.push(schedule.start_time, schedule.end_time);
                });

                // Get unique times and sort them
                const uniqueTimes = [...new Set(allTimes)].sort();

                // Find earliest and latest times
                const earliestTime = uniqueTimes[0];
                const latestTime = uniqueTimes[uniqueTimes.length - 1];

                // Generate 30-minute slots from earliest to latest
                const allAvailableSlots = Object.keys(TIME_SLOTS);

                const startIndex = allAvailableSlots.findIndex((slot) => slot >= earliestTime);
                const endIndex = allAvailableSlots.findIndex((slot) => slot >= latestTime);

                if (startIndex !== -1) {
                    const finalEndIndex = endIndex === -1 ? allAvailableSlots.length : endIndex + 1;
                    return allAvailableSlots.slice(startIndex, finalEndIndex);
                }

                return [];
            };

            const timeSlots = getTimeSlotsFromSchedules(schedules);
            const days = DAYS_OF_WEEK;
            const colors = ['blue-card', 'green-card', 'purple-card', 'orange-card', 'pink-card'];

            const getSubjectLecturerKey = (schedule) => `${schedule.subj_code}-${schedule.lecturer_id}`;
            const uniqueSubjectLecturers = [...new Set(schedules.map(getSubjectLecturerKey))];
            const colorMap = {};
            uniqueSubjectLecturers.forEach((key, index) => {
                colorMap[key] = colors[index % colors.length];
            });

            // Calculate time slot spans for each schedule (exact same logic as main grid)
            const getTimeSlotSpan = (startTime, endTime) => {
                const startIndex = timeSlots.indexOf(startTime);
                const endIndex = timeSlots.findIndex((slot) => slot >= endTime);

                if (startIndex === -1) return { startIndex: 0, span: 1 };

                let span;
                if (endIndex === -1) {
                    span = timeSlots.length - startIndex;
                } else {
                    span = Math.max(1, endIndex - startIndex);
                }

                return { startIndex, span };
            };

            // Create a grid structure to track occupied cells (same as main grid)
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

            // Place schedules in the grid (same logic as main grid)
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
                        gridData[day][slot].isOccupied = true;
                        if (i > startIndex) {
                            gridData[day][slot].isSpanned = true;
                            gridData[day][slot].spanningSchedule = schedule;
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
                gridHTML += `<div class="grid-row">`;
                gridHTML += `<div class="time-cell">${TIME_SLOTS[timeSlot]}</div>`;

                days.forEach((day) => {
                    const cellData = gridData[day][timeSlot];

                    // If this cell is spanned by a schedule from a previous time slot, render empty space
                    if (cellData.isSpanned && cellData.schedules.length === 0) {
                        gridHTML += `<div class="day-cell" style="height: 30px; border: none;"></div>`;
                        return;
                    }

                    if (cellData.schedules.length > 0) {
                        const schedule = cellData.schedules[0];
                        const colorClass = colorMap[getSubjectLecturerKey(schedule)];
                        const span = schedule.span;
                        const spanHeight = span * 32 + (span - 1) * 2;

                        gridHTML += `
                        <div class="day-cell occupied" style="height: 30px; position: relative;">
                            <div class="schedule-card ${colorClass}" style="
                                height: ${spanHeight}px;
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                z-index: 10;
                            ">
                                <div class="subject-name">${schedule.subject?.name || schedule.subj_code}</div>
                                <div class="lecturer-name">${schedule.lecturer?.title || ''} ${schedule.lecturer?.fname || ''} ${schedule.lecturer?.lname || ''}</div>
                                <div class="room-info">Room: ${schedule.room_code}</div>
                                <div class="time-info">
                                    <div>${TIME_SLOTS[schedule.start_time]}</div>
                                    <div>${TIME_SLOTS[schedule.end_time]}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    } else {
                        gridHTML += `<div class="day-cell" style="height: 30px;"></div>`;
                    }
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
                    font-size: 8px;
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
                    margin-bottom: 1px;
                    font-size: 8px;
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
                    width: 50px;
                    height: auto;
                    margin-right: 10px;

                }
            </style>
        </head>
        <body>
            <div class="header">
                <img class="logo" src="data:image/png;base64,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" alt="logo"/>
            </div>
            <div>
                <h1 class="program-desc">${group.program.description}</h1>
                <p class="subtext">Group/Class Timetable</p>
            </div>
            <div class="info-section">
                <div>
                    <strong>Program: ${group.prog_code}<br></strong>
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
                    <strong>Signed by: Skill Instructor</strong>
                    <strong style="margin-right: 35px;">Prepared by: GFP</strong>
                </div>
                <br/>
                <br/>
                <br/>
                <p style="font-size: 12px; margin-bottom: auto; text-align: center; font-family: 'Times New Roman', Times, serif;"><b>Reviewed and approved by:</b></p>

            </div>
            <div class="footer">NCAT/GFP/Class Program / ${term.term.name}/ ${term.school_year}</div>
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
                                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                                    <SelectTrigger className="w-full md:w-[280px]">
                                        <SelectValue placeholder="Select Academic Term *" />
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

                                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Select Group/Class *" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {groups.map((group) => (
                                            <SelectItem key={group.id} value={group.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>
                                                        {group.name} ({group.program?.name || group.prog_code})
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Generate Report Button */}
                                {selectedTerm && selectedGroup && (
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
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : schedules.length > 0 ? (
                            <ClassScheduleGrid schedules={schedules} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CalendarIcon className="text-muted-foreground mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-semibold">No schedule found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {selectedTerm && selectedGroup
                                        ? 'No classes scheduled for this group and term.'
                                        : 'Select a term and group to view the class schedule.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

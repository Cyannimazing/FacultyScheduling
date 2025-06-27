import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CalendarDays,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit,
    GraduationCap,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Calendar',
        href: '/calendar',
    },
];


var termOptions = [];
var programOptions = [];

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}

function CalendarDialog({ isOpen, onClose, calendar = null, onSave, errors = null }) {

    const [formData, setFormData] = useState({
        term_id: '',
        term_name: '',
        school_year: '',
        start_date: '',
        end_date: '',
        prog_id: '',
    });

    React.useEffect(() => {
        if (isOpen) {
            if (calendar) {
                // Only populate form data when editing (calendar exists)
                setFormData({
                    term_id: calendar.term_id ? calendar.term_id.toString() : '',
                    term_name: calendar.term?.name || '',
                    school_year: calendar.school_year || '',
                    start_date: calendar.start_date ? calendar.start_date.split('T')[0] : '',
                    end_date: calendar.end_date ? calendar.end_date.split('T')[0] : '',
                    prog_id: calendar.prog_id ? calendar.prog_id.toString() : '',
                });
            } else {
                // Clear form data when adding new calendar
                setFormData({ term_id:'', term_name: '', school_year: '', start_date: '', end_date: '', prog_id: '' });
            }
        }
    }, [calendar, isOpen]);

    const handleSave = () => {
        if (formData.term_id && formData.school_year && formData.start_date && formData.end_date && formData.prog_id) {
            onSave(formData);
        }
    };

    const currentYear = new Date().getFullYear();
    const schoolYearOptions = [
        `${currentYear - 1}-${currentYear}`,
        `${currentYear}-${currentYear + 1}`,
        `${currentYear + 1}-${currentYear + 2}`,
        `${currentYear + 2}-${currentYear + 3}`,
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{calendar ? 'Edit Calendar' : 'Add New Calendar'}</DialogTitle>
                    <DialogDescription>{calendar ? 'Update the calendar details below.' : 'Create a new academic calendar entry.'}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="term" className="text-right text-sm font-medium">
                            Term
                        </label>
                        <Select value={formData.term_id} onValueChange={(value) => setFormData({ ...formData, term_id: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a term" />
                            </SelectTrigger>
                            <SelectContent>
                                {termOptions.map((term) => (
                                    <SelectItem key={term.id} value={term.id.toString()}>
                                        {term.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="school_year" className="text-right text-sm font-medium">
                            School Year
                        </label>
                        <Select value={formData.school_year} onValueChange={(value) => setFormData({ ...formData, school_year: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select school year" />
                            </SelectTrigger>
                            <SelectContent>
                                {schoolYearOptions.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="program" className="text-right text-sm font-medium">
                            Program
                        </label>
                        <Select value={formData.prog_id} onValueChange={(value) => setFormData({ ...formData, prog_id: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                                {programOptions.map((program) => (
                                    <SelectItem key={program.id} value={program.id.toString()}>
                                        {program.code} - {program.description}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="start_date" className="text-right text-sm font-medium">
                            Start Date
                        </label>
                        <Input
                            id="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={(e) =>
                            setFormData({ ...formData, start_date: e.target.value })
                            }
                            className="col-span-3"
                            min={formData.school_year.split('-').map(part => part.trim())[0] + "-01-01"}
                            max={formData.school_year.split('-').map(part => part.trim())[1] + "-12-31"}
                        />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="end_date" className="text-right text-sm font-medium">
                            End Date
                        </label>
                        <Input
                            id="end_date"
                            type="date"
                            value={formData.end_date}
                            onChange={(e) =>
                            setFormData({ ...formData, end_date: e.target.value })
                            }
                            className="col-span-3"
                            min={formData.school_year.split('-').map(part => part.trim())[0] + "-01-01"}
                            max={formData.school_year.split('-').map(part => part.trim())[1] + "-12-31"}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.term_id || !formData.school_year || !formData.start_date || !formData.end_date || !formData.prog_id}>
                        {calendar ? 'Update' : 'Create'} Calendar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Calendar() {
    const { data } = usePage().props
    const [isLoading, setIsLoading] = useState(false);
    const [seachCalendar, setSearchCalendar] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCalendar, setEditingCalendar] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [calendarToDelete, setCalendarToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [calendarErrors, setCalendarErrors] = useState(null);
    termOptions = data.terms
    programOptions = data.programs
    const itemsPerPage = data.academicCalendars.per_page;

    console.log(data.academicCalendars.data[0])

    const getDateRangeStatus = (startDate, endDate) => {
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (today < start) {
            return { status: 'upcoming', label: 'Upcoming' };
        } else if (today >= start && today <= end) {
            return { status: 'active', label: 'Active' };
        } else {
            return { status: 'completed', label: 'Completed' };
        }
    };

    const totalPages = data.academicCalendars.last_page;
    const paginatedData = data.academicCalendars.data;

    const handlePageChange = (page) => {
        setIsLoading(true);
        router.get(
            '/calendar',
            { page },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleSearch = (e) => {
        setSearchCalendar(e.target.value);
        setIsLoading(true);
        router.get(
            '/calendar',
            { search: e.target.value, program: selectedProgram === 'all' ? '' : selectedProgram, page: 1 },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleProgramFilter = (programId) => {
        setSelectedProgram(programId);
        setIsLoading(true);
        router.get(
            '/calendar',
            { search: seachCalendar, program: programId === 'all' ? '' : programId, page: 1 },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleAddCalendar = () => {
        setEditingCalendar(null);
        setCalendarErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleEditCalendar = (calendar) => {
        setEditingCalendar(calendar);
        setCalendarErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleSaveCalendar = (formData) => {
        setCalendarErrors(null); // Clear previous errors

        if (editingCalendar) {
            router.put(`/calendar/${editingCalendar.id}`, formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setCalendarErrors(null);
                },
                onError: (errors) => {
                    console.error('Error updating calendar:', errors);
                    setCalendarErrors(errors);
                },
            });
        } else {
            router.post('/calendar', formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setCalendarErrors(null);
                },
                onError: (errors) => {
                    console.error('Error creating calendar:', errors);
                    setCalendarErrors(errors);
                },
            });
        }
    };

    const handleDeleteCalendar = (calendar) => {
        setCalendarToDelete(calendar);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteCalendar = () => {
        if (calendarToDelete) {
            setIsDeleting(true);
            router.delete(`/calendar/${calendarToDelete.id}`, {
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Academic Calendar</h1>
                        <p className="text-muted-foreground mt-2">Manage your academic calendar and term schedules</p>
                    </div>
                    <Button onClick={handleAddCalendar} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Calendar
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
                                <div className="relative flex-1 md:max-w-sm">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="Search calendars..."
                                        value={seachCalendar}
                                        onChange={handleSearch}
                                        className="pl-9"
                                    />
                                </div>
                                <div className="md:max-w-xs">
                                    <Select value={selectedProgram} onValueChange={handleProgramFilter}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filter by Program" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Programs</SelectItem>
                                            {programOptions.map((program) => (
                                                <SelectItem key={program.id} value={program.id.toString()}>
                                                    {program.code} - {program.description}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {data.academicCalendars.total} calendars
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
                                            <TableHead className="w-[80px]">ID</TableHead>
                                            <TableHead>Term & Year</TableHead>
                                            <TableHead>Program</TableHead>
                                            <TableHead className="text-center">Date Range</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                            <TableHead className="text-center">Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.map((calendar) => {
                                            console.log(calendar)
                                            const dateStatus = getDateRangeStatus(calendar.start_date, calendar.end_date);
                                            return (
                                                <TableRow key={calendar.id} className="hover:bg-muted/50">
                                                    <TableCell>
                                                        <span className="font-medium">{calendar.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <GraduationCap className="text-muted-foreground h-4 w-4" />
                                                                <span className="font-medium">{calendar.term.name}</span>
                                                            </div>
                                                            <div className="text-muted-foreground text-sm">{calendar.school_year}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="font-medium">{calendar.program?.code || 'N/A'}</div>
                                                            <div className="text-muted-foreground text-sm">{calendar.program?.description || 'No description'}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-center gap-1 text-sm">
                                                                <CalendarDays className="text-muted-foreground h-4 w-4" />
                                                                <span>{formatDate(calendar.start_date)}</span>
                                                            </div>
                                                            <div className="text-muted-foreground text-xs">to {formatDate(calendar.end_date)}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge
                                                            variant={dateStatus.status === 'active' ? 'default' : 'secondary'}
                                                            className={
                                                                dateStatus.status === 'active'
                                                                    ? 'bg-green-500 hover:bg-green-600'
                                                                    : dateStatus.status === 'upcoming'
                                                                      ? 'bg-blue-500 hover:bg-blue-600'
                                                                      : 'bg-gray-500 hover:bg-gray-600'
                                                            }
                                                        >
                                                            {dateStatus.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{formatDateTime(calendar.updated_at)}</span>
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
                                                                <DropdownMenuItem onClick={() => handleEditCalendar(calendar)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Calendar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    variant="destructive"
                                                                    onClick={() => handleDeleteCalendar(calendar)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete Calendar
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
                                <h3 className="mb-2 text-lg font-semibold">No calendars found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {seachCalendar ? 'Try adjusting your search criteria.' : 'Get started by creating your first academic calendar.'}
                                </p>
                                {!seachCalendar && (
                                    <Button onClick={handleAddCalendar}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Calendar
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!isLoading && paginatedData.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Page {data.academicCalendars.current_page} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(data.academicCalendars.current_page - 1)} disabled={data.academicCalendars.current_page === 1}>
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(data.academicCalendars.current_page + 1)}
                                disabled={data.academicCalendars.current_page === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <CalendarDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} calendar={editingCalendar} onSave={handleSaveCalendar} errors={calendarErrors} />

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Calendar</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{calendarToDelete?.term.name} - {calendarToDelete?.school_year}"? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteCalendar} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete Calendar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}

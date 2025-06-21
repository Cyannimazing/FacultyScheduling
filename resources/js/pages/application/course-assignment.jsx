import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { BookOpen, ChevronLeft, ChevronRight, Code, GripVertical, Plus, Search, Trash2, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Course Assignment',
        href: '/course-assignment',
    },
];

// Function to get available year levels based on program's year_length
const getAvailableYearLevels = (yearLength) => {
    if (!yearLength) return [];
    const levels = [];
    for (let i = 1; i <= yearLength; i++) {
        levels.push({ id: i, name: `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Year` });
    }
    return levels;
};

// Subject item component for drag and drop
function SubjectItem({ subject, onDragStart }) {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, subject)}
            className="border-border bg-card hover:border-border/80 flex cursor-move items-center justify-between rounded-lg border p-3 shadow-sm transition-all hover:shadow-md"
        >
            <div className="flex items-center gap-3">
                <GripVertical className="text-muted-foreground h-4 w-4" />
                <div className="flex items-center gap-2">
                    <Code className="text-muted-foreground h-4 w-4" />
                    <span className="font-mono text-sm font-medium">{subject.id}</span>
                </div>
                <div>
                    <div className="text-sm font-medium">{subject.name}</div>
                    <div className="text-muted-foreground text-xs">
                        {subject.unit} unit{subject.unit !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>
            <Badge
                variant={subject.is_general_education ? 'default' : 'secondary'}
                className={subject.is_general_education ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
            >
                {subject.is_general_education ? 'GE' : 'Major'}
            </Badge>
        </div>
    );
}

// Program drop zone component
function ProgramDropZone({ program, assignments, onDrop, onRemoveAssignment, terms }) {
    const [dragOver, setDragOver] = useState(false);
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedTerm, setSelectedTerm] = useState('all');

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        onDrop(e, program);
    };

    const programAssignments = assignments.filter((a) => a.prog_code === program.code);

    // Apply frontend filtering based on year and term
    const filteredAssignments = programAssignments.filter((assignment) => {
        const yearMatch = selectedYear === 'all' || assignment.year_level.toString() === selectedYear;
        const termMatch = selectedTerm === 'all' || assignment.term_id.toString() === selectedTerm;
        return yearMatch && termMatch;
    });

    // Group filtered assignments by year and term
    const groupedAssignments = filteredAssignments.reduce((acc, assignment) => {
        const key = `${assignment.year_level}-${assignment.term_id}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(assignment);
        return acc;
    }, {});

    return (
        <Card className={`transition-all ${dragOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30' : ''}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{program.description}</CardTitle>
                        <p className="text-muted-foreground text-sm">{program.code}</p>
                    </div>
                    <Badge variant="outline">{programAssignments.length} subjects</Badge>
                </div>

                {/* Program-specific filters */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {getAvailableYearLevels(program.number_of_year).map((year) => (
                                <SelectItem key={year.id} value={year.id.toString()}>
                                    {year.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Term" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Terms</SelectItem>
                            {terms.map((term) => (
                                <SelectItem key={term.id} value={term.id.toString()}>
                                    {term.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`min-h-[200px] space-y-4 ${dragOver ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
            >
                {Object.keys(groupedAssignments).length > 0 ? (
                    Object.entries(groupedAssignments)
                        .sort(([a], [b]) => {
                            const [aYear, aTerm] = a.split('-').map(Number);
                            const [bYear, bTerm] = b.split('-').map(Number);
                            if (aYear !== bYear) return aYear - bYear;
                            return aTerm - bTerm;
                        })
                        .map(([key, yearTermAssignments]) => {
                            // Get the first assignment to extract year and term display text
                            const firstAssignment = yearTermAssignments[0];
                            const yearName = `${firstAssignment.year_level}${firstAssignment.year_level === 1 ? 'st' : firstAssignment.year_level === 2 ? 'nd' : firstAssignment.year_level === 3 ? 'rd' : 'th'} Year`;
                            const term = terms.find(t => t.id === firstAssignment.term_id);
                            const termName = term ? term.name : `Term ${firstAssignment.term_id}`;

                            return (
                                <div key={key} className="space-y-2">
                                    <h4 className="text-foreground text-sm font-medium">
                                        {yearName}, {termName}
                                    </h4>
                                    <div className="space-y-1">
                                        {yearTermAssignments.map((assignment) => {
                                            const prog_subj = assignment;
                                            return prog_subj ? (
                                                <div
                                                    key={assignment.id}
                                                    className="border-border bg-muted flex items-center justify-between rounded-md border p-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Code className="text-muted-foreground h-3 w-3" />
                                                        <span className="font-mono text-xs">{prog_subj.prog_subj_code}</span>
                                                        <span className="text-xs">{prog_subj.subject.name}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onRemoveAssignment(assignment)}
                                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            );
                        })
                ) : (
                    <div className="border-border text-muted-foreground flex h-32 items-center justify-center rounded-lg border-2 border-dashed text-sm">
                        Drop subjects here to assign to {program.description}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Drag and drop assignment dialog
function DropAssignmentDialog({ isOpen, onClose, onSave, subject, program, terms, errors }) {
    const [formData, setFormData] = useState({
        code: '',
        year_level: '',
        term_id: '',
    });

    const handleSave = () => {
        if (formData.year_level && formData.term_id) {
            onSave(formData);
            // Don't close dialog here - let parent handle closing on success
        }
    };

    const handleCancel = () => {
        setFormData({ year_level: '', term_id: '' });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Assign Subject to Program</DialogTitle>
                    <DialogDescription>
                        Assign{' '}
                        <strong>
                            {subject?.code} - {subject?.name}
                        </strong>{' '}
                        to <strong>{program?.department}</strong>
                    </DialogDescription>
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
                        <Label htmlFor="subject" className="text-right text-sm font-medium">
                            Subject Code
                        </Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="col-span-3"
                            placeholder="Enter subject code"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="year" className="text-right text-sm font-medium">
                            Year Level
                        </Label>
                        <Select value={formData.year_level} onValueChange={(value) => setFormData({ ...formData, year_level: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select year level" />
                            </SelectTrigger>
                            <SelectContent>
                                {getAvailableYearLevels(program?.number_of_year).map((year) => (
                                    <SelectItem key={year.id} value={year.id}>
                                        {year.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="term" className="text-right text-sm font-medium">
                            Term
                        </Label>
                        <Select value={formData.term_id} onValueChange={(value) => setFormData({ ...formData, term_id: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                            <SelectContent>
                                {terms.map((term) => (
                                    <SelectItem key={term.id} value={term.id}>
                                        {term.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.year_level || !formData.term_id}>
                        Assign Subject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Assignment dialog for manual entry
function AssignmentDialog({ isOpen, onClose, onSave, programs, subjects, terms, errors = null }) {
    const [formData, setFormData] = useState({
        prog_subj_code: '',
        program_id: '',
        subject_id: '',
        year_level: '',
        term_id: '',
    });

    // Get selected program to determine available year levels
    const selectedProgram = programs.find((p) => p.id == formData.program_id);
    const availableYearLevels = getAvailableYearLevels(selectedProgram?.number_of_year);

    // Reset year level when program changes
    const handleProgramChange = (value) => {
        setFormData({ ...formData, program_id: value, year_level: '' });
    };

    const handleSave = () => {
        if (formData.prog_subj_code && formData.program_id && formData.subject_id && formData.year_level && formData.term_id) {
            onSave(formData);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Course Assignment</DialogTitle>
                    <DialogDescription>Assign a subject to a specific program and academic term.</DialogDescription>
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
                        <Label htmlFor="program" className="text-right text-sm font-medium">
                            Program
                        </Label>
                        <Select value={formData.program_id} onValueChange={handleProgramChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select program" />
                            </SelectTrigger>
                            <SelectContent>
                                {programs.map((program) => (
                                    <SelectItem key={program.id} value={program.id}>
                                        {program.code} - {program.description}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right text-sm font-medium">
                            Subject
                        </Label>
                        <Select value={formData.subject_id} onValueChange={(value) => setFormData({ ...formData, subject_id: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right text-sm font-medium">
                            Subject Code
                        </Label>
                        <Input
                            id="prog_subj_code"
                            value={formData.prog_subj_code}
                            onChange={(e) => setFormData({ ...formData, prog_subj_code: e.target.value })}
                            className="col-span-3"
                            placeholder="Enter subject code"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="year" className="text-right text-sm font-medium">
                            Year Level
                        </Label>
                        <Select value={formData.year_level} onValueChange={(value) => setFormData({ ...formData, year_level: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select year level" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableYearLevels.map((year) => (
                                    <SelectItem key={year.id} value={year.id}>
                                        {year.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="term" className="text-right text-sm font-medium">
                            Term
                        </Label>
                        <Select value={formData.term_id} onValueChange={(value) => setFormData({ ...formData, term_id: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                            <SelectContent>
                                {terms.map((term) => (
                                    <SelectItem key={term.id} value={term.id}>
                                        {term.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.program_id || !formData.subject_id || !formData.year_level || !formData.term_id}>
                        Add Assignment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function CourseAssignment() {
    const { data } = usePage().props;
    const { programSubjects: assignments = [], programs = [], subjects = [], terms = [], totalAssignment, totalProgramWithSubject, totalSubjectAssigned } = data;

    // Initialize filter states from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const programFilterFromUrl = urlParams.get('programFilter');

    // Find program ID from code if exists
    const initialProgram = programFilterFromUrl ?
        programs.find(p => p.code === programFilterFromUrl)?.id || 'all' : 'all';

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProgram, setSelectedProgram] = useState(initialProgram);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [draggedSubject, setDraggedSubject] = useState(null);
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [showDropDialog, setShowDropDialog] = useState(false);
    const [dropTarget, setDropTarget] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [assignmentErrors, setAssignmentErrors] = useState(null);
    const [deleteErrors, setDeleteErrors] = useState(null);

    // Pagination settings
    const itemsPerPage = 5;
    const totalPages = Math.ceil(assignments.length / itemsPerPage);
    const paginatedAssignments = assignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination when dialog opens
    const handleViewAllClick = () => {
        setCurrentPage(1);
        setIsDialogOpen(true);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Filter subjects based on search
    const filteredSubjects = subjects.filter(
        (subject) => subject.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Filter programs based on selection
    const filteredPrograms = selectedProgram === 'all' ? programs : programs.filter((p) => p.id == selectedProgram);

    // Handle program filter change - only for program selection
    const handleProgramFilterChange = (value) => {
        setSelectedProgram(value);
        const params = new URLSearchParams(window.location.search);

        if (value === 'all') {
            params.delete('programFilter');
        } else {
            const programCode = programs.find(p => p.id == value)?.code || '';
            params.set('programFilter', programCode);
        }

        // Update the URL for program filter only
        router.get(`/course-assignment?${params.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleDragStart = (e, subject) => {
        setDraggedSubject(subject);
        e.dataTransfer.setData('text/plain', JSON.stringify(subject));
    };

    const handleDrop = (e, program) => {
        if (!draggedSubject) return;

        // Store the drop target and show dialog to select year/term
        setDropTarget(program);
        setShowDropDialog(true);
    };

    const handleDropAssignment = (yearTerm) => {
        if (!draggedSubject || !dropTarget) return;
        // Check if assignment already exists
        const existingAssignment = assignments.find(
            (a) =>
                a.prog_subj_code === yearTerm.code &&
                a.prog_code === dropTarget.code &&
                a.subj_id === draggedSubject.code &&
                a.year_level === parseInt(yearTerm.year_level) &&
                a.term_id === parseInt(yearTerm.term_id),
        );

        if (!existingAssignment) {
            // Clear any previous errors
            setAssignmentErrors(null);

            // Create new assignment using Inertia router
            router.post('/course-assignment', {
                prog_subj_code: yearTerm.code,
                prog_code: dropTarget.code,
                subj_id: draggedSubject.id,
                year_level: parseInt(yearTerm.year_level),
                term_id: parseInt(yearTerm.term_id)
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setAssignmentErrors(null);
                    // Reset state
                    setDraggedSubject(null);
                    setDropTarget(null);
                    setShowDropDialog(false);
                },
                onError: (errors) => {
                    console.error('Error creating assignment:', errors);
                    setAssignmentErrors(errors);
                }
            });
        } else {
            setDraggedSubject(null);
            setDropTarget(null);
            setShowDropDialog(false);
        }
    };

    const handleRemoveAssignment = (assignment) => {
        setAssignmentToDelete(assignment);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteAssignment = () => {
        if (assignmentToDelete) {
            // Clear any previous errors
            setDeleteErrors(null);

            // Delete assignment using Inertia router
            router.delete(`/course-assignment/${assignmentToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteErrors(null);
                    setDeleteDialogOpen(false);
                    setAssignmentToDelete(null);
                },
                onError: (errors) => {
                    setDeleteErrors(errors);
                }
            });
        } else {
            setDeleteDialogOpen(false);
            setAssignmentToDelete(null);
        }
    };

    const handleAddAssignment = (formData) => {
        setAssignmentErrors(null);

        // Get the selected program and subject to send codes instead of IDs
        const selectedProgram = programs.find(p => p.id == formData.program_id);
        const selectedSubject = subjects.find(s => s.id == formData.subject_id);

        // Create new assignment using Inertia router
        router.post('/course-assignment', {
            prog_subj_code: formData.prog_subj_code,
            prog_code: selectedProgram.code,
            subj_id: selectedSubject.id,
            year_level: parseInt(formData.year_level),
            term_id: parseInt(formData.term_id)
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAssignmentErrors(null);
                setShowAssignmentForm(false);
            },
            onError: (errors) => {
                console.error('Error creating manual assignment:', errors);
                setAssignmentErrors(errors);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course Assignment" />
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Course Assignment</h1>
                        <p className="text-muted-foreground mt-2">Assign subjects to programs and organize curriculum by year and term</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setShowAssignmentForm(true)} variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Manual Assignment
                        </Button>
                        <Button onClick={handleViewAllClick}>
                            <Users className="mr-2 h-4 w-4" />
                            View All Assignments
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                            <BookOpen className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalAssignment}</div>
                            <p className="text-muted-foreground text-xs">Active course assignments</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Programs with Subjects</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProgramWithSubject}</div>
                            <p className="text-muted-foreground text-xs">Out of {programs.length} total programs</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Subjects Assigned</CardTitle>
                            <Code className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalSubjectAssigned}</div>
                            <p className="text-muted-foreground text-xs">Out of {subjects.length} total subjects</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Available Subjects Panel */}
                    <div className="lg:col-span-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Available Subjects
                                </CardTitle>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            placeholder="Search subjects..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-[600px] space-y-2 overflow-y-auto">
                                    {filteredSubjects.length > 0 ? (
                                        filteredSubjects.map((subject) => (
                                            <SubjectItem key={subject.id} subject={subject} onDragStart={handleDragStart} />
                                        ))
                                    ) : (
                                        <div className="text-muted-foreground py-8 text-center">No subjects found</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Programs Panel */}
                    <div className="lg:col-span-8">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <h3 className="text-lg font-semibold">Programs</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Select value={selectedProgram} onValueChange={handleProgramFilterChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select program" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Programs</SelectItem>
                                            {programs.map((program) => (
                                                <SelectItem key={program.id} value={program.id}>
                                                    {program.code} - {program.description}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {filteredPrograms.map((program) => (
                                    <ProgramDropZone
                                        key={program.id}
                                        program={program}
                                        assignments={assignments}
                                        onDrop={handleDrop}
                                        onRemoveAssignment={handleRemoveAssignment}
                                        terms={terms}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* All Assignments Table Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>All Course Assignments</DialogTitle>
                            <DialogDescription>Complete list of all course assignments across programs</DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[500px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Program</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead className="text-center">Year Level</TableHead>
                                        <TableHead className="text-center">Term</TableHead>
                                        <TableHead className="text-center">Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedAssignments.length > 0 ? (
                                        paginatedAssignments.map((assignment) => {
                                            const program = assignment.program; // Use relationship data
                                            const subject = assignment.subject; // Use relationship data
                                            const yearName = `${assignment.year_level}${assignment.year_level === 1 ? 'st' : assignment.year_level === 2 ? 'nd' : assignment.year_level === 3 ? 'rd' : 'th'} Year`;
                                            const term = terms.find(t => t.id === assignment.term_id);
                                            const termName = term ? term.name : `Term ${assignment.term_id}`;

                                            return (
                                                <TableRow key={assignment.id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{program?.department}</div>
                                                            <div className="text-muted-foreground text-sm">{program?.code}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{subject?.name}</div>
                                                            <div className="text-muted-foreground text-sm">{subject?.code}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline">{yearName}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline">{termName}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="text-muted-foreground text-sm">
                                                            {new Date(assignment.created_at).toLocaleDateString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveAssignment(assignment)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                                                No course assignments found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Controls */}
                        {assignments.length > itemsPerPage && (
                            <div className="flex items-center justify-between border-t px-6 py-4">
                                <div className="text-muted-foreground text-sm">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, assignments.length)} of{' '}
                                    {assignments.length} assignments
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <div className="text-sm">
                                        Page {currentPage} of {totalPages}
                                    </div>
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
                    </DialogContent>
                </Dialog>

                {/* Manual Assignment Dialog */}
                <AssignmentDialog
                    isOpen={showAssignmentForm}
                    onClose={() => {
                        setShowAssignmentForm(false)
                        setAssignmentErrors(null)
                    } }
                    onSave={handleAddAssignment}
                    programs={programs}
                    subjects={subjects}
                    terms={terms}
                    errors={assignmentErrors}
                />

                {/* Drag and Drop Assignment Dialog */}
                <DropAssignmentDialog
                    isOpen={showDropDialog}
                    onClose={() => {
                        setShowDropDialog(false);
                        setDraggedSubject(null);
                        setDropTarget(null);
                        setAssignmentErrors(null);
                    }}
                    onSave={handleDropAssignment}
                    subject={draggedSubject}
                    program={dropTarget}
                    terms={terms}
                    errors={assignmentErrors}
                />

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Delete Course Assignment</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this assignment? This action cannot be undone.
                                {assignmentToDelete && (
                                    <div className="bg-muted mt-2 rounded border p-2">
                                        <div className='border-b border-black/50 mb-1 text-center'>
                                            <strong>Assignment Details</strong>
                                        </div>
                                        <strong>Program:</strong> {assignmentToDelete.program?.description}
                                        <br />
                                        <strong>Subject:</strong> {assignmentToDelete.subject?.name}
                                        <br />
                                        <strong>Assignment:</strong>{' '}
                                        {(() => {
                                            const yearName = `${assignmentToDelete.year_level}${assignmentToDelete.year_level === 1 ? 'st' : assignmentToDelete.year_level === 2 ? 'nd' : assignmentToDelete.year_level === 3 ? 'rd' : 'th'} Year`;
                                            const term = terms.find(t => t.id === assignmentToDelete.term_id);
                                            const termName = term ? term.name : `Term ${assignmentToDelete.term_id}`;
                                            return `${yearName}, ${termName}`;
                                        })()}
                                    </div>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {deleteErrors && (
                                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-600">
                                    <div className="mb-2 font-semibold">⚠️ Please fix the following errors:</div>
                                    <ul className="list-inside list-disc space-y-1">
                                        {Object.entries(deleteErrors).map(([field, messages]) => (
                                            <li key={field}>
                                                <span className="font-medium capitalize">{field.replace('_', ' ')}:</span>{' '}
                                                {Array.isArray(messages) ? messages[0] : messages}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDeleteAssignment}>
                                Delete Assignment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

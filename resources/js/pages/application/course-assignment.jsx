import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BookOpen, Code, GripVertical, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Course Assignment',
        href: '/course-assignment',
    },
];

// Sample data for programs
const samplePrograms = [
    {
        id: 1,
        unique_code: 'PROG001',
        name: 'Computer Science',
        description: 'Bachelor of Science in Computer Science',
    },
    {
        id: 2,
        unique_code: 'PROG002',
        name: 'Information Technology',
        description: 'Bachelor of Science in Information Technology',
    },
    {
        id: 3,
        unique_code: 'PROG003',
        name: 'Data Science',
        description: 'Master of Science in Data Science',
    },
    {
        id: 4,
        unique_code: 'PROG004',
        name: 'Cybersecurity',
        description: 'Bachelor of Science in Cybersecurity',
    },
];

// Sample data for subjects
const sampleSubjects = [
    {
        id: 1,
        code: 'CS101',
        name: 'Introduction to Computer Science',
        unit: 3,
        isGeneralEducation: false,
    },
    {
        id: 2,
        code: 'MATH101',
        name: 'College Algebra',
        unit: 3,
        isGeneralEducation: true,
    },
    {
        id: 3,
        code: 'ENG101',
        name: 'English Composition',
        unit: 3,
        isGeneralEducation: true,
    },
    {
        id: 4,
        code: 'CS201',
        name: 'Data Structures and Algorithms',
        unit: 4,
        isGeneralEducation: false,
    },
    {
        id: 5,
        code: 'PHIL101',
        name: 'Introduction to Philosophy',
        unit: 3,
        isGeneralEducation: true,
    },
    {
        id: 6,
        code: 'CS301',
        name: 'Database Management Systems',
        unit: 3,
        isGeneralEducation: false,
    },
    {
        id: 7,
        code: 'CS401',
        name: 'Software Engineering',
        unit: 3,
        isGeneralEducation: false,
    },
    {
        id: 8,
        code: 'STAT101',
        name: 'Statistics',
        unit: 3,
        isGeneralEducation: true,
    },
];

// Sample data for terms
const sampleTerms = [
    {
        id: 1,
        name: '1st Term',
    },
    {
        id: 2,
        name: '2nd Term',
    },
    {
        id: 3,
        name: '3rd Term',
    },
];

// Sample data for year levels
const sampleYearLevels = [
    {
        id: 1,
        name: '1st Year',
    },
    {
        id: 2,
        name: '2nd Year',
    },
    {
        id: 3,
        name: '3rd Year',
    },
    {
        id: 4,
        name: '4th Year',
    },
    {
        id: 5,
        name: '5th Year',
    },
];

// Sample data for course assignments
const sampleCourseAssignments = [
    {
        id: 1,
        program_code: 'PROG001',
        subject_code: 'CS101',
        year_level: '1st Year',
        term: '1st Term',
        created_at: '2025-06-10 09:00',
        updated_at: '2025-06-11 14:30',
    },
    {
        id: 2,
        program_code: 'PROG002',
        subject_code: 'CS101',
        year_level: '1st Year',
        term: '1st Term',
        created_at: '2025-06-10 09:00',
        updated_at: '2025-06-11 14:30',
    },
];

// Subject item component for drag and drop
function SubjectItem({ subject, onDragStart }) {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, subject)}
            className="flex cursor-move items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-border/80 hover:shadow-md"
        >
            <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-medium">{subject.code}</span>
                </div>
                <div>
                    <div className="text-sm font-medium">{subject.name}</div>
                    <div className="text-xs text-muted-foreground">
                        {subject.unit} unit{subject.unit !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>
            <Badge
                variant={subject.isGeneralEducation ? 'default' : 'secondary'}
                className={subject.isGeneralEducation ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
            >
                {subject.isGeneralEducation ? 'GE' : 'Major'}
            </Badge>
        </div>
    );
}

// Program drop zone component
function ProgramDropZone({ program, assignments, onDrop, onRemoveAssignment }) {
    const [dragOver, setDragOver] = useState(false);

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

    const programAssignments = assignments.filter((a) => a.program_code === program.unique_code);

    // Group assignments by year and term
    const groupedAssignments = programAssignments.reduce((acc, assignment) => {
        const key = `${assignment.year_level}-${assignment.term}`;
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
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{program.unique_code}</p>
                    </div>
                    <Badge variant="outline">{programAssignments.length} subjects</Badge>
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
                            return (
                                <div key={key} className="space-y-2">
                                    <h4 className="text-sm font-medium text-foreground">
                                        {firstAssignment.year_level}, {firstAssignment.term}
                                    </h4>
                                    <div className="space-y-1">
                                        {yearTermAssignments.map((assignment) => {
                                            const subject = sampleSubjects.find((s) => s.code === assignment.subject_code);
                                            return subject ? (
                                                <div
                                                    key={assignment.id}
                                                    className="flex items-center justify-between rounded-md border border-border bg-muted p-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Code className="h-3 w-3 text-muted-foreground" />
                                                        <span className="font-mono text-xs">{subject.code}</span>
                                                        <span className="text-xs">{subject.name}</span>
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
                    <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground">
                        Drop subjects here to assign to {program.name}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Drag and drop assignment dialog
function DropAssignmentDialog({ isOpen, onClose, onSave, subject, program }) {
    const [formData, setFormData] = useState({
        year_level: '',
        term: '',
    });

    const handleSave = () => {
        if (formData.year_level && formData.term) {
            onSave(formData);
            setFormData({ year_level: '', term: '' });
            onClose();
        }
    };

    const handleCancel = () => {
        setFormData({ year_level: '', term: '' });
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
                        to <strong>{program?.name}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="year" className="text-right text-sm font-medium">
                            Year Level
                        </Label>
                        <Select value={formData.year_level} onValueChange={(value) => setFormData({ ...formData, year_level: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select year level" />
                            </SelectTrigger>
                            <SelectContent>
                                {sampleYearLevels.map((year) => (
                                    <SelectItem key={year.id} value={year.name}>
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
                        <Select value={formData.term} onValueChange={(value) => setFormData({ ...formData, term: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                            <SelectContent>
                                {sampleTerms.map((term) => (
                                    <SelectItem key={term.id} value={term.name}>
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
                    <Button onClick={handleSave} disabled={!formData.year_level || !formData.term}>
                        Assign Subject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Assignment dialog for manual entry
function AssignmentDialog({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        program_code: '',
        subject_code: '',
        year_level: '',
        term: '',
    });

    const handleSave = () => {
        if (formData.program_code && formData.subject_code && formData.year_level && formData.term) {
            onSave(formData);
            setFormData({ program_code: '', subject_code: '', year_level: '', term: '' });
            onClose();
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="program" className="text-right text-sm font-medium">
                            Program
                        </Label>
                        <Select value={formData.program_code} onValueChange={(value) => setFormData({ ...formData, program_code: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select program" />
                            </SelectTrigger>
                            <SelectContent>
                                {samplePrograms.map((program) => (
                                    <SelectItem key={program.id} value={program.unique_code}>
                                        {program.unique_code} - {program.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right text-sm font-medium">
                            Subject
                        </Label>
                        <Select value={formData.subject_code} onValueChange={(value) => setFormData({ ...formData, subject_code: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {sampleSubjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.code}>
                                        {subject.code} - {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                {sampleYearLevels.map((year) => (
                                    <SelectItem key={year.id} value={year.name}>
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
                        <Select value={formData.term} onValueChange={(value) => setFormData({ ...formData, term: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                            <SelectContent>
                                {sampleTerms.map((term) => (
                                    <SelectItem key={term.id} value={term.name}>
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
                    <Button
                        onClick={handleSave}
                        disabled={!formData.program_code || !formData.subject_code || !formData.year_level || !formData.term}
                    >
                        Add Assignment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function CourseAssignment() {
    // TODO: ROUTE - GET request to fetch course assignments
    // GET /api/course-assignments
    // This should replace sampleCourseAssignments with actual data from backend
    //
    // TODO: ROUTE - GET request to fetch terms
    // GET /api/terms
    // This should replace sampleTerms with actual data from backend
    //
    // TODO: ROUTE - GET request to fetch year levels
    // GET /api/year-levels
    // This should replace sampleYearLevels with actual data from backend
    const [assignments, setAssignments] = useState(sampleCourseAssignments);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [draggedSubject, setDraggedSubject] = useState(null);
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [showDropDialog, setShowDropDialog] = useState(false);
    const [dropTarget, setDropTarget] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState(null);

    // Filter subjects based on search
    const filteredSubjects = sampleSubjects.filter(
        (subject) => subject.code.toLowerCase().includes(searchTerm.toLowerCase()) || subject.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Filter programs based on selection
    const filteredPrograms = selectedProgram === 'all' ? samplePrograms : samplePrograms.filter((p) => p.unique_code === selectedProgram);

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

        const newAssignment = {
            id: Math.max(...assignments.map((a) => a.id), 0) + 1,
            program_code: dropTarget.unique_code,
            subject_code: draggedSubject.code,
            year_level: yearTerm.year_level,
            term: yearTerm.term,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };

        // Check if assignment already exists
        const existingAssignment = assignments.find(
            (a) =>
                a.program_code === dropTarget.unique_code &&
                a.subject_code === draggedSubject.code &&
                a.year_level === yearTerm.year_level &&
                a.term === yearTerm.term,
        );

        if (!existingAssignment) {
            setAssignments([...assignments, newAssignment]);

            // TODO: ROUTE - POST request to create course assignment
            // POST /api/course-assignments
            // Body: {
            //   program_code: dropTarget.unique_code,
            //   subject_code: draggedSubject.code,
            //   year_level: yearTerm.year_level,
            //   term: yearTerm.term
            // }
            // console.log('Creating assignment:', newAssignment);
        }

        // Reset state
        setDraggedSubject(null);
        setDropTarget(null);
        setShowDropDialog(false);
    };

    const handleRemoveAssignment = (assignment) => {
        setAssignmentToDelete(assignment);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteAssignment = () => {
        if (assignmentToDelete) {
            setAssignments(assignments.filter((a) => a.id !== assignmentToDelete.id));

            // TODO: ROUTE - DELETE request to remove course assignment
            // DELETE /api/course-assignments/{id}
            // console.log('Deleting assignment:', assignmentToDelete.id);
        }
        setDeleteDialogOpen(false);
        setAssignmentToDelete(null);
    };

    const handleAddAssignment = (formData) => {
        const newAssignment = {
            id: Math.max(...assignments.map((a) => a.id), 0) + 1,
            program_code: formData.program_code,
            subject_code: formData.subject_code,
            year_level: formData.year_level,
            term: formData.term,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };

        // Check if assignment already exists
        const existingAssignment = assignments.find(
            (a) =>
                a.program_code === formData.program_code &&
                a.subject_code === formData.subject_code &&
                a.year_level === formData.year_level &&
                a.term === formData.term,
        );

        if (!existingAssignment) {
            setAssignments([...assignments, newAssignment]);

            // TODO: ROUTE - POST request to create course assignment
            // POST /api/course-assignments
            // Body: {
            //   program_code: formData.program_code,
            //   subject_code: formData.subject_code,
            //   year_level: formData.year_level,
            //   term: formData.term
            // }
            // console.log('Creating assignment:', newAssignment);
        }
    };

    // Get statistics
    const totalAssignments = assignments.length;
    const programsWithAssignments = new Set(assignments.map((a) => a.program_code)).size;
    const subjectsAssigned = new Set(assignments.map((a) => a.subject_code)).size;

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
                        <Button onClick={() => setIsDialogOpen(true)}>
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
                            <div className="text-2xl font-bold">{totalAssignments}</div>
                            <p className="text-muted-foreground text-xs">Active course assignments</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Programs with Subjects</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{programsWithAssignments}</div>
                            <p className="text-muted-foreground text-xs">Out of {samplePrograms.length} total programs</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Subjects Assigned</CardTitle>
                            <Code className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{subjectsAssigned}</div>
                            <p className="text-muted-foreground text-xs">Out of {sampleSubjects.length} total subjects</p>
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
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                                        <div className="py-8 text-center text-muted-foreground">No subjects found</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Programs Panel */}
                    <div className="lg:col-span-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Programs</h3>
                                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                                    <SelectTrigger className="w-[250px]">
                                        <SelectValue placeholder="Select program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Programs</SelectItem>
                                        {samplePrograms.map((program) => (
                                            <SelectItem key={program.id} value={program.unique_code}>
                                                {program.unique_code} - {program.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-4">
                                {filteredPrograms.map((program) => (
                                    <ProgramDropZone
                                        key={program.id}
                                        program={program}
                                        assignments={assignments}
                                        onDrop={handleDrop}
                                        onRemoveAssignment={handleRemoveAssignment}
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
                                    {assignments.map((assignment) => {
                                        const program = samplePrograms.find((p) => p.unique_code === assignment.program_code);
                                        const subject = sampleSubjects.find((s) => s.code === assignment.subject_code);
                                        return (
                                            <TableRow key={assignment.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{program?.name || assignment.program_code}</div>
                                                        <div className="text-sm text-muted-foreground">{assignment.program_code}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{subject?.name || assignment.subject_code}</div>
                                                        <div className="text-sm text-muted-foreground">{assignment.subject_code}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">{assignment.year_level}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">{assignment.term}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-sm text-muted-foreground">
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
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Manual Assignment Dialog */}
                <AssignmentDialog isOpen={showAssignmentForm} onClose={() => setShowAssignmentForm(false)} onSave={handleAddAssignment} />

                {/* Drag and Drop Assignment Dialog */}
                <DropAssignmentDialog
                    isOpen={showDropDialog}
                    onClose={() => {
                        setShowDropDialog(false);
                        setDraggedSubject(null);
                        setDropTarget(null);
                    }}
                    onSave={handleDropAssignment}
                    subject={draggedSubject}
                    program={dropTarget}
                />

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Delete Course Assignment</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this assignment? This action cannot be undone.
                                {assignmentToDelete && (
                                    <div className="mt-2 rounded border bg-muted p-2">
                                        <strong>Assignment Details:</strong>
                                        <br />
                                        <strong>Program:</strong>{' '}
                                        {samplePrograms.find((p) => p.unique_code === assignmentToDelete.program_code)?.name ||
                                            assignmentToDelete.program_code}
                                        <br />
                                        <strong>Subject:</strong>{' '}
                                        {sampleSubjects.find((s) => s.code === assignmentToDelete.subject_code)?.name ||
                                            assignmentToDelete.subject_code}
                                        <br />
                                        <strong>Assignment:</strong> {assignmentToDelete.year_level}, {assignmentToDelete.term}
                                    </div>
                                )}
                            </DialogDescription>
                        </DialogHeader>
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

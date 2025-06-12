import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Calendar, ChevronLeft, ChevronRight, Edit, GraduationCap, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Class',
        href: '/class',
    },
];

// Available programs with auto-populated details
const availablePrograms = [
    {
        name: 'Computer Science',
        description: 'Bachelor of Science in Computer Science',
    },
    {
        name: 'Information Technology',
        description: 'Bachelor of Science in Information Technology',
    },
    {
        name: 'Data Science',
        description: 'Master of Science in Data Science',
    },
    {
        name: 'Cybersecurity',
        description: 'Bachelor of Science in Cybersecurity',
    },
    {
        name: 'Software Engineering',
        description: 'Bachelor of Engineering in Software Engineering',
    },
];

// Sample data for classes
const sampleData = [
    {
        id: 1,
        name: 'Computer Science - Year 1A',
        program: 'Computer Science',
        program_details: 'Bachelor of Science in Computer Science',
        created_at: '2025-06-10 09:00',
        updated_at: '2025-06-11 14:30',
    },
    {
        id: 2,
        name: 'Information Technology - Advanced',
        program: 'Information Technology',
        program_details: 'Bachelor of Science in Information Technology',
        created_at: '2025-06-09 11:00',
        updated_at: '2025-06-12 10:15',
    },
    {
        id: 3,
        name: 'Data Science - Graduate Level',
        program: 'Data Science',
        program_details: 'Master of Science in Data Science',
        created_at: '2025-06-08 13:00',
        updated_at: '2025-06-11 16:45',
    },
    {
        id: 4,
        name: 'Cybersecurity - Year 2B',
        program: 'Cybersecurity',
        program_details: 'Bachelor of Science in Cybersecurity',
        created_at: '2025-06-07 15:30',
        updated_at: '2025-06-10 09:20',
    },
    {
        id: 5,
        name: 'Software Engineering - Foundation',
        program: 'Software Engineering',
        program_details: 'Bachelor of Engineering in Software Engineering',
        created_at: '2025-06-06 10:45',
        updated_at: '2025-06-09 16:15',
    },
];

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>
            ))}
        </div>
    );
}

function ClassDialog({ isOpen, onClose, classData = null, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        program: '',
        program_details: '',
    });

    // Auto-populate program details based on selection
    const handleProgramChange = (value) => {
        const selectedProgram = availablePrograms.find((p) => p.name === value);
        setFormData({
            ...formData,
            program: value,
            program_details: selectedProgram ? selectedProgram.description : '',
        });
    };

    // Update form data when classData prop changes (for edit mode)
    React.useEffect(() => {
        if (classData) {
            setFormData({
                name: classData.name || '',
                program: classData.program || '',
                program_details: classData.program_details || '',
            });
        } else {
            // Reset form for add mode
            setFormData({ name: '', program: '', program_details: '' });
        }
    }, [classData]);

    const handleSave = () => {
        if (formData.name && formData.program && formData.program_details) {
            onSave(formData);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{classData ? 'Edit Class' : 'Add New Class'}</DialogTitle>
                    <DialogDescription>{classData ? 'Update the class details below.' : 'Create a new academic class.'}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-sm font-medium">
                            Class Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                            placeholder="e.g., Computer Science - Year 1A"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="program" className="text-right text-sm font-medium">
                            Program
                        </Label>
                        <Select value={formData.program} onValueChange={handleProgramChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePrograms.map((program) => (
                                    <SelectItem key={program.name} value={program.name}>
                                        {program.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="program_details" className="pt-3 text-right text-sm font-medium">
                            Program Details
                        </Label>
                        <Input
                            id="program_details"
                            value={formData.program_details}
                            readOnly
                            className="bg-muted col-span-3"
                            placeholder="Program details will auto-populate when you select a program"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.name || !formData.program || !formData.program_details}>
                        {classData ? 'Update' : 'Create'} Class
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Class() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [classesData, setClassesData] = useState(sampleData);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);

    const itemsPerPage = 5;

    // Get unique programs for filter
    const uniquePrograms = [...new Set(classesData.map((c) => c.program))];

    // Filter data based on search and program
    const filteredData = classesData.filter((classItem) => {
        const matchesSearch =
            classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            classItem.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
            classItem.program_details.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProgram = programFilter === 'all' || classItem.program === programFilter;
        return matchesSearch && matchesProgram;
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

    const handleAddClass = () => {
        setEditingClass(null);
        setIsDialogOpen(true);
    };

    const handleEditClass = (classItem) => {
        setEditingClass(classItem);
        setIsDialogOpen(true);
    };

    const handleSaveClass = (formData) => {
        if (editingClass) {
            // Update existing class
            setClassesData((prevData) =>
                prevData.map((classItem) =>
                    classItem.id === editingClass.id
                        ? {
                              ...classItem,
                              ...formData,
                              updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                          }
                        : classItem,
                ),
            );
            console.log('Class updated:', formData);
        } else {
            // Add new class
            const newClass = {
                id: Math.max(...classesData.map((c) => c.id), 0) + 1,
                ...formData,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };
            setClassesData((prevData) => [...prevData, newClass]);
            console.log('Class added:', formData);
        }

        // Reset current page to 1 if adding new class
        if (!editingClass) {
            setCurrentPage(1);
        }
    };

    const handleDeleteClass = (classItem) => {
        setClassToDelete(classItem);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteClass = () => {
        if (classToDelete) {
            setClassesData((prevData) => prevData.filter((classItem) => classItem.id !== classToDelete.id));

            // Adjust current page if necessary
            const newFilteredData = classesData
                .filter((classItem) => classItem.id !== classToDelete.id)
                .filter((classItem) => {
                    const matchesSearch =
                        classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        classItem.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        classItem.program_details.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesProgram = programFilter === 'all' || classItem.program === programFilter;
                    return matchesSearch && matchesProgram;
                });
            const newTotalPages = Math.ceil(newFilteredData.length / itemsPerPage);

            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            } else if (newFilteredData.length === 0) {
                setCurrentPage(1);
            }

            console.log('Class deleted:', classToDelete.name);
        }
        setDeleteDialogOpen(false);
        setClassToDelete(null);
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

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Academic Classes</h1>
                        <p className="text-muted-foreground mt-2">Manage classes and academic programs</p>
                    </div>
                    <Button onClick={handleAddClass} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Class
                    </Button>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                <div className="relative flex-1 md:max-w-sm">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="Search classes, programs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={programFilter} onValueChange={setProgramFilter}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Filter by program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Programs</SelectItem>
                                        {uniquePrograms.map((program) => (
                                            <SelectItem key={program} value={program}>
                                                {program}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {filteredData.length} classes
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
                                            <TableHead>Class Name</TableHead>
                                            <TableHead>Program</TableHead>
                                            <TableHead className="text-center">Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.map((classItem) => (
                                            <TableRow key={classItem.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="text-muted-foreground h-4 w-4" />
                                                        <span className="font-medium">{classItem.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <Badge variant="secondary">{classItem.program}</Badge>
                                                        <div className="text-sm text-muted-foreground">
                                                            {classItem.program_details}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(classItem.updated_at)}</span>
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
                                                            <DropdownMenuItem onClick={() => handleEditClass(classItem)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Class
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600"
                                                                onClick={() => handleDeleteClass(classItem)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Class
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <GraduationCap className="text-muted-foreground mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-semibold">No classes found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm || programFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by creating your first academic class.'}
                                </p>
                                {!searchTerm && programFilter === 'all' && (
                                    <Button onClick={handleAddClass}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Class
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
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

            {/* Add/Edit Class Dialog */}
            <ClassDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} classData={editingClass} onSave={handleSaveClass} />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Class</DialogTitle>
                        <DialogDescription>Are you sure you want to delete "{classToDelete?.name}"? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteClass}>
                            Delete Class
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

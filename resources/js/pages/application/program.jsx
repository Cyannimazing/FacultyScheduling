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
import { Head } from '@inertiajs/react';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Clock, Code, Edit, MoreHorizontal, Plus, Search, Trash2, Users } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Program',
        href: '/program',
    },
];

const sampleData = [
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
        created_at: '2025-06-09 11:00',
        updated_at: '2025-06-12 10:15',
    },
    {
        id: 3,
        unique_code: 'PROG003',
        name: 'Data Science',
        description: 'Master of Science in Data Science',
        year_length: 2,
        created_at: '2025-06-08 13:00',
        updated_at: '2025-06-11 16:45',
    },
    {
        id: 4,
        unique_code: 'PROG004',
        name: 'Cybersecurity',
        description: 'Bachelor of Science in Cybersecurity',
        year_length: 4,
        created_at: '2025-06-07 15:30',
        updated_at: '2025-06-10 09:20',
    },
    {
        id: 5,
        unique_code: 'PROG005',
        name: 'Software Engineering',
        description: 'Bachelor of Engineering in Software Engineering',
        year_length: 4,
        created_at: '2025-06-06 10:45',
        updated_at: '2025-06-09 16:15',
    },
];

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}

function ProgramDialog({ isOpen, onClose, program = null, onSave }) {
    const [formData, setFormData] = useState({
        unique_code: '',
        name: '',
        description: '',
        year_length: '',
    });

    // Update form data when program prop changes (for edit mode)
    React.useEffect(() => {
        if (program) {
            setFormData({
                unique_code: program.unique_code || '',
                name: program.name || '',
                description: program.description || '',
                year_length: program.year_length || '',
            });
        } else {
            // Reset form for add mode
            setFormData({ unique_code: '', name: '', description: '', year_length: '' });
        }
    }, [program]);

    const handleSave = () => {
        if (formData.unique_code && formData.name && formData.description && formData.year_length) {
            onSave(formData);
            onClose();
            // Don't reset form here - let useEffect handle it when program prop changes
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{program ? 'Edit Program' : 'Add New Program'}</DialogTitle>
                    <DialogDescription>{program ? 'Update the program details below.' : 'Create a new academic program.'}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="code" className="text-right text-sm font-medium">
                            Code
                        </label>
                        <Input
                            id="code"
                            value={formData.unique_code}
                            onChange={(e) => setFormData({ ...formData, unique_code: e.target.value })}
                            className="col-span-3"
                            placeholder="PROG001"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right text-sm font-medium">
                            Name
                        </label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                            placeholder="Program Name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="description" className="text-right text-sm font-medium">
                            Description
                        </label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="col-span-3"
                            placeholder="Program Description"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="year_length" className="text-right text-sm font-medium">
                            Program Length
                        </label>
                        <Select value={formData.year_length.toString()} onValueChange={(value) => setFormData({ ...formData, year_length: parseInt(value) })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select program length" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2">2 Years</SelectItem>
                                <SelectItem value="3">3 Years</SelectItem>
                                <SelectItem value="4">4 Years</SelectItem>
                                <SelectItem value="5">5 Years</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.unique_code || !formData.name || !formData.description || !formData.year_length}>
                        {program ? 'Update' : 'Create'} Program
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Program() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [programsData, setProgramsData] = useState(sampleData);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [programToDelete, setProgramToDelete] = useState(null);

    const itemsPerPage = 5;

    // Filter data based on search and status
    const filteredData = programsData.filter((program) => {
        const matchesSearch =
            program.name.toLowerCase().includes(searchTerm.toLowerCase()) || program.unique_code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
        return matchesSearch && matchesStatus;
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

    const handleAddProgram = () => {
        setEditingProgram(null);
        setIsDialogOpen(true);
    };

    const handleEditProgram = (program) => {
        setEditingProgram(program);
        setIsDialogOpen(true);
    };

    const handleSaveProgram = (formData) => {
        if (editingProgram) {
            // Update existing program
            setProgramsData((prevData) =>
                prevData.map((program) =>
                    program.id === editingProgram.id
                        ? {
                              ...program,
                              ...formData,
                              updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                          }
                        : program,
                ),
            );
            console.log('Program updated:', formData);
        } else {
            // Add new program
            const newProgram = {
                id: Math.max(...programsData.map((p) => p.id), 0) + 1,
                ...formData,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };
            setProgramsData((prevData) => [...prevData, newProgram]);
            console.log('Program added:', formData);
        }

        // Reset current page to 1 if adding new program
        if (!editingProgram) {
            setCurrentPage(1);
        }
    };

    const handleDeleteProgram = (program) => {
        setProgramToDelete(program);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteProgram = () => {
        if (programToDelete) {
            setProgramsData((prevData) => prevData.filter((program) => program.id !== programToDelete.id));

            // Adjust current page if necessary
            const newFilteredData = programsData
                .filter((program) => program.id !== programToDelete.id)
                .filter((program) => {
                    const matchesSearch =
                        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        program.unique_code.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
                    return matchesSearch && matchesStatus;
                });
            const newTotalPages = Math.ceil(newFilteredData.length / itemsPerPage);

            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            } else if (newFilteredData.length === 0) {
                setCurrentPage(1);
            }

            console.log('Program deleted:', programToDelete.name);
        }
        setDeleteDialogOpen(false);
        setProgramToDelete(null);
    };

    const getStatusBadge = (status) => {
        return (
            <Badge
                variant={status === 'active' ? 'default' : 'secondary'}
                className={status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}
            >
                {status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
        );
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

    // Statistics cards data
    const stats = [
        {
            title: 'Total Programs',
            value: sampleData.length,
            icon: BookOpen,
            change: '+2 from last month',
            changeType: 'positive',
        },
        {
            title: 'Active Programs',
            value: sampleData.filter((p) => p.status === 'active').length,
            icon: Users,
            change: '+1 from last month',
            changeType: 'positive',
        },
        {
            title: 'Total Students',
            value: sampleData.reduce((acc, p) => acc + p.students_count, 0),
            icon: Users,
            change: '+45 from last month',
            changeType: 'positive',
        },
        {
            title: 'Avg Duration',
            value: '3.6 years',
            icon: Clock,
            change: 'No change',
            changeType: 'neutral',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Academic Programs</h1>
                        <p className="text-muted-foreground mt-2">Manage and organize your academic programs and curricula</p>
                    </div>
                    <Button onClick={handleAddProgram} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Program
                    </Button>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1 md:max-w-sm">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search programs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {filteredData.length} programs
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
                                            <TableHead className="w-[100px]">Code</TableHead>
                                            <TableHead>Program</TableHead>
                                            <TableHead className="text-center">Length</TableHead>
                                            <TableHead className="text-center">Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.map((program) => (
                                            <TableRow key={program.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Code className="text-muted-foreground h-4 w-4" />
                                                        <span className="font-mono text-sm font-medium">{program.unique_code}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{program.name}</div>
                                                        <div className="text-muted-foreground text-sm">{program.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                        {program.year_length} {program.year_length === 1 ? 'Year' : 'Years'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(program.updated_at)}</span>
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
                                                            <DropdownMenuItem onClick={() => handleEditProgram(program)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Program
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem variant="destructive" onClick={() => handleDeleteProgram(program)}>
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Program
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
                                <BookOpen className="text-muted-foreground mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-semibold">No programs found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by creating your first academic program.'}
                                </p>
                                {!searchTerm && statusFilter === 'all' && (
                                    <Button onClick={handleAddProgram}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Program
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

            {/* Add/Edit Program Dialog */}
            <ProgramDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} program={editingProgram} onSave={handleSaveProgram} />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Program</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{programToDelete?.name}" ({programToDelete?.unique_code})? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteProgram}>
                            Delete Program
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

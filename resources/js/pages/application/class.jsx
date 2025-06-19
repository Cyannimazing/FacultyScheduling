import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, Calendar, ChevronLeft, ChevronRight, Edit, GraduationCap, MoreHorizontal, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Class',
        href: '/class',
    },
];

var availablePrograms = []

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

function ClassDialog({ isOpen, onClose, classData = null, onSave, errors = null }) {
    const [formData, setFormData] = useState({
        name: '',
        prog_code: '',
        description: '',
        prog_name: ''
    });

    const handleProgramChange = (progCode) => {
        const selectedProgram = availablePrograms.find(p => p.code === progCode);
        if (selectedProgram) {
            setFormData(prevState => ({
                ...prevState,
                prog_code: selectedProgram.code,
                description: selectedProgram.description,
                prog_name: selectedProgram.name
            }));
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            if (classData) {
                setFormData({
                    name: classData.name || '',
                    prog_code: classData.prog_code || '',
                    description: classData.program?.description || '',
                    prog_name: classData.program?.name || ''
                });
            } else {
                setFormData({ name: '', prog_code: '', description: '', prog_name: '' });
            }
        }
    }, [isOpen, classData]);

    const handleSave = () => {
        if (formData.name && formData.prog_code && formData.description) {
            onSave(formData);
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
                        <Select value={formData?.prog_code} onValueChange={handleProgramChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePrograms.map((program) => (
                                    <SelectItem key={program.id} value={program.code}>
                                        {program.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="program_description" className="pt-3 text-right text-sm font-medium">
                            Program Details
                        </Label>
                        <Input
                            id="program_details"
                            value={formData.description}
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
                    <Button onClick={handleSave} disabled={!formData.name || !formData.prog_code || !formData.description}>
                        {classData ? 'Update' : 'Create'} Class
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Class() {
    const { data } = usePage().props
    const [isLoading, setIsLoading] = useState(false);
    const [searchClass, setSearchClass] = useState('');
    const [programFilter, setProgramFilter] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [saveErrors, setSaveErrors] = useState(null);
    const itemsPerPage = data.groups.per_page;
    const uniquePrograms = data.programs
    availablePrograms = data.programs

    const filteredData = data.groups.total

    const totalPages = data.groups.last_page
    const paginatedData = data.groups.data

    const handlePageChange = (page) => {
        setIsLoading(true);
        router.get(
            '/class',
            { page },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleSearch = (e) => {
        setSearchClass(e.target.value);
        setIsLoading(true);
        router.get(
            '/class',
            { search: e.target.value, prog_code: programFilter, page: 1 },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleProgramFilter = (value) => {
        setProgramFilter(value);
        setIsLoading(true);
        router.get(
            '/class',
            { search: searchClass, prog_code: value, page: 1 },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleAddClass = () => {
        setEditingClass(null);
        setSaveErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleEditClass = (classItem) => {
        setEditingClass(classItem);
        setSaveErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleSaveClass = (formData) => {
        setSaveErrors(null); // Clear previous errors

        if (editingClass) {
            router.put(`/class/${editingClass.id}`, formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setSaveErrors(null);
                },
                onError: (errors) => {
                    console.error('Error updating class:', errors);
                    setSaveErrors(errors);
                },
            });
        } else {
            router.post('/class', formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setSaveErrors(null);
                },
                onError: (errors) => {
                    console.error('Error creating class:', errors);
                    setSaveErrors(errors);
                },
            });
        }
    };

    const handleDeleteClass = (classItem) => {
        setClassToDelete(classItem);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteClass = () => {
        if (classToDelete) {
            setIsDeleting(true);
            router.delete(`/class/${classToDelete.id}`, {
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
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />
            <div className="space-y-6 p-6">
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

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                <div className="relative flex-1 md:max-w-sm">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="Search classes, programs..."
                                        value={searchClass}
                                        onChange={handleSearch}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={programFilter} onValueChange={handleProgramFilter}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Filter by program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">All Programs</SelectItem>
                                        {uniquePrograms.map((program) => (
                                            <SelectItem key={program.code} value={program.code}>
                                                {program.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {filteredData} classes
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
                                                        <Badge variant="secondary">{classItem.program.name}</Badge>
                                                        <div className="text-muted-foreground text-sm">{classItem.program.description}</div>
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
                                    {searchClass || programFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by creating your first academic class.'}
                                </p>
                                {!searchClass && programFilter === 'all' && (
                                    <Button onClick={handleAddClass}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Class
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!isLoading && filteredData > itemsPerPage && (
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Page {data.groups.current_page} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(data.groups.current_page - 1)} disabled={data.groups.current_page === 1}>
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(data.groups.current_page + 1)}
                                disabled={data.groups.current_page === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ClassDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} classData={editingClass} onSave={handleSaveClass} errors={saveErrors} />

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Class</DialogTitle>
                        <DialogDescription>Are you sure you want to delete "{classToDelete?.name}"? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteClass} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete Class'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}

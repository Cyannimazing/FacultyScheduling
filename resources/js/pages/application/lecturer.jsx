import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { AlertCircle, Calendar, ChevronLeft, ChevronRight, Clock, Edit, GraduationCap, MoreHorizontal, Plus, Search, Trash2, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Lecturer',
        href: '/lecturer',
    },
];

const titleOptions = [
    'Dr.',
    'Prof.',
    'Prof. Dr.',
    'Associate Prof.',
    'Associate Prof. Dr.',
    'Assistant Prof.',
    'Assistant Prof. Dr.',
    'Emeritus Prof.',
    'Emeritus Prof. Dr.',
    'Adjunct Prof.',
    'Adjunct Prof. Dr.',
    'Clinical Prof.',
    'Clinical Prof. Dr.',
    'Research Prof.',
    'Research Prof. Dr.',
    'Lecturer',
    'Senior Lecturer',
    'Principal Lecturer',
    'Mr.',
    'Mrs.',
    'Ms.',
    'Miss',
    'Mx.',
    'Sir',
    'Dame',
    'Hon.',
    'Rev.',
    'Rev. Dr.',
    'Capt.',
    'Col.',
    'Gen.',
    'Maj.',
    'Lt.',
    'Adm.',
    'Cmdr.',
];

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}

function LecturerDialog({ isOpen, onClose, lecturer = null, onSave, errors = null }) {
    const [formData, setFormData] = useState({
        title: '',
        fname: '',
        lname: '',
    });

    React.useEffect(() => {
        if (isOpen) {
            if (lecturer) {
                // Only populate form data when editing (lecturer exists)
                setFormData({
                    title: lecturer.title || '',
                    fname: lecturer.fname || '',
                    lname: lecturer.lname || '',
                });
            } else {
                // Clear form data when adding new lecturer
                setFormData({ title: '', fname: '', lname: '' });
            }
        }
    }, [lecturer, isOpen]);

    const handleSave = () => {
        if (formData.title && formData.fname || formData.lname) {
            onSave(formData);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{lecturer ? 'Edit Lecturer' : 'Add New Lecturer'}</DialogTitle>
                    <DialogDescription>{lecturer ? 'Update the lecturer details below.' : 'Create a new lecturer profile.'}</DialogDescription>
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
                        <label htmlFor="title" className="text-right text-sm font-medium">
                            Title
                        </label>
                        <Select value={formData.title} onValueChange={(value) => setFormData({ ...formData, title: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a title" />
                            </SelectTrigger>
                            <SelectContent>
                                {titleOptions.map((title) => (
                                    <SelectItem key={title} value={title}>
                                        {title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="fname" className="text-right text-sm font-medium">
                            First Name
                        </label>
                        <Input
                            id="fname"
                            value={formData.fname}
                            onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                            className="col-span-3"
                            placeholder="First Name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="lname" className="text-right text-sm font-medium">
                            Last Name
                        </label>
                        <Input
                            id="lname"
                            value={formData.lname}
                            onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                            className="col-span-3"
                            placeholder="Last Name"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.title || !formData.fname}>
                        {lecturer ? 'Update' : 'Create'} Lecturer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Lecturer() {
    const { data } = usePage().props
    const [isLoading, setIsLoading] = useState(false);
    const [searchLecturer, setSearchLecturer] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLecturer, setEditingLecturer] = useState(null);
    const [lecturersData, setLecturersData] = useState(data.lecturers.data);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [lecturerToDelete, setLecturerToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [saveErrors, setSaveErrors] = useState(null);

    const itemsPerPage = data.lecturers.per_page;
    const totalPages = data.lecturers.last_page;
    const paginatedData = data.lecturers.data;

    const handlePageChange = (page) => {
        setIsLoading(true);
        router.get(
            '/lecturer',
            { page },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleSearch = (e) => {
        setSearchLecturer(e.target.value);
        setIsLoading(true);
        router.get(
            '/lecturer',
            { search: e.target.value, page: 1 },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleAddLecturer = () => {
        setEditingLecturer(null);
        setSaveErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleEditLecturer = (lecturer) => {
        setEditingLecturer(lecturer);
        setSaveErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleSaveLecturer = (formData) => {
        setSaveErrors(null); // Clear previous errors

        if (editingLecturer) {
            router.put(`/lecturer/${editingLecturer.id}`, formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setSaveErrors(null);
                },
                onError: (errors) => {
                    console.error('Error updating lecturer:', errors);
                    setSaveErrors(errors);
                },
            });
        } else {
            router.post('/lecturer', formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setSaveErrors(null);
                },
                onError: (errors) => {
                    console.error('Error creating lecturer:', errors);
                    setSaveErrors(errors);
                },
            });
        }
    };

    const handleDeleteLecturer = (lecturer) => {
        setLecturerToDelete(lecturer);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteLecturer = () => {
        if (lecturerToDelete) {
            setIsDeleting(true);
            router.delete(`/lecturer/${lecturerToDelete.id}`, {
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
            <Head title="Lecturers" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Lecturers</h1>
                        <p className="text-muted-foreground mt-2">Manage your faculty and academic staff</p>
                    </div>
                    <Button onClick={handleAddLecturer} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lecturer
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1 md:max-w-sm">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search lecturers..."
                                    value={searchLecturer}
                                    onChange={handleSearch}
                                    className="pl-9"
                                />
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {data.lecturers.total} lecturers
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
                                            <TableHead>Lecturer Details</TableHead>
                                            <TableHead className="text-center">Created</TableHead>
                                            <TableHead className="text-center">Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.map((lecturer) => (
                                            <TableRow key={lecturer.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <span className="font-medium">{lecturer.id}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <User className="text-muted-foreground h-4 w-4" />
                                                        <div>
                                                            <div className="font-medium">
                                                                {lecturer.title} {lecturer.fname} {lecturer.lname}
                                                            </div>
                                                            <div className="text-muted-foreground text-sm">
                                                                {lecturer.fname} {lecturer.lname}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{formatDate(lecturer.created_at)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(lecturer.updated_at)}</span>
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
                                                            <DropdownMenuItem onClick={() => handleEditLecturer(lecturer)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Lecturer
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem variant="destructive" onClick={() => handleDeleteLecturer(lecturer)}>
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Lecturer
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
                                <h3 className="mb-2 text-lg font-semibold">No lecturers found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchLecturer ? 'Try adjusting your search criteria.' : 'Get started by adding your first lecturer.'}
                                </p>
                                {!searchLecturer && (
                                    <Button onClick={handleAddLecturer}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Lecturer
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!isLoading && data.lecturers.total > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Page {data.lecturers.current_page} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(data.lecturers.current_page - 1)} disabled={data.lecturers.current_page === 1}>
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(data.lecturers.current_page + 1)}
                                disabled={data.lecturers.current_page === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <LecturerDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} lecturer={editingLecturer} onSave={handleSaveLecturer} errors={saveErrors} />

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Lecturer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{lecturerToDelete?.title} {lecturerToDelete?.fname} {lecturerToDelete?.lname}"? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteLecturer} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete Lecturer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}

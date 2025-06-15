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
import { Calendar, ChevronLeft, ChevronRight, Clock, Edit, GraduationCap, MoreHorizontal, Plus, Search, Trash2, User } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Lecturer',
        href: '/lecturer',
    },
];

const initialData = [
    {
        id: 1,
        title: 'Dr.',
        fname: 'John',
        lname: 'Smith',
        created_at: '2025-06-01 09:00',
        updated_at: '2025-06-02 14:30',
    },
    {
        id: 2,
        title: 'Prof.',
        fname: 'Jane',
        lname: 'Johnson',
        created_at: '2025-06-03 11:00',
        updated_at: '2025-06-04 10:15',
    },
    {
        id: 3,
        title: 'Ms.',
        fname: 'Emily',
        lname: 'Davis',
        created_at: '2025-06-05 13:00',
        updated_at: '2025-06-06 16:45',
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

function LecturerDialog({ isOpen, onClose, lecturer = null, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        fname: '',
        lname: '',
    });

    React.useEffect(() => {
        if (lecturer) {
            setFormData({
                title: lecturer.title || '',
                fname: lecturer.fname || '',
                lname: lecturer.lname || '',
            });
        } else {
            setFormData({ title: '', fname: '', lname: '' });
        }
    }, [lecturer]);

    const handleSave = () => {
        if (formData.title && formData.fname && formData.lname) {
            onSave(formData);
            onClose();
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
                    <Button onClick={handleSave} disabled={!formData.title || !formData.fname || !formData.lname}>
                        {lecturer ? 'Update' : 'Create'} Lecturer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Lecturer() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLecturer, setEditingLecturer] = useState(null);
    const [lecturersData, setLecturersData] = useState(initialData);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [lecturerToDelete, setLecturerToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const itemsPerPage = 5;

    const filteredData = lecturersData.filter((lecturer) => {
        const fullName = `${lecturer.fname} ${lecturer.lname}`.toLowerCase();
        const titleName = `${lecturer.title} ${lecturer.fname} ${lecturer.lname}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || titleName.includes(searchTerm.toLowerCase());
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

    const handleAddLecturer = () => {
        setEditingLecturer(null);
        setIsDialogOpen(true);
    };

    const handleEditLecturer = (lecturer) => {
        setEditingLecturer(lecturer);
        setIsDialogOpen(true);
    };

    const handleSaveLecturer = (formData) => {
        if (editingLecturer) {
            setLecturersData((prevData) =>
                prevData.map((lecturer) =>
                    lecturer.id === editingLecturer.id
                        ? {
                              ...lecturer,
                              ...formData,
                              updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                          }
                        : lecturer,
                ),
            );
        } else {
            const newLecturer = {
                id: Math.max(...lecturersData.map((l) => l.id), 0) + 1,
                ...formData,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };
            setLecturersData((prevData) => [...prevData, newLecturer]);
        }

        if (!editingLecturer) {
            setCurrentPage(1);
        }
    };

    const handleDeleteLecturer = (lecturer) => {
        setLecturerToDelete(lecturer);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteLecturer = () => {
        if (lecturerToDelete) {
            setIsDeleting(true);
            // Simulate API call delay
            setTimeout(() => {
                setLecturersData((prevData) => prevData.filter((lecturer) => lecturer.id !== lecturerToDelete.id));

                // Adjust pagination if needed
                const newFilteredData = lecturersData
                    .filter((lecturer) => lecturer.id !== lecturerToDelete.id)
                    .filter((lecturer) => {
                        const fullName = `${lecturer.fname} ${lecturer.lname}`.toLowerCase();
                        const titleName = `${lecturer.title} ${lecturer.fname} ${lecturer.lname}`.toLowerCase();
                        return fullName.includes(searchTerm.toLowerCase()) || titleName.includes(searchTerm.toLowerCase());
                    });
                const newTotalPages = Math.ceil(newFilteredData.length / itemsPerPage);

                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                } else if (newFilteredData.length === 0) {
                    setCurrentPage(1);
                }

                setDeleteDialogOpen(false);
                setIsDeleting(false);
            }, 800);
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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {filteredData.length} lecturers
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
                                    {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first lecturer.'}
                                </p>
                                {!searchTerm && (
                                    <Button onClick={handleAddLecturer}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Lecturer
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!isLoading && paginatedData.length > 0 && totalPages > 1 && (
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

            <LecturerDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} lecturer={editingLecturer} onSave={handleSaveLecturer} />

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

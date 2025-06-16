import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Code, Edit, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Subject',
        href: '/subject',
    },
];


function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}

function SubjectDialog({ isOpen, onClose, subjectData = null, onSave }) {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        unit: '',
        is_gen_ed: false,
    });

    // Update form data when subjectData prop changes (for edit mode)
    React.useEffect(() => {
        if (subjectData) {
            setFormData({
                code: subjectData.code || '',
                name: subjectData.name || '',
                unit: subjectData.unit || '',
                is_gen_ed: subjectData.is_gen_ed || false,
            });
        } else {
            // Reset form for add mode
            setFormData({ code: '', name: '', unit: '', is_gen_ed: false });
        }
    }, [subjectData]);

    const handleSave = () => {
        if (formData.code && formData.name && formData.unit) {
            onSave({
                ...formData,
                unit: parseInt(formData.unit),
            });
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{subjectData ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
                    <DialogDescription>{subjectData ? 'Update the subject details below.' : 'Create a new academic subject.'}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right text-sm font-medium">
                            Subject Code
                        </Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="col-span-3"
                            placeholder="e.g., CS101"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-sm font-medium">
                            Subject Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                            placeholder="e.g., Introduction to Computer Science"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="unit" className="text-right text-sm font-medium">
                            Units
                        </Label>
                        <Select value={formData.unit.toString()} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select units" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 Unit</SelectItem>
                                <SelectItem value="2">2 Units</SelectItem>
                                <SelectItem value="3">3 Units</SelectItem>
                                <SelectItem value="4">4 Units</SelectItem>
                                <SelectItem value="5">5 Units</SelectItem>
                                <SelectItem value="6">6 Units</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="is_gen_ed" className="text-right text-sm font-medium">
                            General Education
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                            <Checkbox
                                id="is_gen_ed"
                                checked={formData.is_gen_ed}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_gen_ed: checked })}
                            />
                            <Label htmlFor="is_gen_ed" className="text-sm font-normal">
                                This is a General Education subject
                            </Label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.code || !formData.name || !formData.unit}>
                        {subjectData ? 'Update' : 'Create'} Subject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Subject() {
    const { data } = usePage().props
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchSubject, setSearchSubject] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false); // Add state to prevent multiple delete clicks

    const itemsPerPage = data.subjects.per_page;
    const totalPages = data.subjects.last_page;

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setIsLoading(true);
            setTimeout(() => {
                setCurrentPage(page);
                setIsLoading(false);
            }, 800);
        }
    };

    useEffect(() => {
        if (typeFilter !== "") {
            handleSearch('');
        }
    }, [typeFilter]);

    const handleSearch = (search) => {
        var s ;
        if(search){
            s = search?.target?.value
            setSearchSubject(search.target.value)
        }else{
            s = searchSubject
        }
        setIsLoading(true);
        router.get(
            '/subject',
            { search: s, isGenEdFilter: typeFilter, page: 1 },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleAddSubject = () => {
        setEditingSubject(null);
        setIsDialogOpen(true);
    };

    const handleEditSubject = (subject) => {
        setEditingSubject(subject);
        setIsDialogOpen(true);
    };

    const handleSaveSubject = (formData) => {
        if (editingSubject) {
            router.put(`/subject/${editingSubject.id}`, formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                },
            });
        } else {
            router.post('/subject', formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                },
            });
        }
    };

    const handleDeleteSubject = (subject) => {
        if (isDeleting) return;

        setSubjectToDelete(subject);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteSubject = () => {
        if (subjectToDelete) {
            setIsDeleting(true);
            router.delete(`/subject/${subjectToDelete.id}`, {
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

    const cancelDelete = () => {
        // Don't allow canceling while deleting
        if (isDeleting) return;

        setDeleteDialogOpen(false);
        setSubjectToDelete(null);
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
            <Head title="Subjects" />
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Academic Subjects</h1>
                        <p className="text-muted-foreground mt-2">Manage subjects and course offerings</p>
                    </div>
                    <Button onClick={handleAddSubject} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subject
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
                                        placeholder="Search subjects..."
                                        value={searchSubject}
                                        onChange={(e) => {
                                            setSearchSubject(e.target.value)
                                            handleSearch(e, typeFilter)
                                        }}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={typeFilter}
                                onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">All Subjects</SelectItem>
                                        <SelectItem value="1">General Education</SelectItem>
                                        <SelectItem value="0">Major Subjects</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {data.subjects.data.length} of {data.subjects.total} subjects
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : data.subjects.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Subject Name</TableHead>
                                            <TableHead className="text-center">Units</TableHead>
                                            <TableHead className="text-center">Type</TableHead>
                                            <TableHead className="text-center">Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.subjects.data.map((subject) => (
                                            <TableRow key={subject.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Code className="text-muted-foreground h-4 w-4" />
                                                        <span className="font-mono text-sm font-medium">{subject.code}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">{subject.name}</span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">
                                                        {subject.unit} unit{subject.unit !== 1 ? 's' : ''}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant={subject.is_gen_ed ? 'default' : 'secondary'}
                                                        className={
                                                            subject.is_gen_ed
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                : ''
                                                        }
                                                    >
                                                        {subject.is_gen_ed ? 'General Education' : 'Major Subject'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(subject.updated_at)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" disabled={isDeleting}>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditSubject(subject)} disabled={isDeleting}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Subject
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600"
                                                                onClick={() => handleDeleteSubject(subject)}
                                                                disabled={isDeleting}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Subject
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
                                <h3 className="mb-2 text-lg font-semibold">No subjects found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchSubject || typeFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by creating your first academic subject.'}
                                </p>
                                {!searchSubject && typeFilter === 'all' && (
                                    <Button onClick={handleAddSubject}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Subject
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {!isLoading && data.subjects.total > itemsPerPage && (
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

            {/* Add/Edit Subject Dialog */}
            <SubjectDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} subjectData={editingSubject} onSave={handleSaveSubject} />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={cancelDelete}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Subject</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{subjectToDelete?.name}" ({subjectToDelete?.code})? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelDelete} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteSubject} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete Subject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

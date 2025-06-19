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
import { AlertCircle, BookOpen, Calendar, ChevronLeft, ChevronRight, Code, Edit, MoreHorizontal, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Program',
        href: '/program',
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

function ProgramDialog({ isOpen, onClose, program = null, onSave, errors = null }) {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        number_of_year: '',
    });

    React.useEffect(() => {
        if (isOpen) {
            if (program) {
                console.log('Program data:', program); // Debug log
                setFormData({
                    code: program.code || '',
                    name: program.name || '',
                    description: program.description || '',
                    number_of_year: program.number_of_year ? program.number_of_year.toString() : '',
                });
            } else {
                setFormData({ code: '', name: '', description: '', number_of_year: '' });
            }
        }
    }, [isOpen, program]);

    const handleSave = () => {
        if (formData.code && formData.name && formData.description && formData.number_of_year) {
            onSave(formData);
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
                        <label htmlFor="code" className="text-right text-sm font-medium">
                            Code
                        </label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
                        <label htmlFor="number_of_year" className="text-right text-sm font-medium">
                            Program Length
                        </label>
                        <Select
                            value={formData.number_of_year.toString()}
                            onValueChange={(value) => setFormData({ ...formData, number_of_year: parseInt(value) })}
                        >
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
                    <Button onClick={handleSave} disabled={!formData.code || !formData.name || !formData.description || !formData.number_of_year}>
                        {program ? 'Update' : 'Create'} Program
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Program() {
    const { data } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [statusFilter] = useState('all');
    const [searchProgram, setSearchProgram] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [programToDelete, setProgramToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [saveErrors, setSaveErrors] = useState(null);

    const itemsPerPage = data.programs.per_page;

    const totalPages = data.programs.last_page;
    const paginatedData = data.programs.data;

    const handlePageChange = (page) => {
        setIsLoading(true);
        router.get(
            '/program',
            { page },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleSearch = (e) => {
        setSearchProgram(e.target.value);
        setIsLoading(true);
        router.get(
            '/program',
            { search: e.target.value, page: 1 },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleAddProgram = () => {
        setEditingProgram(null);
        setSaveErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleEditProgram = (program) => {
        setEditingProgram(program);
        setSaveErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleSaveProgram = (formData) => {
        setSaveErrors(null); // Clear previous errors

        if (editingProgram) {
            router.put(`/program/${editingProgram.id}`, formData, {
                onSuccess: () => {
                    setSaveErrors(null);
                },
                onError: (errors) => {
                    console.error('Error updating program:', errors);
                    setSaveErrors(errors);
                },
            });
        } else {
            router.post('/program', formData, {
                onSuccess: () => {
                    setSaveErrors(null);
                },
                onError: (errors) => {
                    console.error('Error creating program:', errors);
                    setSaveErrors(errors);
                },
            });
        }
    };

    const handleDeleteProgram = (program) => {
        setProgramToDelete(program);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteProgram = () => {
        if (programToDelete) {
            setIsDeleting(true);
            router.delete(`/program/${programToDelete.id}`, {
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
            <Head title="Programs" />
            <div className="space-y-6 p-6">
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

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1 md:max-w-sm">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input placeholder="Search programs..." value={searchProgram} onChange={handleSearch} className="pl-9" />
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {data.programs.total} programs
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
                                        {data.programs.data.map((program) => (
                                            <TableRow key={program.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Code className="text-muted-foreground h-4 w-4" />
                                                        <span className="font-mono text-sm font-medium">{program.code}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{program.name}</div>
                                                        <div className="text-muted-foreground text-sm">{program.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                    >
                                                        {program.number_of_year} {program.number_of_year === 1 ? 'Year' : 'Years'}
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
                                    {searchProgram || statusFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by creating your first academic program.'}
                                </p>
                                {!searchProgram && statusFilter === 'all' && (
                                    <Button onClick={handleAddProgram}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Program
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!isLoading && data.programs.total > itemsPerPage && (
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Page {data.programs.current_page} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(data.programs.current_page - 1)}
                                disabled={data.programs.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(data.programs.current_page + 1)}
                                disabled={data.programs.current_page === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ProgramDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} program={editingProgram} onSave={handleSaveProgram} errors={saveErrors} />

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Program</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{programToDelete?.name}" ({programToDelete?.code})? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteProgram} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete Program'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}

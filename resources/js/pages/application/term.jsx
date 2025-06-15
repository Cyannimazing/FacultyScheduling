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
import { Calendar, ChevronLeft, ChevronRight, Clock, Edit, GraduationCap, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs = [{ title: 'Term', href: '/term' }];

const termOptions = ['1st Term', '2nd Term', '3rd Term', 'Summer'];

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}

function TermDialog({ isOpen, onClose, term = null, onSave, existingTerms = [] }) {
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: term?.name || '',
            });
        }
    }, [isOpen, term]);

    const availableTerms = term ? termOptions : termOptions.filter((option) => !existingTerms.some((t) => t.name === option));

    const handleSave = () => {
        if (formData.name) {
            onSave(formData);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{term ? 'Edit Term' : 'Add New Term'}</DialogTitle>
                    <DialogDescription>{term ? 'Update the term details below.' : 'Select an academic term to add.'}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right text-sm font-medium">
                            Term
                        </label>
                        <Select value={formData.name} onValueChange={(value) => setFormData({ name: value })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a term" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTerms.map((termOption) => (
                                    <SelectItem key={termOption} value={termOption}>
                                        {termOption}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {availableTerms.length === 0 && !term && (
                        <div className="text-muted-foreground col-span-4 text-center text-sm">All terms have been added already.</div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.name || (availableTerms.length === 0 && !term)}>
                        {term ? 'Update' : 'Create'} Term
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Index() {
    const { data } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTerm, setEditingTerm] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [termToDelete, setTermToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setIsLoading(true);
        router.get(
            '/term',
            { search: e.target.value, page: 1 },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };
    console.log()
    const handlePageChange = (page) => {
        setIsLoading(true);
        router.get(
            '/term',
            { page },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleAddTerm = () => {
        setEditingTerm(null);
        setIsDialogOpen(true);
    };

    const handleEditTerm = (term) => {
        setEditingTerm(term);
        setIsDialogOpen(true);
    };

    const handleSaveTerm = (formData) => {
        setIsProcessing(true);
        if (editingTerm) {
            router.put(`/term/${editingTerm.id}`, formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setIsProcessing(false);
                },
                onError: () => {
                    setIsProcessing(false);
                },
            });
        } else {
            router.post('/term', formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setIsProcessing(false);
                },
                onError: () => {
                    setIsProcessing(false);
                },
            });
        }
    };

    const handleDeleteTerm = (term) => {
        setTermToDelete(term);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteTerm = () => {
        if (termToDelete) {
            setIsProcessing(true);
            router.delete(`/term/${termToDelete.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setIsProcessing(false);
                },
                onError: () => {
                    setIsProcessing(false);
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
            <Head title="Terms" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Academic Terms</h1>
                        <p className="text-muted-foreground mt-2">Manage your academic terms and semesters</p>
                    </div>
                    <Button onClick={handleAddTerm} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Term
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1 md:max-w-sm">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input placeholder="Search terms..." value={searchTerm} onChange={handleSearch} className="pl-9" />
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {data.terms.length} of {data.terms.total} terms
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : data.terms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <GraduationCap className="text-muted-foreground mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-semibold">No terms found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first academic term.'}
                                </p>
                                {!searchTerm && (
                                    <Button onClick={handleAddTerm}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Term
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">ID</TableHead>
                                            <TableHead>Term Name</TableHead>
                                            <TableHead className="text-center">Created</TableHead>
                                            <TableHead className="text-center">Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.terms.data.map((term) => (
                                            <TableRow key={term.id} className="hover:bg-muted/50">
                                                <TableCell>{term.id}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="text-muted-foreground h-4 w-4" />
                                                        <span className="font-medium">{term.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{formatDate(term.created_at)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(term.updated_at)}</span>
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
                                                            <DropdownMenuItem onClick={() => handleEditTerm(term)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Term
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600"
                                                                onClick={() => handleDeleteTerm(term)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Term
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!isLoading && data.terms.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Page {terms.current_page} of {terms.last_page}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(terms.current_page - 1)}
                                disabled={terms.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(terms.current_page + 1)}
                                disabled={terms.current_page === terms.last_page}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <TermDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                term={editingTerm}
                onSave={handleSaveTerm}
                existingTerms={data.terms.data}
            />

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Term</DialogTitle>
                        <DialogDescription>Are you sure you want to delete "{termToDelete?.name}"? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteTerm} disabled={isProcessing}>
                            {isProcessing ? 'Deleting...' : 'Delete Term'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

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
import { Calendar, ChevronLeft, ChevronRight, Clock, Edit, GraduationCap, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Term',
        href: '/term',
    },
];

const initialData = [
    {
        id: 1,
        name: '1st Term',
        created_at: '2025-06-01 09:00',
        updated_at: '2025-06-02 14:30',
    },
    {
        id: 2,
        name: '2nd Term',
        created_at: '2025-06-03 11:00',
        updated_at: '2025-06-04 10:15',
    },
];

const termOptions = ['1st Term', '2nd Term', '3rd Term'];

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
    const [formData, setFormData] = useState({
        name: '',
    });

    // Update form data when term prop changes (for edit mode)
    React.useEffect(() => {
        if (term) {
            setFormData({
                name: term.name || '',
            });
        } else {
            // Reset form for add mode
            setFormData({ name: '' });
        }
    }, [term]);

    const handleSave = () => {
        if (formData.name) {
            onSave(formData);
            onClose();
            // Don't reset form here - let useEffect handle it when term prop changes
        }
    };

    // Get available term options (exclude already existing terms for add mode)
    const getAvailableTerms = () => {
        if (term) {
            // Edit mode: show all options
            return termOptions;
        } else {
            // Add mode: exclude already existing terms
            return termOptions.filter((termOption) => !existingTerms.some((existingTerm) => existingTerm.name === termOption));
        }
    };

    const availableTerms = getAvailableTerms();

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
                        <Select value={formData.name} onValueChange={(value) => setFormData({ ...formData, name: value })}>
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

export default function Term() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTerm, setEditingTerm] = useState(null);
    const [termsData, setTermsData] = useState(initialData);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [termToDelete, setTermToDelete] = useState(null);

    const itemsPerPage = 5;

    // Filter data based on search
    const filteredData = termsData.filter((term) => {
        return term.name.toLowerCase().includes(searchTerm.toLowerCase());
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

    const handleAddTerm = () => {
        setEditingTerm(null);
        setIsDialogOpen(true);
    };

    const handleEditTerm = (term) => {
        setEditingTerm(term);
        setIsDialogOpen(true);
    };

    const handleSaveTerm = (formData) => {
        if (editingTerm) {
            // Update existing term
            setTermsData((prevData) =>
                prevData.map((term) =>
                    term.id === editingTerm.id
                        ? { ...term, name: formData.name, updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ') }
                        : term,
                ),
            );
            console.log('Term updated:', formData);
        } else {
            // Add new term
            const newTerm = {
                id: Math.max(...termsData.map((t) => t.id), 0) + 1,
                name: formData.name,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };
            setTermsData((prevData) => [...prevData, newTerm]);
            console.log('Term added:', formData);
        }
        
        // Reset current page to 1 if adding new term
        if (!editingTerm) {
            setCurrentPage(1);
        }
    };
    
    const handleDeleteTerm = (term) => {
        setTermToDelete(term);
        setDeleteDialogOpen(true);
    };
    
    const confirmDeleteTerm = () => {
        if (termToDelete) {
            setTermsData((prevData) => prevData.filter((term) => term.id !== termToDelete.id));
            
            // Adjust current page if necessary
            const newFilteredData = termsData.filter((term) => term.id !== termToDelete.id)
                .filter(term => term.name.toLowerCase().includes(searchTerm.toLowerCase()));
            const newTotalPages = Math.ceil(newFilteredData.length / itemsPerPage);
            
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            } else if (newFilteredData.length === 0) {
                setCurrentPage(1);
            }
            
            console.log('Term deleted:', termToDelete.name);
        }
        setDeleteDialogOpen(false);
        setTermToDelete(null);
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
                {/* Header Section */}
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

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1 md:max-w-sm">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search terms..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {filteredData.length} terms
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
                                            <TableHead>Term Name</TableHead>
                                            <TableHead className="text-center">Created</TableHead>
                                            <TableHead className="text-center">Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.map((term) => (
                                            <TableRow key={term.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <span className="font-medium">{term.id}</span>
                                                </TableCell>
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
                                                            <DropdownMenuItem variant="destructive" onClick={() => handleDeleteTerm(term)}>
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
                        ) : (
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
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
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

            {/* Add/Edit Term Dialog */}
            <TermDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                term={editingTerm}
                onSave={handleSaveTerm}
                existingTerms={termsData}
            />
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Term</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{termToDelete?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteTerm}>
                            Delete Term
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

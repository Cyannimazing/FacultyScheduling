import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, Building, Calendar, ChevronLeft, ChevronRight, DoorOpen, Edit, MoreHorizontal, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Room',
        href: '/room',
    },
];

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-16" />
                </div>
            ))}
        </div>
    );
}

function RoomDialog({ isOpen, onClose, roomData = null, onSave, errors = null }) {
    const [formData, setFormData] = useState({
        name: '',
    });

    // Update form data when roomData prop changes (for edit mode)
    React.useEffect(() => {
        if (isOpen) {
            if (roomData) {
                // Only populate form data when editing (roomData exists)
                setFormData({
                    name: roomData.name || '',
                });
            } else {
                // Clear form data when adding new room
                setFormData({ name: '' });
            }
        }
    }, [roomData, isOpen]);

    const handleSave = () => {
        if (formData.name) {
            onSave(formData);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{roomData ? 'Edit Room' : 'Add New Room'}</DialogTitle>
                    <DialogDescription>{roomData ? 'Update the room details below.' : 'Create a new room.'}</DialogDescription>
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
                            Room Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                            placeholder="e.g., Room 101, Computer Lab 1"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.name}>
                        {roomData ? 'Update' : 'Create'} Room
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Room() {
    const { data } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [searchRoom, setSearchRoom] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); // Add processing state
    const [saveErrors, setSaveErrors] = useState(null);

    const itemsPerPage = 5;

    const handlePageChange = (page) => {
        setIsLoading(true);
        router.get(
            '/room',
            { search: searchRoom, page: page },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleSearch = (e) => {
        setSearchRoom(e.target.value);
        setIsLoading(true);
        router.get(
            '/room?page=1',
            { search: e.target.value, page: 1 },
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleAddRoom = () => {
        setEditingRoom(null);
        setSaveErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setSaveErrors(null); // Clear any previous errors
        setIsDialogOpen(true);
    };

    const handleSaveRoom = (formData) => {
        setSaveErrors(null); // Clear previous errors
        setIsProcessing(true);

        if (editingRoom) {
            router.put(`/room/${editingRoom.id}`, formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setIsProcessing(false);
                    setSaveErrors(null);
                },
                onError: (errors) => {
                    setIsProcessing(false);
                    console.error('Error updating room:', errors);
                    setSaveErrors(errors);
                },
            });
        } else {
            router.post('/room', formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setIsProcessing(false);
                    setSaveErrors(null);
                },
                onError: (errors) => {
                    setIsProcessing(false);
                    console.error('Error creating room:', errors);
                    setSaveErrors(errors);
                },
            });
        }
    };

    const handleDeleteRoom = (room) => {
        setRoomToDelete(room);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteRoom = () => {
        if (roomToDelete) {
            setIsProcessing(true);
            router.delete(`/room/${roomToDelete.id}`, {
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
            <Head title="Rooms" />
            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
                        <p className="text-muted-foreground mt-2">Manage classrooms, laboratories, and other facilities</p>
                    </div>
                    <Button onClick={handleAddRoom} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Room
                    </Button>
                </div>

                {/* Search and Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1 md:max-w-sm">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search rooms..."
                                    value={searchRoom}
                                    onChange={handleSearch}
                                    className="pl-9"
                                />
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {data.rooms.data.length} of {data.rooms.total} rooms
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : data.rooms.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">ID</TableHead>
                                            <TableHead>Room Name</TableHead>
                                            <TableHead className="text-center">Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.rooms.data.map((room) => (
                                            <TableRow key={room.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <span className="font-mono text-sm font-medium">#{room.id}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <DoorOpen className="text-muted-foreground h-4 w-4" />
                                                        <span className="font-medium">{room.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(room.updated_at)}</span>
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
                                                            <DropdownMenuItem onClick={() => handleEditRoom(room)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Room
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600"
                                                                onClick={() => handleDeleteRoom(room)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Room
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
                                <Building className="text-muted-foreground mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-semibold">No rooms found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchRoom ? 'Try adjusting your search criteria.' : 'Get started by creating your first room.'}
                                </p>
                                {!searchRoom && (
                                    <Button onClick={handleAddRoom}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Room
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {!isLoading && data.rooms.total > data.rooms.data.length && (
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Page {data.rooms.current_page} of {data.rooms.last_page}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(data.rooms.current_page - 1)} disabled={data.rooms.current_page === 1}>
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(data.rooms.current_page + 1)}
                                disabled={data.rooms.current_page === data.rooms.last_page}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Room Dialog */}
            <RoomDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} roomData={editingRoom} onSave={handleSaveRoom} errors={saveErrors} />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Room</DialogTitle>
                        <DialogDescription>Are you sure you want to delete "{roomToDelete?.name}"? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteRoom} disabled={isProcessing}>
                            {isProcessing ? 'Deleting...' : 'Delete Room'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}

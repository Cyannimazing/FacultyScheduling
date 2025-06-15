import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Building, Calendar, ChevronLeft, ChevronRight, DoorOpen, Edit, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Room',
        href: '/room',
    },
];

// Sample data for rooms
const sampleData = [
    {
        id: 1,
        name: 'Room 101',
        created_at: '2025-06-10 09:00',
        updated_at: '2025-06-11 14:30',
    },
    {
        id: 2,
        name: 'Room 102',
        created_at: '2025-06-09 11:00',
        updated_at: '2025-06-12 10:15',
    },
    {
        id: 3,
        name: 'Computer Laboratory 1',
        created_at: '2025-06-08 13:00',
        updated_at: '2025-06-11 16:45',
    },
    {
        id: 4,
        name: 'Physics Laboratory',
        created_at: '2025-06-07 15:30',
        updated_at: '2025-06-10 09:20',
    },
    {
        id: 5,
        name: 'Auditorium',
        created_at: '2025-06-06 10:45',
        updated_at: '2025-06-09 16:15',
    },
    {
        id: 6,
        name: 'Conference Room A',
        created_at: '2025-06-05 14:20',
        updated_at: '2025-06-08 11:30',
    },
    {
        id: 7,
        name: 'Room 201',
        created_at: '2025-06-04 12:00',
        updated_at: '2025-06-07 13:45',
    },
    {
        id: 8,
        name: 'Chemistry Laboratory',
        created_at: '2025-06-03 10:30',
        updated_at: '2025-06-06 09:15',
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

function RoomDialog({ isOpen, onClose, roomData = null, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
    });

    // Update form data when roomData prop changes (for edit mode)
    React.useEffect(() => {
        if (roomData) {
            setFormData({
                name: roomData.name || '',
            });
        } else {
            // Reset form for add mode
            setFormData({ name: '' });
        }
    }, [roomData]);

    const handleSave = () => {
        if (formData.name) {
            onSave(formData);
            onClose();
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
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [roomsData, setRoomsData] = useState(sampleData);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); // Add processing state

    const itemsPerPage = 5;

    // Filter data based on search
    const filteredData = roomsData.filter((room) => {
        return room.name.toLowerCase().includes(searchTerm.toLowerCase());
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

    const handleAddRoom = () => {
        setEditingRoom(null);
        setIsDialogOpen(true);
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setIsDialogOpen(true);
    };

    const handleSaveRoom = (formData) => {
        if (editingRoom) {
            // Update existing room
            setRoomsData((prevData) =>
                prevData.map((room) =>
                    room.id === editingRoom.id
                        ? {
                              ...room,
                              ...formData,
                              updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                          }
                        : room,
                ),
            );
            console.log('Room updated:', formData);
        } else {
            // Add new room
            const newRoom = {
                id: Math.max(...roomsData.map((r) => r.id), 0) + 1,
                ...formData,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };
            setRoomsData((prevData) => [...prevData, newRoom]);
            console.log('Room added:', formData);
        }

        // Reset current page to 1 if adding new room
        if (!editingRoom) {
            setCurrentPage(1);
        }
    };

    const handleDeleteRoom = (room) => {
        setRoomToDelete(room);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteRoom = () => {
        if (roomToDelete) {
            setIsProcessing(true); // Set processing to true

            // Simulate API call delay
            setTimeout(() => {
                setRoomsData((prevData) => prevData.filter((room) => room.id !== roomToDelete.id));

                // Adjust current page if necessary
                const newFilteredData = roomsData
                    .filter((room) => room.id !== roomToDelete.id)
                    .filter((room) => room.name.toLowerCase().includes(searchTerm.toLowerCase()));
                const newTotalPages = Math.ceil(newFilteredData.length / itemsPerPage);

                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                } else if (newFilteredData.length === 0) {
                    setCurrentPage(1);
                }

                console.log('Room deleted:', roomToDelete.name);

                setDeleteDialogOpen(false);
                setRoomToDelete(null);
                setIsProcessing(false); // Reset processing state
            }, 1000); // Simulate 1 second API call
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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Showing {paginatedData.length} of {filteredData.length} rooms
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
                                            <TableHead className="w-[100px]">ID</TableHead>
                                            <TableHead>Room Name</TableHead>
                                            <TableHead className="text-center">Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.map((room) => (
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
                                    {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first room.'}
                                </p>
                                {!searchTerm && (
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

            {/* Add/Edit Room Dialog */}
            <RoomDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} roomData={editingRoom} onSave={handleSaveRoom} />

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

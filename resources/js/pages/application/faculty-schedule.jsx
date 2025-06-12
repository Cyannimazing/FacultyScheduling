import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Faculty Schedule',
        href: '/faculty-schedule',
    },
];

export default function FacultySchedule() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faculty Schedule" />
            <div className="flex h-full items-center justify-center rounded-xl p-4">
                <h1>My Faculty Schedule</h1>
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full items-center justify-center rounded-xl p-4">
                <h1>My Dashboard</h1>
            </div>
        </AppLayout>
    );
}

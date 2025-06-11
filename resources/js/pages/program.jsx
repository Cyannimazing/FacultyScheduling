import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Program',
        href: '/dashboard',
    },
];

export default function Program() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Program" />
            <div className="flex h-full items-center justify-center rounded-xl p-4">
                <h1>My Program</h1>
            </div>
        </AppLayout>
    );
}

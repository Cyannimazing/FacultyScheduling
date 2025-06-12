import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Subject Allocation',
        href: '/subject-allocation',
    },
];

export default function SubjectAllocation() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subject Allocation" />
            <div className="flex h-full items-center justify-center rounded-xl p-4">
                <h1>My Subject Allocation</h1>
            </div>
        </AppLayout>
    );
}

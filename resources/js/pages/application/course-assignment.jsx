import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Course Assignment',
        href: '/course-assignment',
    },
];

export default function CourseAssignment() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course Assignment" />
            <div className="flex h-full items-center justify-center rounded-xl p-4">
                <h1>My Course Assignment</h1>
            </div>
        </AppLayout>
    );
}

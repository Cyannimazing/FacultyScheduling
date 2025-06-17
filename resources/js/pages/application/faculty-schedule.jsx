import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Faculty Schedule',
        href: '/faculty-schedule',
    },
];

export default function FacultySchedule() {
  const [data, setData] = useState([]); // Initialize with an empty array
  const sy_term_id = 2
  const leacturer_id = 2
  const day = "SUNDAY"
//   // Fetch subjects
//   useEffect(() => {
//     fetch(`api/subject-by-lecturer-schoolyear/${sy_term_id}/${leacturer_id}`)
//       .then((response) => response.json())
//       .then((data) => setData(data))
//   }, []);

//   // Fetch classes when data is set and available
//   useEffect(() => {
//     console.log(data)
//     if (data.length > 0 && data[0].prog_code) {
//       fetch(`api/classes-by-prog-code/${data[0].prog_code}`)
//         .then((response) => response.json())
//         .then((classes) => console.log(classes))
//     }
//   }, [data]);

    // fetch(`api/time-slot-by-day/${day}`)
    // .then(respose => respose.json())
    // .then(timeSlot => console.log(timeSlot))


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faculty Schedule" />
            <div className="flex h-full items-center justify-center rounded-xl p-4">
                <h1>My Faculty Schedule</h1>

            </div>
        </AppLayout>
    );
}

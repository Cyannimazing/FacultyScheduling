import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Calendar, Calendar1, CalendarPlus, Clipboard, DoorOpen, LibraryBig, NotebookIcon, PlusCircle, Shapes, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems = [
    {
        title: 'Faculty Schedule',
        url: '/faculty-schedule',
        icon: CalendarPlus,
    },
    {
        title: 'Class Schedule',
        url: '/class-schedule',
        icon: Calendar,
    },
    {
        title: 'Subject Allocation',
        url: '/subject-allocation',
        icon: PlusCircle,
    },
    {
        title: 'Course Assignment',
        url: '/course-assignment',
        icon: Shapes,
    },
];

const InputNavItems = [
    {
        title: 'Term',
        url: '/term',
        icon: Calendar1,
    },
    {
        title: 'Calendar',
        url: '/calendar',
        icon: DoorOpen,
    },
    {
        title: 'Program',
        url: '/program',
        icon: NotebookIcon,
    },
    {
        title: 'Lecturer',
        url: '/lecturer',
        icon: Users,
    },
    {
        title: 'Class',
        url: '/class',
        icon: Clipboard,
    },
    {
        title: 'Subject',
        url: '/subject',
        icon: LibraryBig,
    },
    {
        title: 'Room',
        url: '/room',
        icon: DoorOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} title={'Main Menu'} />
                <NavMain items={InputNavItems} title={'Entry Control'} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

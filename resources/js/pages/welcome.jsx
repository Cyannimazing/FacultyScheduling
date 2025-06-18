import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Faculty Scheduling Management" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
                {/* Modern Header */}
                <header className="relative z-50">
                    <nav className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        FacultyScheduler
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Management System
                                    </p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('faculty-schedule')}
                                        className="group inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105"
                                    >
                                        <svg className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="group inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-6 py-2.5 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:border-blue-300 hover:text-blue-600 hover:shadow-lg dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-blue-400 dark:hover:text-blue-400"
                                    >
                                        <svg className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="relative">
                    {/* Background decorations */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl"></div>
                    </div>

                    <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                        {/* Hero Content */}
                        <div className="text-center">
                            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl">
                                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>

                            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl">
                                <span className="block">Faculty Scheduling</span>
                                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Made Simple
                                </span>
                            </h1>

                            <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-slate-600 dark:text-slate-300">
                                Transform your academic scheduling with our intelligent platform.
                                Effortlessly manage faculty schedules, allocate subjects, and optimize
                                classroom resources—all in one beautiful interface.
                            </p>

                            {/* CTA Buttons */}
                            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {auth.user ? (
                                    <Link
                                        href={route('faculty-schedule')}
                                        className="group inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/25 hover:scale-105"
                                    >
                                        <svg className="mr-3 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                        Access Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="group inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/25 hover:scale-105"
                                        >
                                            <svg className="mr-3 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                            Get Started Now
                                        </Link>
                                        <div className="rounded-full bg-white/60 px-6 py-3 text-sm text-slate-600 backdrop-blur-sm dark:bg-slate-800/60 dark:text-slate-400">
                                            ✨ No credit card required
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Feature Grid */}
                        <div className="mt-24">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                                    Everything you need to manage
                                    <span className="block text-blue-600 dark:text-blue-400">academic scheduling</span>
                                </h2>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {/* Faculty Management */}
                                <div className="group relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-2xl hover:scale-105 dark:bg-slate-800/80 dark:hover:bg-slate-800">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
                                    <div className="relative">
                                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                            Faculty Management
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Comprehensive lecturer profiles with schedule tracking and workload optimization.
                                        </p>
                                    </div>
                                </div>

                                {/* Subject Allocation */}
                                <div className="group relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-2xl hover:scale-105 dark:bg-slate-800/80 dark:hover:bg-slate-800">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5"></div>
                                    <div className="relative">
                                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg">
                                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                            Smart Allocation
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Intelligent subject-to-lecturer matching across programs with conflict detection.
                                        </p>
                                    </div>
                                </div>

                                {/* Schedule Management */}
                                <div className="group relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-2xl hover:scale-105 dark:bg-slate-800/80 dark:hover:bg-slate-800">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5"></div>
                                    <div className="relative">
                                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg">
                                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h1a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h1z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                            Dynamic Scheduling
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Real-time schedule visualization with drag-and-drop functionality and instant updates.
                                        </p>
                                    </div>
                                </div>

                                {/* Resource Management */}
                                <div className="group relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-2xl hover:scale-105 dark:bg-slate-800/80 dark:hover:bg-slate-800">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5"></div>
                                    <div className="relative">
                                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                            Resource Optimization
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Maximize classroom utilization with smart room allocation and capacity management.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="mt-24">
                            <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-16 text-center shadow-2xl">
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    Trusted by Educational Institutions
                                </h3>
                                <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto">
                                    Streamlining academic operations with powerful scheduling tools
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <div className="text-white">
                                        <div className="text-4xl font-bold mb-2">📚</div>
                                        <div className="text-2xl font-bold mb-1">Subjects</div>
                                        <div className="text-blue-200 text-sm">Course Management</div>
                                    </div>
                                    <div className="text-white">
                                        <div className="text-4xl font-bold mb-2">👨‍🏫</div>
                                        <div className="text-2xl font-bold mb-1">Faculty</div>
                                        <div className="text-blue-200 text-sm">Professional Profiles</div>
                                    </div>
                                    <div className="text-white">
                                        <div className="text-4xl font-bold mb-2">🏫</div>
                                        <div className="text-2xl font-bold mb-1">Classrooms</div>
                                        <div className="text-blue-200 text-sm">Smart Allocation</div>
                                    </div>
                                    <div className="text-white">
                                        <div className="text-4xl font-bold mb-2">⚡</div>
                                        <div className="text-2xl font-bold mb-1">Automated</div>
                                        <div className="text-blue-200 text-sm">Scheduling Engine</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50">
                    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                        <div className="text-center">
                            <p className="text-slate-600 dark:text-slate-400">
                                © 2025 Faculty Scheduling Management System.
                                <span className="text-blue-600 dark:text-blue-400"> Designed for academic excellence.</span>
                                <br />
                                <p className='text-slate-600/50 '>
                                    Designed by <span className='font-semibold underline'>Team Sikaynamis</span>
                                </p>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl"></div>
                </div>

                {/* Header */}
                <header className="relative z-50">
                    <nav className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            {/* Logo */}
                            <Link href={route('home')} className="flex items-center space-x-3">
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
                            </Link>

                            {/* Back to Home */}
                            <Link
                                href={route('home')}
                                className="group inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-6 py-2.5 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:border-blue-300 hover:text-blue-600 hover:shadow-lg dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-blue-400 dark:hover:text-blue-400"
                            >
                                <svg className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </nav>
                </header>

                {/* Main Content */}
                <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        {/* Login Card */}
                        <div className="relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm border border-white/20 dark:bg-slate-800/80 dark:border-slate-700/20">
                            {/* Card Background Decoration */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>

                            <div className="relative">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl">
                                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                        Welcome Back
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Sign in to your account to continue
                                    </p>
                                </div>

                                {/* Status Message */}
                                {status && (
                                    <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                                        <div className="text-sm font-medium text-green-800">{status}</div>
                                    </div>
                                )}

                                {/* Login Form */}
                                <form className="space-y-6" onSubmit={submit}>
                                    <div className="space-y-4">
                                        {/* Email Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                Email Address
                                            </Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                </div>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="Enter your email"
                                                    className="pl-10 h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700/50"
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    Password
                                                </Label>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Enter your password"
                                                    className="pl-10 h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700/50"
                                                />
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                checked={data.remember}
                                                onClick={() => setData('remember', !data.remember)}
                                                tabIndex={3}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                                            />
                                            <Label htmlFor="remember" className="text-sm text-slate-700 dark:text-slate-300">
                                                Remember me for 30 days
                                            </Label>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                                Signing In...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                                Sign In
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

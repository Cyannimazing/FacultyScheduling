export default function AppLogo() {
    return (
        <div className="flex items-center gap-4 py-4">
            <img src="/logo.jpg" alt="App Logo" className="size-8" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Faculty Scheduling</span>
            </div>
        </div>
    );
}


import { FolderKanban, ListTodo } from "lucide-react";

export default function DashboardLoading() {
    return (
        <main
            className="min-h-full bg-slate-50/70 p-4 sm:p-6 lg:p-8"
            aria-label="Đang tải dashboard"
            aria-busy="true"
        >
            <div className="mx-auto max-w-7xl space-y-8 animate-pulse">
                {/* Header */}
                <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                        <div className="h-4 w-32 rounded bg-slate-200" />
                        <div className="h-9 w-64 max-w-full rounded-lg bg-slate-200" />
                        <div className="h-4 w-80 max-w-full rounded bg-slate-200" />
                    </div>

                    <div className="h-11 w-36 rounded-xl bg-violet-200" />
                </header>

                {/* Statistics */}
                <section>
                    <div className="mb-4 space-y-2">
                        <div className="h-5 w-32 rounded bg-slate-200" />
                        <div className="h-4 w-64 rounded bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <div className="h-4 w-28 rounded bg-slate-200" />
                                        <div className="h-9 w-16 rounded bg-slate-200" />
                                    </div>

                                    <div className="size-11 rounded-xl bg-slate-200" />
                                </div>

                                <div className="mt-5 border-t border-slate-100 pt-3">
                                    <div className="h-3 w-36 rounded bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects */}
                <section>
                    <div className="mb-5 flex items-end justify-between">
                        <div className="space-y-2">
                            <div className="h-5 w-36 rounded bg-slate-200" />
                            <div className="h-4 w-64 max-w-full rounded bg-slate-200" />
                        </div>

                        <div className="h-9 w-24 rounded-lg bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-300">
                                        <FolderKanban size={23} />
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 w-40 max-w-full rounded bg-slate-200" />
                                        <div className="h-4 w-full rounded bg-slate-100" />
                                        <div className="h-4 w-3/4 rounded bg-slate-100" />
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div className="flex justify-between">
                                        <div className="h-4 w-32 rounded bg-slate-100" />
                                        <div className="h-4 w-10 rounded bg-slate-200" />
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-100" />
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <div className="flex items-center gap-2">
                                        <ListTodo
                                            size={16}
                                            className="text-slate-300"
                                        />
                                        <div className="h-4 w-28 rounded bg-slate-100" />
                                    </div>
                                    <div className="h-4 w-20 rounded bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
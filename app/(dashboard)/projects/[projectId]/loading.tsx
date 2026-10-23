
import {
    FolderKanban,
    ListTodo,
    Users,
} from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
        />
    );
}

export default function ProjectLoading() {
    return (
        <main
            className="min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8"
            aria-label="Đang tải dự án"
            aria-busy="true"
        >
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-36" />
                </div>

                {/* Project information */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-200">
                                <FolderKanban size={28} />
                            </div>

                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-7 w-64 max-w-full" />
                                <Skeleton className="h-4 w-80 max-w-full" />
                                <Skeleton className="h-4 w-60 max-w-full" />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-24 rounded-xl" />
                            <Skeleton className="h-10 w-36 rounded-xl" />
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                        {[
                            { label: "Công việc", icon: ListTodo },
                            { label: "Hoàn thành", icon: FolderKanban },
                            { label: "Thành viên", icon: Users },
                        ].map(({ label, icon: Icon }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-slate-200 text-slate-400">
                                    <Icon size={20} />
                                </div>

                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-6 w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Members */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <Skeleton className="h-5 w-40" />

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 rounded-xl border border-slate-100 p-4"
                            >
                                <Skeleton className="size-10 shrink-0 rounded-full" />

                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-44 max-w-full" />
                                </div>

                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Task list */}
                <section className="space-y-5">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-56" />
                    </div>

                    {/* Filters */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-10 rounded-xl"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <article
                                key={index}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <Skeleton className="h-5 w-56 max-w-full" />
                                            <Skeleton className="h-4 w-full max-w-2xl" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>

                                        <Skeleton className="h-7 w-24 shrink-0 rounded-lg" />
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>

                                    <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                                        <Skeleton className="h-8 w-32 rounded-lg" />

                                        <div className="flex gap-2">
                                            <Skeleton className="h-9 w-24 rounded-lg" />
                                            <Skeleton className="h-9 w-20 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="size-9 rounded-lg"
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
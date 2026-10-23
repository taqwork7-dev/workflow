import { connection } from "next/server";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDashboardData } from "@/features/projects/queries/get-dashboard-data";
import {
    FolderKanban,
    ListTodo,
    Clock3,
    CheckCircle2,
    CircleAlert,
    CalendarDays,
    Plus,
    ArrowRight,
} from "lucide-react";

const numberFormatter = new Intl.NumberFormat("vi-VN");

const statStyles = [
    {
        label: "Tổng dự án",
        description: "Dự án bạn tham gia",
        icon: FolderKanban,
        iconClass: "bg-violet-50 text-violet-600",
    },
    {
        label: "Tổng công việc",
        description: "Tất cả nhiệm vụ",
        icon: ListTodo,
        iconClass: "bg-blue-50 text-blue-600",
    },
    {
        label: "Đang thực hiện",
        description: "Công việc đang xử lý",
        icon: Clock3,
        iconClass: "bg-amber-50 text-amber-600",
    },
    {
        label: "Hoàn thành",
        description: "Công việc đã hoàn tất",
        icon: CheckCircle2,
        iconClass: "bg-emerald-50 text-emerald-600",
    },
];

function getProgress(doneCount: number, taskCount: number) {
    if (taskCount === 0) return 0;

    return Math.round((doneCount / taskCount) * 100);
}

export default async function DashboardPage() {
    await connection();

    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const data = await getDashboardData(session.user.id);

    if (!data) {
        return (
            <main className="min-h-full bg-slate-50 p-6 md:p-8">
                <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                        <CircleAlert size={26} strokeWidth={1.8} />
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-slate-900">
                        Không thể tải dữ liệu
                    </h1>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Không tìm thấy dữ liệu tài khoản. Vui lòng kiểm tra dữ
                        liệu người dùng và cấu hình database.
                    </p>
                </div>
            </main>
        );
    }

    const stats = [
        data.stats.totalProjects,
        data.stats.totalTasks,
        data.stats.inProgress,
        data.stats.done,
    ];

    const firstName =
        session.user.name?.trim().split(/\s+/).at(-1) || "bạn";

    const dateLabel = new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    return (
        <main className="min-h-full bg-slate-50/70 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Welcome header */}
                <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>Workspace</span>
                            <span className="text-slate-300">/</span>
                            <span className="font-medium text-violet-600">
                                Tổng quan
                            </span>
                        </div>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Xin chào, {firstName}
                            <span className="ml-2">👋</span>
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                            Đây là tổng quan về các dự án và công việc của bạn.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 sm:flex">
                            <Clock3 size={16} />
                            {dateLabel}
                        </div>

                        <Link
                            href="/projects/new"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                        >
                            <Plus size={18} />
                            Tạo dự án
                        </Link>
                    </div>
                </header>

                {/* Statistics */}
                <section aria-labelledby="stats-heading">
                    <div className="mb-4">
                        <h2
                            id="stats-heading"
                            className="text-base font-bold text-slate-900"
                        >
                            Tổng quan
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Tình hình công việc của bạn hiện tại.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statStyles.map((stat, index) => {
                            const Icon = stat.icon;

                            return (
                                <article
                                    key={stat.label}
                                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                {stat.label}
                                            </p>
                                            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                                {numberFormatter.format(stats[index])}
                                            </p>
                                        </div>

                                        <div
                                            className={`flex size-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                                        >
                                            <Icon size={22} strokeWidth={1.8} />
                                        </div>
                                    </div>

                                    <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                                        {stat.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* Projects */}
                <section aria-labelledby="projects-heading">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2
                                id="projects-heading"
                                className="text-base font-bold text-slate-900"
                            >
                                Dự án của bạn
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Theo dõi tiến độ và tiếp tục công việc đang thực hiện.
                            </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <span className="rounded-lg bg-white px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200">
                                <span className="font-semibold text-slate-900">
                                    {numberFormatter.format(data.projects.length)}
                                </span>{" "}
                                dự án
                            </span>

                            <Link
                                href="/projects/new"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 transition hover:text-violet-700"
                            >
                                <Plus size={16} />
                                Tạo mới
                            </Link>
                        </div>
                    </div>

                    {data.projects.length === 0 ? (
                        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                                <FolderKanban size={30} strokeWidth={1.7} />
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                Bắt đầu với dự án đầu tiên
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Tạo một dự án để tổ chức nhiệm vụ, theo dõi tiến
                                độ và quản lý công việc hiệu quả hơn.
                            </p>

                            <Link
                                href="/projects/new"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                            >
                                <Plus size={18} />
                                Tạo dự án đầu tiên
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {data.projects.map((project) => {
                                const progress = getProgress(
                                    project.doneCount,
                                    project.taskCount,
                                );

                                return (
                                    <article
                                        key={project.id}
                                        className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/40 sm:p-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100">
                                                <FolderKanban
                                                    size={24}
                                                    strokeWidth={1.8}
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                    <h3 className="min-w-0 text-base font-bold text-slate-900">
                                                        <Link
                                                            href={`/projects/${project.id}`}
                                                            className="transition hover:text-violet-600 focus-visible:outline-2 focus-visible:outline-violet-600"
                                                        >
                                                            {project.name}
                                                        </Link>
                                                    </h3>

                                                    <span
                                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            progress === 100
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : "bg-violet-50 text-violet-700"
                                                        }`}
                                                    >
                                                        {progress === 100
                                                            ? "Hoàn thành"
                                                            : "Đang theo dõi"}
                                                    </span>
                                                </div>

                                                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                                                    {project.description ||
                                                        "Chưa có mô tả cho dự án này."}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="mt-6">
                                            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                                <span className="text-slate-500">
                                                    Tiến độ hoàn thành
                                                </span>
                                                <span className="font-semibold tabular-nums text-slate-900">
                                                    {progress}%
                                                </span>
                                            </div>

                                            <div
                                                className="h-2 overflow-hidden rounded-full bg-slate-100"
                                                role="progressbar"
                                                aria-label={`Tiến độ dự án ${project.name}`}
                                                aria-valuenow={progress}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <div
                                                    className={`h-full rounded-full transition-all ${
                                                        progress === 100
                                                            ? "bg-emerald-500"
                                                            : "bg-violet-500"
                                                    }`}
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Project metadata */}
                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <ListTodo size={17} />
                                                <span>
                                                    <span className="font-semibold text-slate-700">
                                                        {numberFormatter.format(
                                                            project.doneCount,
                                                        )}
                                                    </span>{" "}
                                                    /{" "}
                                                    {numberFormatter.format(
                                                        project.taskCount,
                                                    )}{" "}
                                                    công việc
                                                </span>
                                            </div>

                                            <Link
                                                href={`/projects/${project.id}`}
                                                className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 transition hover:text-violet-700"
                                            >
                                                Xem dự án
                                                <ArrowRight
                                                    size={16}
                                                    className="transition-transform group-hover:translate-x-0.5"
                                                />
                                            </Link>
                                        </div>

                                        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                                            <CalendarDays size={14} />
                                            Cập nhật lần cuối:{" "}
                                            {new Intl.DateTimeFormat("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            }).format(new Date(project.updatedAt))}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Bottom note */}
                <footer className="border-t border-slate-200 pt-5">
                    <p className="text-center text-xs text-slate-400">
                        TaskFlow · Tổ chức công việc, làm chủ tiến độ.
                    </p>
                </footer>
            </div>
        </main>
    );
}
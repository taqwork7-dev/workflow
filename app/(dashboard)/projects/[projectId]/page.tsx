import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { auth } from "@/auth";
import { ProjectRole } from "@/app/generated/prisma/client";

import { AddProjectMemberForm } from "@/components/projects/add-project-member-form";
import { RemoveProjectMemberButton } from "@/components/projects/remove-project-member-button";
import { UpdateProjectMemberRoleForm } from "@/components/projects/update-project-member-role-form";

import { DeleteTaskButton } from "@/features/tasks/components/delete-task-button";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { TaskPagination } from "@/features/tasks/components/task-pagination";
import { TaskStatusSelect } from "@/features/tasks/components/task-status-select";
import { getFilteredTasks } from "@/features/tasks/queries/get-filtered-tasks";

type ProjectPageProps = {
    params: Promise<{
        projectId: string;
    }>;
    searchParams: Promise<{
        search?: string;
        status?: string;
        priority?: string;
        page?: string;
    }>;
};

const statusLabels: Record<string, string> = {
    TODO: "Cần làm",
    IN_PROGRESS: "Đang thực hiện",
    DONE: "Hoàn thành",
};

const priorityLabels: Record<string, string> = {
    LOW: "Thấp",
    MEDIUM: "Trung bình",
    HIGH: "Cao",
    URGENT: "Khẩn cấp",
};

const priorityStyles: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
};

export default async function ProjectPage({
    params,
    searchParams,
}: ProjectPageProps) {
    await connection();

    const [{ projectId }, query] = await Promise.all([
        params,
        searchParams,
    ]);
    const rawFilters = {
        search: Array.isArray(query.search)
            ? query.search[0]
            : query.search,
        status: Array.isArray(query.status)
            ? query.status[0]
            : query.status,
        priority: Array.isArray(query.priority)
            ? query.priority[0]
            : query.priority,
        page: Array.isArray(query.page)
            ? query.page[0]
            : query.page,
    };

    const result = await getFilteredTasks(projectId, rawFilters);

    if (!result) {
        notFound();
    }

    const { project, filters, pagination } = result;

    const session = await auth();
    const currentUserId = session?.user?.id;

    const currentMembership = project.members.find(
        (member) => member.user.id === currentUserId,
    );

    const currentRole = currentMembership?.role;

    const isOwner = currentRole === ProjectRole.OWNER;

    const canManageProject = isOwner;

    const canManageTasks =
        currentRole === ProjectRole.OWNER ||
        currentRole === ProjectRole.ADMIN;

    const hasActiveFilters =
        Boolean(filters.search) ||
        filters.status !== "ALL" ||
        filters.priority !== "ALL";

    const isEmptyProject =
        pagination.totalTasks === 0 && !hasActiveFilters;


    return (
        <main className="mx-auto w-full max-w-6xl space-y-8 pb-10">
            {/* Project header */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="h-1 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-500" />

                <div className="p-6 sm:p-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
                    >
                        <span aria-hidden="true">←</span>
                        Quay lại Dashboard
                    </Link>

                    <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    Dự án
                                </span>

                                {currentRole && (
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                        {currentRole === "OWNER"
                                            ? "Chủ dự án"
                                            : currentRole === "ADMIN"
                                                ? "Quản trị viên"
                                                : "Thành viên"}
                                    </span>
                                )}
                            </div>

                            <h1 className="wrap-break-word text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                {project.name}
                            </h1>

                            <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-gray-500">
                                {project.description ||
                                    "Chưa có mô tả cho dự án này."}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                                <span className="inline-flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-blue-500" />
                                    {project.members.length} thành viên
                                </span>

                                <span className="inline-flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-emerald-500" />
                                    {pagination.totalTasks} công việc
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                            {canManageProject && (
                                <Link
                                    href={`/projects/${project.id}/edit`}
                                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                                >
                                    Sửa dự án
                                </Link>
                            )}

                            {canManageTasks && (
                                <Link
                                    href={`/projects/${project.id}/tasks/new`}
                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    <span className="text-lg leading-none">+</span>
                                    Tạo công việc
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Project members */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">
                            Thành viên dự án
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Quản lý những người cộng tác trong dự án.
                        </p>
                    </div>

                    <span className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                        {project.members.length} thành viên
                    </span>
                </div>

                <div className="p-5 sm:p-6">
                    {project.members.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {project.members.map((member) => {
                                const displayName =
                                    member.user.name ||
                                    member.user.email ||
                                    "Người dùng";

                                return (
                                    <div
                                        key={member.user.id}
                                        className="min-w-0 rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/20"
                                    >
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 ring-4 ring-blue-50">
                                                {displayName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-gray-900">
                                                    {displayName}
                                                </p>

                                                <p className="mt-1 truncate text-xs text-gray-500">
                                                    {member.user.email}
                                                </p>

                                                <span
                                                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${member.role === "OWNER"
                                                            ? "bg-violet-50 text-violet-700"
                                                            : member.role === "ADMIN"
                                                                ? "bg-blue-50 text-blue-700"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {member.role === "OWNER"
                                                        ? "Chủ dự án"
                                                        : member.role === "ADMIN"
                                                            ? "Quản trị viên"
                                                            : "Thành viên"}
                                                </span>
                                            </div>
                                        </div>

                                        {isOwner &&
                                            member.role !== "OWNER" && (
                                                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                                                    <UpdateProjectMemberRoleForm
                                                        projectId={project.id}
                                                        memberId={member.user.id}
                                                        currentRole={member.role}
                                                    />

                                                    <RemoveProjectMemberButton
                                                        projectId={project.id}
                                                        memberId={member.user.id}
                                                        memberName={
                                                            member.user.name ||
                                                            member.user.email ||
                                                            "thành viên này"
                                                        }
                                                    />
                                                </div>
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="py-6 text-center text-sm text-gray-500">
                            Chưa có thành viên trong dự án.
                        </p>
                    )}

                    {isOwner && (
                        <div className="mt-6 border-t border-gray-100 pt-5">
                            <AddProjectMemberForm projectId={project.id} />
                        </div>
                    )}
                </div>
            </section>

            {/* Task list */}
            <section className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-gray-900">
                            Công việc
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {pagination.totalTasks} công việc phù hợp
                            {hasActiveFilters
                                ? " với bộ lọc hiện tại"
                                : " trong dự án"}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                    <TaskFilters
                        projectId={project.id}
                        search={filters.search}
                        status={filters.status}
                        priority={filters.priority}
                    />
                </div>

                {isEmptyProject ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-light text-blue-600">
                            +
                        </div>

                        <h3 className="mt-5 font-semibold text-gray-900">
                            Chưa có công việc nào
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                            Tạo công việc đầu tiên để bắt đầu quản lý tiến độ
                            và phối hợp với các thành viên.
                        </p>

                        {canManageTasks && (
                            <Link
                                href={`/projects/${project.id}/tasks/new`}
                                className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                <span className="text-lg leading-none">+</span>
                                Tạo công việc đầu tiên
                            </Link>
                        )}
                    </div>
                ) : pagination.totalTasks === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
                        <h3 className="font-semibold text-gray-900">
                            Không tìm thấy công việc
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                            Hãy thử từ khóa khác hoặc xóa bộ lọc để xem toàn bộ
                            công việc.
                        </p>

                        <Link
                            href={`/projects/${project.id}`}
                            className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Xóa bộ lọc
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {project.tasks.map((task) => (
                                <article
                                    key={task.id}
                                    className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md sm:p-5"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="wrap-break-word font-semibold leading-6 text-gray-900">
                                                    {task.title}
                                                </h3>

                                                {task.description && (
                                                    <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-gray-500">
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>

                                            <span
                                                className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-transparent ${priorityStyles[task.priority] ??
                                                    "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {priorityLabels[task.priority] ??
                                                    task.priority}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
                                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                                                <span>
                                                    Người thực hiện:{" "}
                                                    <span className="font-medium text-gray-800">
                                                        {task.assignee?.name ||
                                                            task.assignee?.email ||
                                                            "Chưa giao"}
                                                    </span>
                                                </span>

                                                {task.dueDate && (
                                                    <span>
                                                        Hạn:{" "}
                                                        <time
                                                            dateTime={new Date(
                                                                task.dueDate,
                                                            ).toISOString()}
                                                        >
                                                            {new Date(
                                                                task.dueDate,
                                                            ).toLocaleDateString(
                                                                "vi-VN",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                    timeZone: "UTC",
                                                                },
                                                            )}
                                                        </time>
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-xs font-medium text-gray-500">
                                                        Trạng thái
                                                    </span>

                                                    {(canManageTasks ||
                                                        task.assigneeId ===
                                                        currentUserId) ? (
                                                        <TaskStatusSelect
                                                            taskId={task.id}
                                                            projectId={project.id}
                                                            status={task.status}
                                                        />
                                                    ) : (
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${task.status === "DONE"
                                                                    ? "bg-emerald-50 text-emerald-700"
                                                                    : task.status ===
                                                                        "IN_PROGRESS"
                                                                        ? "bg-blue-50 text-blue-700"
                                                                        : "bg-gray-100 text-gray-600"
                                                                }`}
                                                        >
                                                            {statusLabels[
                                                                task.status
                                                            ] ?? task.status}
                                                        </span>
                                                    )}

                                                    <span className="sr-only">
                                                        {statusLabels[task.status] ??
                                                            task.status}
                                                    </span>
                                                </div>

                                                {canManageTasks && (
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Link
                                                            href={`/projects/${project.id}/tasks/${task.id}/edit`}
                                                            className="inline-flex min-h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                                                        >
                                                            Sửa task
                                                        </Link>

                                                        <DeleteTaskButton
                                                            taskId={task.id}
                                                            projectId={project.id}
                                                            taskTitle={task.title}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="pt-2">
                            <TaskPagination
                                projectId={project.id}
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                            />
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
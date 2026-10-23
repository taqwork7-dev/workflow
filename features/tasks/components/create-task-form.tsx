
"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
    createTask,
    type CreateTaskState,
} from "@/features/tasks/actions/create-task";


type TaskFormMember = {
    user: {
        id: string;
        name: string | null;
        email: string | null;
    };
};


type CreateTaskFormProps = {
    projectId: string;
    projectName: string;
    members: TaskFormMember[];
};

const initialState: CreateTaskState = {};

export function CreateTaskForm({
    projectId,
    projectName,
    members,
}: CreateTaskFormProps) {
    const [state, formAction, isPending] = useActionState(
        createTask,
        initialState,
    );

    return (
        <form action={formAction} className="space-y-6">
            <p className="text-sm text-gray-500">
                Project: {projectName}
            </p>
            <input type="hidden" name="projectId" value={projectId} />

            {state.message && (
                <p
                    role="alert"
                    className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {state.message}
                </p>
            )}

            <div>
                <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Tên công việc
                </label>
                <input
                    id="title"
                    name="title"
                    required
                    minLength={2}
                    maxLength={150}
                    placeholder="Ví dụ: Thiết kế trang chủ"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
                {state.errors?.title?.map((error) => (
                    <p key={error} className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                ))}
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Mô tả
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    maxLength={2000}
                    placeholder="Mô tả công việc cần thực hiện..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
                {state.errors?.description?.map((error) => (
                    <p key={error} className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                ))}
            </div>

            <div>
                <label
                    htmlFor="priority"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Mức ưu tiên
                </label>
                <select
                    id="priority"
                    name="priority"
                    defaultValue="MEDIUM"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value="LOW">Thấp</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HIGH">Cao</option>
                    <option value="URGENT">Khẩn cấp</option>
                </select>
                {state.errors?.priority?.map((error) => (
                    <p key={error} className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                ))}
            </div>

            <div>
                <label
                    htmlFor="dueDate"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Ngày hết hạn
                </label>
                <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {state.errors?.dueDate?.map((error) => (
                    <p key={error} className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                ))}
            </div>

            <div>
                <label
                    htmlFor="assigneeId"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Người phụ trách
                </label>
                <select
                    id="assigneeId"
                    name="assigneeId"
                    defaultValue=""
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value="">Chưa giao cho ai</option>
                    {members.map(({ user }) => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>
                {state.errors?.assigneeId?.map((error) => (
                    <p key={error} className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                ))}
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? "Đang tạo..." : "Tạo công việc"}
                </button>

                <Link
                    href={`/projects/${projectId}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                    Hủy
                </Link>
            </div>
        </form>
    );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  updateTask,
  type UpdateTaskState,
} from "@/features/tasks/actions/update-task";

type EditTaskFormProps = {
  projectId: string;
  projectName: string;
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate: string;
    assigneeId: string | null;
  };
  members: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
};

const initialState: UpdateTaskState = {};

export function EditTaskForm({
  projectId,
  projectName,
  task,
  members,
}: EditTaskFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTask,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="taskId" value={task.id} />

      <p className="text-sm text-gray-500">
        Project: {projectName}
      </p>

      {state.message && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium">
          Tên công việc
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={2}
          maxLength={150}
          defaultValue={task.title}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
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
          className="mb-2 block text-sm font-medium"
        >
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={2000}
          defaultValue={task.description ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="priority" className="mb-2 block text-sm font-medium">
          Mức ưu tiên
        </label>
        <select
          id="priority"
          name="priority"
          defaultValue={task.priority}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="LOW">Thấp</option>
          <option value="MEDIUM">Trung bình</option>
          <option value="HIGH">Cao</option>
          <option value="URGENT">Khẩn cấp</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="mb-2 block text-sm font-medium">
          Ngày hết hạn
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          defaultValue={task.dueDate}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="assigneeId"
          className="mb-2 block text-sm font-medium"
        >
          Người phụ trách
        </label>
        <select
          id="assigneeId"
          name="assigneeId"
          defaultValue={task.assigneeId ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">Chưa giao cho ai</option>
          {members.map(({ user }) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
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

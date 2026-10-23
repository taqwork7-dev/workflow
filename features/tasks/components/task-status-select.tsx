
"use client";

import { useActionState } from "react";

import {
  updateTaskStatus,
  type UpdateTaskStatusState,
} from "@/features/tasks/actions/update-task-status";

type TaskStatusSelectProps = {
  taskId: string;
  projectId: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

const initialState: UpdateTaskStatusState = {};

const statusLabels = {
  TODO: "Cần làm",
  IN_PROGRESS: "Đang thực hiện",
  DONE: "Hoàn thành",
};

export function TaskStatusSelect({
  taskId,
  projectId,
  status,
}: TaskStatusSelectProps) {
  const [state, formAction, isPending] = useActionState(
    updateTaskStatus,
    initialState,
  );



  return (
    <form action={formAction} className="space-y-1">
      <input type="hidden" name="taskId" value={taskId} />
      <input type="hidden" name="projectId" value={projectId} />

      <select
        key={status}
        name="status"
        defaultValue={status}
        disabled={isPending}
        aria-label="Trạng thái công việc"
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-60"
        onChange={(event) => {
          const form = event.currentTarget.form;
          form?.requestSubmit();
        }}
      >
        {Object.entries(statusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {state.message && (
        <p
          role={state.success ? "status" : "alert"}
          className={`text-xs ${
            state.success ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

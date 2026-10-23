
"use client";

import { useActionState, useState } from "react";

import {
  deleteTask,
  type DeleteTaskState,
} from "@/features/tasks/actions/delete-task";

type DeleteTaskButtonProps = {
  taskId: string;
  projectId: string;
  taskTitle: string;
};

const initialState: DeleteTaskState = {};

export function DeleteTaskButton({
  taskId,
  projectId,
  taskTitle,
}: DeleteTaskButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [state, formAction, isPending] = useActionState(
    deleteTask,
    initialState,
  );

  if (state.success) {
    return (
      <p role="status" className="text-sm text-green-700">
        Đã xóa công việc.
      </p>
    );
  }

  if (!isConfirming) {
    return (
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Xóa task
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-700">
        Bạn có chắc muốn xóa “{taskTitle}”? Thao tác này không thể hoàn tác.
      </p>

      {state.message && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <form action={formAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="taskId" value={taskId} />
        <input type="hidden" name="projectId" value={projectId} />

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isPending ? "Đang xóa..." : "Xác nhận xóa"}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => setIsConfirming(false)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Hủy
        </button>
      </form>
    </div>
  );
}

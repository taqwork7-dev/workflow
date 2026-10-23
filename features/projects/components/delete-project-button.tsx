
"use client";

import { useState } from "react";
import { deleteProject } from "@/features/projects/actions/delete-project";

type DeleteProjectButtonProps = {
  projectId: string;
  projectName: string;
};

export function DeleteProjectButton({
  projectId,
  projectName,
}: DeleteProjectButtonProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="space-y-3">
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Xóa Project
        </button>
      ) : (
        <div
          role="group"
          aria-label="Xác nhận xóa project"
          className="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm font-medium text-red-800">
            Xóa “{projectName}”?
          </p>
          <p className="mt-1 text-sm text-red-700">
            Các task và thành viên liên quan cũng sẽ bị xóa. Hành động này không thể hoàn tác.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <form action={deleteProject}>
              <input type="hidden" name="projectId" value={projectId} />
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Xác nhận xóa
              </button>
            </form>

            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

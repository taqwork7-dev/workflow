
"use client";

import { useActionState } from "react";
import {
  updateProjectMemberRole,
  type UpdateProjectMemberRoleState,
} from "@/features/projects/actions/update-project-member-role";

const initialState: UpdateProjectMemberRoleState = {};

type Props = {
  projectId: string;
  memberId: string;
  currentRole: "ADMIN" | "MEMBER" | "OWNER";
};

export function UpdateProjectMemberRoleForm({
  projectId,
  memberId,
  currentRole,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    updateProjectMemberRole,
    initialState,
  );

  // OWNER không được đổi vai trò qua form này.
  if (currentRole === "OWNER") {
    return null;
  }

  return (
    <div className="space-y-2">
      <form action={formAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="memberId" value={memberId} />

        <select
          key={currentRole}
          name="role"
          defaultValue={currentRole}
          disabled={isPending}
          aria-label="Vai trò thành viên"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:opacity-50"
        >
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Member</option>
        </select>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : "Cập nhật vai trò"}
        </button>
      </form>

      {state.message && (
        <p
          role="status"
          className={`text-sm ${
            state.success ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}

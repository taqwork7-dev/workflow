
"use client";

import { useActionState } from "react";
import {
  removeProjectMember,
  type RemoveProjectMemberState,
} from "@/features/projects/actions/remove-project-member";

const initialState: RemoveProjectMemberState = {};

type Props = {
  projectId: string;
  memberId: string;
  memberName: string;
};

export function RemoveProjectMemberButton({
  projectId,
  memberId,
  memberName,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    removeProjectMember,
    initialState,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa ${memberName} khỏi project này?`,
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <div className="space-y-1">
      <form action={formAction} onSubmit={handleSubmit}>
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="memberId" value={memberId} />

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Đang xóa..." : "Xóa thành viên"}
        </button>
      </form>

      {state.message && (
        <p
          role="status"
          className={`text-sm ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}

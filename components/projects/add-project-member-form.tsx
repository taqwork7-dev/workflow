
"use client";

import { useActionState } from "react";
import {
  addProjectMember,
  type AddProjectMemberState,
} from "@/features/projects/actions/add-project-member";

const initialState: AddProjectMemberState = {};

type Props = {
  projectId: string;
};

export function AddProjectMemberForm({ projectId }: Props) {
  const [state, formAction, isPending] = useActionState(
    addProjectMember,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-xl border border-gray-200 p-5"
    >
      <input type="hidden" name="projectId" value={projectId} />

      <div>
        <h2 className="text-lg font-semibold">Thêm thành viên</h2>
        <p className="mt-1 text-sm text-gray-500">
          Người dùng phải đăng ký TaskFlow trước khi được thêm.
        </p>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="member-email"
          className="block text-sm font-medium"
        >
          Email thành viên
        </label>
        <input
          id="member-email"
          name="email"
          type="email"
          placeholder="example@gmail.com"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />
        {state.errors?.email?.map((error) => (
          <p key={error} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="member-role"
          className="block text-sm font-medium"
        >
          Vai trò
        </label>
        <select
          id="member-role"
          name="role"
          defaultValue="MEMBER"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

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

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Đang thêm..." : "Thêm thành viên"}
      </button>
    </form>
  );
}

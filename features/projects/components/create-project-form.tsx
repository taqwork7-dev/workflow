
"use client";

import { useActionState } from "react";
import { createProject } from "@/features/projects/actions/create-project";
import type { CreateProjectState } from "@/features/projects/actions/create-project";

const initialState: CreateProjectState = {
  success: false,
  message: "",
};

export function CreateProjectForm() {
  const [state, formAction, pending] = useActionState(
    createProject,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium"
        >
          Tên project
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          placeholder="Ví dụ: Website Redesign"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          aria-invalid={Boolean(state.errors?.name?.length)}
        />
        {state.errors?.name?.map((error) => (
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
          Mô tả <span className="text-gray-500">(không bắt buộc)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={500}
          placeholder="Mục tiêu và phạm vi của project..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          aria-invalid={Boolean(state.errors?.description?.length)}
        />
        {state.errors?.description?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className={
            state.success
              ? "text-sm text-green-700"
              : "text-sm text-red-600"
          }
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Đang tạo..." : "Tạo project"}
      </button>
    </form>
  );
}

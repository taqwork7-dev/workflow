
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateProject } from "@/features/projects/actions/update-project";
import type { UpdateProjectState } from "@/features/projects/actions/update-project";

type EditProjectFormProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
  };
};

const initialState: UpdateProjectState = {
  success: false,
  message: "",
};

export function EditProjectForm({ project }: EditProjectFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProject,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="projectId" value={project.id} />

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Tên project
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          defaultValue={project.name}
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
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={500}
          defaultValue={project.description ?? ""}
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
          className={state.success ? "text-sm text-green-700" : "text-sm text-red-600"}
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>

        <Link
          href={`/projects/${project.id}`}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}

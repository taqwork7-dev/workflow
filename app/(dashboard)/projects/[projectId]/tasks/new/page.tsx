
import Link from "next/link";
import { notFound } from "next/navigation";

import { CreateTaskForm } from "@/features/tasks/components/create-task-form";
import { getTaskFormData } from "@/features/tasks/queries/get-task-form-data";

type NewTaskPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function NewTaskPage({
  params,
}: NewTaskPageProps) {
  const { projectId } = await params;
  const project = await getTaskFormData(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Quay lại project
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Tạo công việc
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Thêm công việc vào project: {project.name}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <CreateTaskForm
          projectId={project.id}
          projectName={project.name}
          members={project.members}
        />
      </div>
    </div>
  );
}
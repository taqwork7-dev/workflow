
import { notFound } from "next/navigation";

import { EditTaskForm } from "@/features/tasks/components/edit-task-form";
import { getTaskForEdit } from "@/features/tasks/queries/get-task-for-edit";
import { connection } from "next/server";

type EditTaskPageProps = {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
};

export default async function EditTaskPage({
  params,
}: EditTaskPageProps) {
    await connection();
  const { projectId, taskId } = await params;
  const task = await getTaskForEdit(projectId, taskId);

  if (!task) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Chỉnh sửa công việc
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Cập nhật thông tin của task.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <EditTaskForm
          projectId={task.projectId}
          projectName={task.project.name}
          task={{
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate
              ? task.dueDate.toISOString().slice(0, 10)
              : "",
            assigneeId: task.assigneeId,
          }}
          members={task.project.members}
        />
      </div>
    </div>
  );
}

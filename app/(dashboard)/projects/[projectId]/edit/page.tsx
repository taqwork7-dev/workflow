
import { notFound } from "next/navigation";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProjectForEdit } from "@/features/projects/queries/get-project-for-edit";

type EditProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { projectId } = await params;
  const project = await getProjectForEdit(projectId);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">Chỉnh sửa Project</h1>
        <p className="mt-2 text-gray-600">
          Cập nhật tên và mô tả project.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <EditProjectForm project={project} />
      </section>
    </main>
  );
}

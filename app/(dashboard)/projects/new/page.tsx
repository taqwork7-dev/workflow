
import Link from "next/link";
import { CreateProjectForm } from "@/features/projects/components/create-project-form";

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6 md:p-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Quay lại Dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          Tạo Project
        </h1>

        <p className="mt-2 text-gray-600">
          Tạo một project mới để tổ chức công việc.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <CreateProjectForm />
      </section>
    </main>
  );
}

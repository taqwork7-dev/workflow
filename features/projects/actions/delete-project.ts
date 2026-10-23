
"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ProjectRole } from "@/app/generated/prisma/client";

const deleteProjectSchema = z.object({
  projectId: z.string().min(1),
});

export async function deleteProject(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const parsed = deleteProjectSchema.safeParse({
    projectId: formData.get("projectId"),
  });

  if (!parsed.success) {
    throw new Error("Project ID không hợp lệ.");
  }

  const { projectId } = parsed.data;

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId,
            role: ProjectRole.OWNER,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      throw new Error("Không tìm thấy project hoặc bạn không có quyền xóa.");
    }

    await prisma.project.delete({
      where: {
        id: project.id,
      },
    });
  } catch (error) {
    console.error("Delete project failed:", error);

    throw new Error(
      error instanceof Error &&
        error.message === "Không tìm thấy project hoặc bạn không có quyền xóa."
        ? error.message
        : "Không thể xóa project. Vui lòng thử lại.",
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect("/dashboard");
}

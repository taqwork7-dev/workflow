
"use server";

import { auth } from "@/auth";
import { ProjectRole } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { updateProjectSchema } from "@/features/projects/schemas/update-project-schema";

export type UpdateProjectState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    description?: string[];
  };
};

export async function updateProject(
  _prevState: UpdateProjectState,
  formData: FormData,
): Promise<UpdateProjectState> {
  // 1. Xác thực người dùng
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      message: "Vui lòng đăng nhập để cập nhật project.",
    };
  }

  // 2. Validate dữ liệu
  const parsed = updateProjectSchema.safeParse({
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { projectId, name, description } = parsed.data;

  try {
    // 3. Kiểm tra vai trò OWNER trong project
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!membership || membership.role !== ProjectRole.OWNER) {
      return {
        success: false,
        message: "Chỉ OWNER mới có quyền chỉnh sửa thông tin project.",
      };
    }

    // 4. Cập nhật project
    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name,
        description: description || null,
      },
    });

    // 5. Làm mới dữ liệu
    revalidatePath("/dashboard");
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/edit`);

    return {
      success: true,
      message: "Cập nhật project thành công.",
    };
  } catch (error) {
    console.error("Update project failed:", error);

    return {
      success: false,
      message: "Không thể cập nhật project. Vui lòng thử lại.",
    };
  }
}

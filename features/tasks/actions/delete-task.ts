
"use server";

import { auth } from "@/auth";
import { ProjectRole } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const deleteTaskSchema = z.object({
  taskId: z.string().min(1),
  projectId: z.string().min(1),
});

export type DeleteTaskState = {
  message?: string;
  success?: boolean;
};

export async function deleteTask(
  _prevState: DeleteTaskState,
  formData: FormData,
): Promise<DeleteTaskState> {
  // 1. Xác thực người dùng
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      message: "Vui lòng đăng nhập để xóa công việc.",
    };
  }

  // 2. Validate dữ liệu
  const parsed = deleteTaskSchema.safeParse({
    taskId: String(formData.get("taskId") ?? ""),
    projectId: String(formData.get("projectId") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Thông tin công việc không hợp lệ.",
    };
  }

  const { taskId, projectId } = parsed.data;

  // 3. Kiểm tra task có tồn tại trong project không
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
    },
    select: {
      id: true,
    },
  });

  if (!task) {
    return {
      success: false,
      message: "Không tìm thấy công việc.",
    };
  }

  // 4. Kiểm tra thành viên và vai trò
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

  if (!membership) {
    return {
      success: false,
      message: "Bạn không có quyền truy cập project này.",
    };
  }

  // 5. Chỉ OWNER và ADMIN được xóa task
  const canDelete =
    membership.role === ProjectRole.OWNER ||
    membership.role === ProjectRole.ADMIN;

  if (!canDelete) {
    return {
      success: false,
      message: "Bạn không có quyền xóa công việc.",
    };
  }

  // 6. Xóa task
  try {
    await prisma.task.delete({
      where: {
        id: task.id,
      },
    });

    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/tasks`);
    revalidatePath("/projects");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Đã xóa công việc.",
    };
  } catch (error) {
    console.error("Delete task failed:", error);

    return {
      success: false,
      message: "Không thể xóa công việc. Vui lòng thử lại.",
    };
  }
}

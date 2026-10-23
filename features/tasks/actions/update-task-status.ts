
"use server";

import { auth } from "@/auth";
import { ProjectRole } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { updateTaskStatusSchema } from "@/features/tasks/schemas/update-task-status-schema";

export type UpdateTaskStatusState = {
  message?: string;
  success?: boolean;
};

export async function updateTaskStatus(
  _prevState: UpdateTaskStatusState,
  formData: FormData,
): Promise<UpdateTaskStatusState> {
  // 1. Xác thực người dùng
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      message: "Vui lòng đăng nhập để cập nhật trạng thái.",
    };
  }

  // 2. Validate dữ liệu
  const parsed = updateTaskStatusSchema.safeParse({
    taskId: String(formData.get("taskId") ?? ""),
    projectId: String(formData.get("projectId") ?? ""),
    status: String(formData.get("status") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Dữ liệu trạng thái không hợp lệ.",
    };
  }

  const { taskId, projectId, status } = parsed.data;

  // 3. Kiểm tra task thuộc project
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
    },
    select: {
      id: true,
      assigneeId: true,
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

  // 5. OWNER và ADMIN được đổi trạng thái mọi task.
  // MEMBER chỉ được đổi trạng thái task được giao cho mình.
  const isManager =
    membership.role === ProjectRole.OWNER ||
    membership.role === ProjectRole.ADMIN;

  const isAssignee = task.assigneeId === userId;

  if (!isManager && !isAssignee) {
    return {
      success: false,
      message: "Bạn chỉ có thể cập nhật trạng thái công việc được giao cho mình.",
    };
  }

  // 6. Cập nhật trạng thái
  try {
    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        status,
      },
    });

    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/tasks`);
    revalidatePath(`/dashboard`);

    return {
      success: true,
      message: "Đã cập nhật trạng thái.",
    };
  } catch (error) {
    console.error("Update task status failed:", error);

    return {
      success: false,
      message: "Không thể cập nhật trạng thái. Vui lòng thử lại.",
    };
  }
}


"use server";

import { auth } from "@/auth";
import { ProjectRole } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseDueDate } from "@/features/tasks/utils/parse-due-date";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/features/tasks/schemas/update-task-schema";

export type UpdateTaskState = {
  message?: string;
  errors?: Record<string, string[]>;
};

export async function updateTask(
  _prevState: UpdateTaskState,
  formData: FormData,
): Promise<UpdateTaskState> {
  // 1. Xác thực người dùng
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      message: "Vui lòng đăng nhập để cập nhật công việc.",
    };
  }

  // 2. Validate dữ liệu đầu vào
  const parsed = updateTaskSchema.safeParse({
    taskId: String(formData.get("taskId") ?? ""),
    projectId: String(formData.get("projectId") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    priority: String(formData.get("priority") ?? "MEDIUM"),
    dueDate: String(formData.get("dueDate") ?? ""),
    assigneeId: String(formData.get("assigneeId") ?? ""),
  });

  if (!parsed.success) {
    return {
      message: "Vui lòng kiểm tra lại thông tin.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    taskId,
    projectId,
    title,
    description,
    priority,
    dueDate,
    assigneeId,
  } = parsed.data;

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
      message: "Không tìm thấy công việc hoặc bạn không có quyền truy cập.",
    };
  }

  // 4. Kiểm tra vai trò của người dùng trong project
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
      message: "Bạn không có quyền truy cập project này.",
    };
  }

  if (
    membership.role !== ProjectRole.OWNER &&
    membership.role !== ProjectRole.ADMIN
  ) {
    return {
      message: "Bạn không có quyền chỉnh sửa thông tin công việc.",
    };
  }

  // 5. Kiểm tra người được giao thuộc cùng project
  if (assigneeId) {
    const assigneeMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: assigneeId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!assigneeMembership) {
      return {
        message: "Người phụ trách phải là thành viên của project.",
      };
    }
  }

// 6. Validate ngày hết hạn
let parsedDueDate: Date | null;

try {
  parsedDueDate = parseDueDate(dueDate);
} catch {
  return {
    message: "Ngày hết hạn không hợp lệ.",
    errors: {
      dueDate: ["Vui lòng chọn một ngày hợp lệ."],
    },
  };
}

  // 7. Cập nhật task
  try {
    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        title,
        description: description || null,
        priority,
        dueDate: parsedDueDate,
        assigneeId: assigneeId || null,
      },
    });
  } catch (error) {
    console.error("Update task failed:", error);

    return {
      message: "Không thể cập nhật công việc. Vui lòng thử lại.",
    };
  }

  // 8. Làm mới dữ liệu
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/tasks/${taskId}/edit`);
  revalidatePath("/projects");
  revalidatePath("/dashboard");

  redirect(`/projects/${projectId}`);
}

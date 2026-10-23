
"use server";

import { auth } from "@/auth";
import { ProjectRole } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseDueDate } from "@/features/tasks/utils/parse-due-date";
import { createTaskSchema } from "@/features/tasks/schemas/create-task-schema";
import { prisma } from "@/lib/prisma";

export type CreateTaskState = {
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createTask(
  _prevState: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  // 1. Xác thực người dùng
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      message: "Vui lòng đăng nhập để tạo công việc.",
    };
  }

  // 2. Validate dữ liệu đầu vào
  const parsed = createTaskSchema.safeParse({
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
    projectId,
    title,
    description,
    priority,
    dueDate,
    assigneeId,
  } = parsed.data;

  // 3. Kiểm tra vai trò trong project
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

  // 4. Chỉ OWNER và ADMIN được tạo task
  const canCreate =
    membership.role === ProjectRole.OWNER ||
    membership.role === ProjectRole.ADMIN;

  if (!canCreate) {
    return {
      message: "Bạn không có quyền tạo công việc trong project này.",
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
        message: "Người được giao phải là thành viên của project.",
      };
    }
  }

  // 6. Validate ngày hết hạn
let parsedDueDate: Date | null;

try {
  parsedDueDate = parseDueDate(dueDate || "");
} catch {
  return {
    message: "Ngày hết hạn không hợp lệ.",
    errors: {
      dueDate: ["Vui lòng chọn một ngày hợp lệ."],
    },
  };
}

  // 7. Tạo task
  try {
    await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority,
        dueDate: parsedDueDate,
        projectId,
        creatorId: userId,
        assigneeId: assigneeId || null,
      },
    });
  } catch (error) {
    console.error("Create task failed:", error);

    return {
      message: "Không thể tạo công việc. Vui lòng thử lại.",
    };
  }

  // 8. Làm mới dữ liệu
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);

  redirect(`/projects/${projectId}`);
}

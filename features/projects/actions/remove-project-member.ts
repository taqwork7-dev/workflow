
"use server";

import { auth } from "@/auth";
import { ProjectRole } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const removeProjectMemberSchema = z.object({
  projectId: z.string().min(1, "Project không hợp lệ."),
  memberId: z.string().min(1, "Thành viên không hợp lệ."),
});

export type RemoveProjectMemberState = {
  success?: boolean;
  message?: string;
};

export async function removeProjectMember(
  _prevState: RemoveProjectMemberState,
  formData: FormData,
): Promise<RemoveProjectMemberState> {
  // 1. Xác thực người dùng
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      message: "Vui lòng đăng nhập để quản lý thành viên.",
    };
  }

  // 2. Validate dữ liệu
  const parsed = removeProjectMemberSchema.safeParse({
    projectId: String(formData.get("projectId") ?? ""),
    memberId: String(formData.get("memberId") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Thông tin project hoặc thành viên không hợp lệ.",
    };
  }

  const { projectId, memberId } = parsed.data;

  // Không cho tự xóa mình
  if (memberId === userId) {
    return {
      success: false,
      message: "Bạn không thể tự xóa mình khỏi project.",
    };
  }

  try {
    // 3. Chỉ OWNER được quản lý thành viên
    const ownerMembership = await prisma.projectMember.findUnique({
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

    if (!ownerMembership || ownerMembership.role !== ProjectRole.OWNER) {
      return {
        success: false,
        message: "Chỉ OWNER mới có quyền xóa thành viên.",
      };
    }

    // 4. Xác minh thành viên thuộc project
    const targetMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId,
        },
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!targetMembership) {
      return {
        success: false,
        message: "Người dùng không thuộc project này.",
      };
    }

    // Không cho xóa một OWNER khác
    if (targetMembership.role === ProjectRole.OWNER) {
      return {
        success: false,
        message: "Không thể xóa OWNER của project.",
      };
    }

    // 5. Bỏ phân công task và xóa membership trong transaction
    await prisma.$transaction([
      prisma.task.updateMany({
        where: {
          projectId,
          assigneeId: memberId,
        },
        data: {
          assigneeId: null,
        },
      }),
      prisma.projectMember.delete({
        where: {
          projectId_userId: {
            projectId,
            userId: memberId,
          },
        },
      }),
    ]);

    // 6. Làm mới dữ liệu
    revalidatePath("/dashboard");
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/edit`);

    return {
      success: true,
      message: "Đã xóa thành viên khỏi project.",
    };
  } catch (error) {
    console.error("Remove project member failed:", error);

    return {
      success: false,
      message: "Không thể xóa thành viên. Vui lòng thử lại.",
    };
  }
}


"use server";

import { auth } from "@/auth";
import { ProjectRole } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProjectMemberRoleSchema = z.object({
  projectId: z.string().min(1, "Project không hợp lệ."),
  memberId: z.string().min(1, "Thành viên không hợp lệ."),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export type UpdateProjectMemberRoleState = {
  success?: boolean;
  message?: string;
};

export async function updateProjectMemberRole(
  _prevState: UpdateProjectMemberRoleState,
  formData: FormData,
): Promise<UpdateProjectMemberRoleState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      message: "Vui lòng đăng nhập để thực hiện thao tác này.",
    };
  }

  const parsed = updateProjectMemberRoleSchema.safeParse({
    projectId: String(formData.get("projectId") ?? ""),
    memberId: String(formData.get("memberId") ?? ""),
    role: String(formData.get("role") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Thông tin không hợp lệ.",
    };
  }

  const { projectId, memberId, role } = parsed.data;

  try {
    // Chỉ OWNER mới được thay đổi vai trò thành viên.
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

    if (
      !ownerMembership ||
      ownerMembership.role !== ProjectRole.OWNER
    ) {
      return {
        success: false,
        message: "Chỉ OWNER mới có quyền thay đổi vai trò.",
      };
    }

    // Thành viên mục tiêu phải thuộc project.
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
        message: "Thành viên không thuộc project này.",
      };
    }

    // Không cho phép thay đổi vai trò của OWNER.
    if (targetMembership.role === ProjectRole.OWNER) {
      return {
        success: false,
        message: "Không thể thay đổi vai trò của OWNER.",
      };
    }

    const newRole =
      role === "ADMIN" ? ProjectRole.ADMIN : ProjectRole.MEMBER;

    if (targetMembership.role === newRole) {
      return {
        success: true,
        message: "Vai trò của thành viên không thay đổi.",
      };
    }

    await prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId,
        },
      },
      data: {
        role: newRole,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/edit`);

    return {
      success: true,
      message: "Đã cập nhật vai trò thành viên.",
    };
  } catch (error) {
    console.error("Update project member role failed:", error);

    return {
      success: false,
      message: "Không thể cập nhật vai trò. Vui lòng thử lại.",
    };
  }
}


"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProjectRole, Prisma } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addProjectMemberSchema = z.object({
  projectId: z.string().min(1, "Project không hợp lệ."),
  email: z
    .string()
    .trim()
    .email("Email không hợp lệ.")
    .transform((value) => value.toLowerCase()),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export type AddProjectMemberState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function addProjectMember(
  _prevState: AddProjectMemberState,
  formData: FormData,
): Promise<AddProjectMemberState> {
  // 1. Xác thực người dùng
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      message: "Vui lòng đăng nhập để thêm thành viên.",
    };
  }

  // 2. Validate dữ liệu
  const parsed = addProjectMemberSchema.safeParse({
    projectId: String(formData.get("projectId") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? "MEMBER"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { projectId, email, role } = parsed.data;

  try {
    // 3. Chỉ OWNER mới được quản lý thành viên
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
      return {
        success: false,
        message: "Bạn không có quyền thêm thành viên vào project này.",
      };
    }

    // 4. Tìm tài khoản đã đăng ký
    const member = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!member) {
      return {
        success: false,
        message: "Email này chưa đăng ký TaskFlow.",
      };
    }

    // 5. Không cho thêm chính mình nếu đã là thành viên
    const existingMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: member.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingMembership) {
      return {
        success: false,
        message: "Người dùng này đã là thành viên của project.",
      };
    }

    // 6. Ánh xạ role sang enum Prisma
    const memberRole =
      role === "ADMIN" ? ProjectRole.ADMIN : ProjectRole.MEMBER;

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: member.id,
        role: memberRole,
      },
    });

    // 7. Làm mới dữ liệu
    revalidatePath("/dashboard");
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/edit`);

    return {
      success: true,
      message: `Đã thêm ${member.name || email} vào project.`,
    };
  } catch (error) {
    // Unique constraint: thành viên đã được thêm bởi request khác
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Người dùng này đã là thành viên của project.",
      };
    }

    console.error("Add project member failed:", error);

    return {
      success: false,
      message: "Không thể thêm thành viên. Vui lòng thử lại.",
    };
  }
}

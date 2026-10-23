
"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ProjectRole } from "@/app/generated/prisma/client";
import { createProjectSchema } from "@/features/projects/schemas/project-schema";

export type CreateProjectState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    description?: string[];
  };
};

export async function createProject(
  _prevState: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      message: "Vui lòng đăng nhập để tạo project.",
    };
  }

  const parsed = createProjectSchema.safeParse({
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

  try {
    const project = await prisma.project.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        members: {
          create: {
            userId,
            role: ProjectRole.OWNER,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/projects");

    return {
      success: true,
      message: `Đã tạo project "${project.name}" thành công.`,
    };
  } catch (error) {
    console.error("Create project failed:", error);

    return {
      success: false,
      message: "Không thể tạo project lúc này. Vui lòng thử lại.",
    };
  }
}

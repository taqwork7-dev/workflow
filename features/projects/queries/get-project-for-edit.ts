
import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getProjectForEdit(projectId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
}

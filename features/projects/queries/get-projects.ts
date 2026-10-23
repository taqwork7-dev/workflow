
import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getProjectsByUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  return prisma.project.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          tasks: true,
          members: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

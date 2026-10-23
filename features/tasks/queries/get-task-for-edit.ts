
import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getTaskForEdit(
  projectId: string,
  taskId: string,
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      project: {
        members: {
          some: { userId },
        },
      },
    },
    select: {
      id: true,
      projectId: true,
      title: true,
      description: true,
      priority: true,
      dueDate: true,
      assigneeId: true,
      project: {
        select: {
          name: true,
          members: {
            orderBy: {
              user: { name: "asc" },
            },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
}


import "server-only";

import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/app/generated/prisma/client";

export async function getDashboardData(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      memberships: {
        orderBy: {
          joinedAt: "desc",
        },
        select: {
          project: {
            select: {
              id: true,
              name: true,
              description: true,
              updatedAt: true,
              tasks: {
                select: {
                  id: true,
                  status: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const projects = user.memberships.map(
    (membership) => membership.project,
  );

  const tasks = projects.flatMap((project) => project.tasks);

  return {
    projects: projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      updatedAt: project.updatedAt,
      taskCount: project.tasks.length,
      doneCount: project.tasks.filter(
        (task) => task.status === TaskStatus.DONE,
      ).length,
    })),
    stats: {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      todo: tasks.filter(
        (task) => task.status === TaskStatus.TODO,
      ).length,
      inProgress: tasks.filter(
        (task) => task.status === TaskStatus.IN_PROGRESS,
      ).length,
      done: tasks.filter(
        (task) => task.status === TaskStatus.DONE,
      ).length,
    },
  };
}

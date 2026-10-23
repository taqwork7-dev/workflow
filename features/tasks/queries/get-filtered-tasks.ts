
import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { taskFilterSchema } from "@/features/tasks/schemas/task-filter-schema";
import type { TaskFilterRaw } from "@/features/tasks/schemas/task-filter-schema";
const PAGE_SIZE = 10;

export async function getFilteredTasks(
  projectId: string,
  rawFilters: TaskFilterRaw,
) {
  // 1. Xác thực người dùng.
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  // 2. Validate bộ lọc.
  const parsedFilters = taskFilterSchema.safeParse(rawFilters);

  const filters = parsedFilters.success
    ? parsedFilters.data
    : taskFilterSchema.parse({});

  // 3. Chỉ thành viên của project mới được xem dữ liệu.
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: { userId },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      members: {
        select: {
          role: true,
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
  });

  if (!project) {
    return null;
  }

  // 4. Xây dựng điều kiện lọc.
  const where = {
    projectId: project.id,
    ...(filters.search
      ? {
          title: {
            contains: filters.search,
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(filters.status !== "ALL"
      ? {
          status: filters.status,
        }
      : {}),
    ...(filters.priority !== "ALL"
      ? {
          priority: filters.priority,
        }
      : {}),
  };

  // 5. Đếm tổng số task.
  const totalTasks = await prisma.task.count({
    where,
  });

  const totalPages = Math.ceil(totalTasks / PAGE_SIZE);

  // 6. Chuẩn hóa trang hiện tại.
  const requestedPage = Math.max(1, filters.page);
  const currentPage =
    totalPages === 0
      ? 1
      : Math.min(requestedPage, totalPages);

  // 7. Lấy task và thông tin người được giao.
  const tasks = await prisma.task.findMany({
    where,
    orderBy: [
      { updatedAt: "desc" },
      { id: "asc" },
    ],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    project: {
      ...project,
      tasks,
    },
    filters: {
      ...filters,
      page: currentPage,
    },
    pagination: {
      currentPage,
      pageSize: PAGE_SIZE,
      totalTasks,
      totalPages,
    },
  };
}

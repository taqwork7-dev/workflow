import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  ProjectRole,
  TaskPriority,
  TaskStatus,
} from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  // 1. Create or update demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@taskflow.local" },
    update: {
      name: "Demo User",
    },
    create: {
      name: "Demo User",
      email: "demo@taskflow.local",
    },
  });

  // 2. Create or update demo project
  const project = await prisma.project.upsert({
    where: { id: "taskflow-demo-project" },
    update: {
      name: "Website Redesign",
      description: "Plan and deliver the company website redesign.",
    },
    create: {
      id: "taskflow-demo-project",
      name: "Website Redesign",
      description: "Plan and deliver the company website redesign.",
    },
  });

  // 3. Ensure the demo user belongs to the project
  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: user.id,
      },
    },
    update: {
      role: ProjectRole.OWNER,
    },
    create: {
      projectId: project.id,
      userId: user.id,
      role: ProjectRole.OWNER,
    },
  });

  // 4. Create or update sample tasks
  const tasks = [
    {
      id: "taskflow-task-1",
      title: "Design dashboard UI",
      description: "Create the main dashboard layout and navigation.",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
    },
    {
      id: "taskflow-task-2",
      title: "Implement project management",
      description: "Build project creation and editing functionality.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
    },
    {
      id: "taskflow-task-3",
      title: "Build task management",
      description: "Implement task CRUD and status updates.",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
    },
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: project.id,
        creatorId: user.id,
        assigneeId: user.id,
      },
      create: {
        ...task,
        projectId: project.id,
        creatorId: user.id,
        assigneeId: user.id,
      },
    });
  }

  console.log("Seed completed successfully.");
  console.log(`Demo user: ${user.email}`);
  console.log(`Project: ${project.name}`);
  console.log(`Tasks: ${tasks.length}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

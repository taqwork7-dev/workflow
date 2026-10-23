
import { z } from "zod";

export const updateTaskSchema = z.object({
  taskId: z.string().min(1, "Task ID không hợp lệ."),
  projectId: z.string().min(1, "Project ID không hợp lệ."),
  title: z
    .string()
    .trim()
    .min(2, "Tên công việc phải có ít nhất 2 ký tự.")
    .max(150, "Tên công việc không được vượt quá 150 ký tự."),
  description: z
    .string()
    .trim()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự.")
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

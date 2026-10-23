
import { z } from "zod";

export const updateTaskStatusSchema = z.object({
  taskId: z.string().min(1, "Task ID không hợp lệ."),
  projectId: z.string().min(1, "Project ID không hợp lệ."),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});

export type UpdateTaskStatusInput = z.infer<
  typeof updateTaskStatusSchema
>;

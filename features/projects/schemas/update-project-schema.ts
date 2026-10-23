
import { z } from "zod";

export const updateProjectSchema = z.object({
  projectId: z.string().min(1, "Project ID không hợp lệ."),
  name: z
    .string()
    .trim()
    .min(2, "Tên project phải có ít nhất 2 ký tự.")
    .max(100, "Tên project không được vượt quá 100 ký tự."),
  description: z
    .string()
    .trim()
    .max(500, "Mô tả không được vượt quá 500 ký tự.")
    .optional()
    .or(z.literal("")),
});

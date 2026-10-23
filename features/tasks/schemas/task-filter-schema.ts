import { z } from "zod";

export const taskFilterSchema = z.object({
    search: z
        .string()
        .trim()
        .max(100, "Từ khóa tìm kiếm không được vượt quá 100 ký tự.")
        .default(""),

    status: z
        .enum(["ALL", "TODO", "IN_PROGRESS", "DONE"])
        .default("ALL"),

    priority: z
        .enum(["ALL", "LOW", "MEDIUM", "HIGH", "URGENT"])
        .default("ALL"),

    page: z.coerce
        .number()
        .int("Trang phải là số nguyên.")
        .min(1, "Trang phải lớn hơn hoặc bằng 1.")
        .default(1),
});

// Kiểu dữ liệu sau khi parse và validate.
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;

// Kiểu dữ liệu trước khi parse, phù hợp với query parameters.
export type TaskFilterRaw = z.input<typeof taskFilterSchema>;
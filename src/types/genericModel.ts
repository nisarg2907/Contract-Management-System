import { z } from "zod";

// Generic date schema for tracking creation and update timestamps
export const genericDateSchema = z.object({
    createdAt: z.date(),
    updatedAt: z.date()
});

// DTO (Data Transfer Object) schema for dates, transforming to ISO string
export const genericDateDTOSchema = genericDateSchema.extend({
    createdAt: z.date().transform(d => d.toISOString()).pipe(z.string().datetime()),
    updatedAt: z.date().transform(d => d.toISOString()).pipe(z.string().datetime())
});

// Base response schema with more App Router-friendly structure
const baseResponseSchema = z.object({
    success: z.boolean(),
    data: z.record(z.string(), z.any()).optional(),
    error: z.object({
        message: z.string().optional(),
        cause: z.string().optional(),
        code: z.string().optional()
    }).optional(),
    meta: z.record(z.string(), z.any()).optional()
});

// Error response schema
export const errorResponseSchema = baseResponseSchema.extend({
    success: z.literal(false),
    error: z.object({
        message: z.string(),
        cause: z.string().optional(),
        code: z.string().optional()
    })
});

// Success response schema
export const successResponseSchema = baseResponseSchema.extend({
    success: z.literal(true),
    data: z.record(z.string(), z.any())
});

// Unified API response type
export type APIResponse = 
    | z.infer<typeof successResponseSchema> 
    | z.infer<typeof errorResponseSchema>;

// Type guards for type narrowing
export function isSuccessResponse(response: APIResponse): response is z.infer<typeof successResponseSchema> {
    return response.success === true;
}

export function isErrorResponse(response: APIResponse): response is z.infer<typeof errorResponseSchema> {
    return response.success === false;
}
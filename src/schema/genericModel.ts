import { z } from "zod";

export const genericDateSchema = z.object({
    createdAt: z.date(),
    updatedAt: z.date()
})

export const genericDateDTOSchema = genericDateSchema.extend({
    createdAt: z.date().transform(z => z.toISOString()).pipe(z.string().datetime()).or(z.string().datetime()),
    updatedAt: z.date().transform(z => z.toISOString()).pipe(z.string().datetime()).or(z.string().datetime())
})

const responseSchema = z.object({
    success: z.boolean(),
    data: z.record(z.any(), z.any()),
    errorMessage: z.string(),
    cause: z.string().optional(),
    unique: z.record(z.string(), z.string()).optional(),
    meta: z.any().optional()
})

export const errorResponseSchema = responseSchema.pick({ success: true, errorMessage: true, cause: true, meta: true, unique: true }).extend({ success: z.boolean().default(false) });
export const successResponseSchema = responseSchema.pick({ success: true, data: true }).extend({ success: z.boolean().default(true) });

export type errorResponse = z.infer<typeof errorResponseSchema>;
export type successResponse = z.infer<typeof successResponseSchema>;

export type apiResponse = errorResponse | successResponse;
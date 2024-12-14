/** External Dependencies */
import z, { ZodSchema } from "zod";

/** Custom Type */
import { APIResponse } from "@/types/genericModel";
import { invalidArgunmentsErrorResponse } from "./errorHelper";
import { NextResponse } from "next/server";

/**
 * Function to parse the schema, in case of error return invalid arguments response to the Client before returning undefined
 * @param schema Reference schema to be used to validate the data
 * @param data Data that is to be validated
 * @param res Response Object used to send error response to the client
 * @returns data after parsing the schema or undefined in case of error
 */
export async function validateSchema<T extends ZodSchema>(
    schema: T,
    data: unknown,
    res: NextResponse<APIResponse> | undefined = undefined,
): Promise<z.infer<T> | undefined> {
    const parsedData = await schema.safeParseAsync(data);
    if (parsedData.success === false) {
        if (!res) {
            throw parsedData.error;
        }
        invalidArgunmentsErrorResponse(res, parsedData.error, data);
        return undefined;
    }
    return parsedData.data;
}

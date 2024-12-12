/** External Dependencies */
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/** Custom Functions */
import { errorResponse, successResponse } from "@/schema/genericModel";
import { NextApiResponse } from "next";

type ErrorFunctionCallBack = {
    handleUniqueCb?: (
        res: NextApiResponse<errorResponse>,
        err: PrismaClientKnownRequestError,
    ) => PromiseLike<void> | void;
};

async function handlePrismaKnownError(
    res: NextApiResponse<errorResponse>,
    err: PrismaClientKnownRequestError,
    handleUniqueCb: ErrorFunctionCallBack["handleUniqueCb"] = undefined,
): Promise<boolean> {
    if (err.code === "P2002") {
        await handleUniqueCb?.(res, err);
        return handleUniqueCb ? true : false;
    }
    return false;
}

export async function handlePrismaError(
    res: NextApiResponse<errorResponse>,
    err: unknown,
    cb: ErrorFunctionCallBack,
): Promise<boolean> {
    if (!err) {
        return false;
    }
    /** Handle Unique Constraint Property */
    if (err instanceof PrismaClientKnownRequestError) {
        return handlePrismaKnownError(res, err, cb.handleUniqueCb);
    }
    return false;
}

export async function internalServerErrorResponse(
    res: NextApiResponse<errorResponse>,
    err: unknown = undefined,
    cb: ErrorFunctionCallBack,
    meta: unknown = undefined,
) {
    const prismaRes = await handlePrismaError(res, err, cb);
    if (!prismaRes) {
        return res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error, please try again",
            cause: err instanceof Error ? err.name : "",
            meta,
        });
    }
}

export function genericuniqueErrorResponse(
    res: NextApiResponse<errorResponse>,
    errorMessage: string,
    unique: errorResponse["unique"],
    statusCode: number = 400,
) {
    return res
        .status(statusCode)
        .json({ success: false, errorMessage, unique });
}

export function notFoundErrorResponse(res: NextApiResponse<errorResponse>) {
    return res.status(404).json({
        success: false,
        errorMessage: "Request resource is not available",
    });
}

export function invalidArgunmentsErrorResponse(
    res: NextApiResponse<errorResponse>,
    err: Error | undefined,
    meta: unknown,
) {
    return res.status(400).json({
        success: false,
        errorMessage: "Invalid Arguements provided",
        cause: err?.message,
        meta,
    });
}

export function successfulResponse(
    res: NextApiResponse<successResponse>,
    data: successResponse["data"],
    statusCode: number = 200,
) {
    return res.status(statusCode).json({ success: true, data });
}

export function unauthorizedErrorResponse(
    res: NextApiResponse<errorResponse>,
    errorMessage: string = "Unauthorized access",
) {
    return res.status(401).json({
        success: false,
        errorMessage,
    });
}

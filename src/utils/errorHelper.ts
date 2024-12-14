/** External Dependencies */
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/** Custom Functions */
import { APIResponse } from "@/types/genericModel";
import { NextResponse } from "next/server";

type ErrorFunctionCallBack = {
    handleUniqueCb?: (
        res: NextResponse<APIResponse>,
        err: PrismaClientKnownRequestError,
    ) => PromiseLike<void> | void;
};

async function handlePrismaKnownError(
    res: NextResponse<APIResponse>,
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
    res: NextResponse<APIResponse>,
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
    res: NextResponse<APIResponse>,
    err: unknown = undefined,
    cb: ErrorFunctionCallBack,
    meta: unknown = undefined,
) {
    const prismaRes = await handlePrismaError(res, err, cb);
    if (!prismaRes) {
        return new NextResponse(JSON.stringify({
            success: false,
            error: {
                message: "Internal Server Error, please try again",
                cause: err instanceof Error ? err.name : "",
            },
            meta: meta ?? ""
        }), { status: 500 });
    }
}

export function genericuniqueErrorResponse(
    res: NextResponse<APIResponse>,
    errorMessage: string,
    unique: Record<string, unknown>,
    statusCode: number = 400,
) {
    return new NextResponse(JSON.stringify({ success: false, error: { message: errorMessage }, meta: { unique } }), { status: statusCode });
}

export function notFoundErrorResponse() {
    return new NextResponse(JSON.stringify({
        success: false,
        error: {
            message: "Request resource is not available",
        },
    }), { status: 404 });
}

export function invalidArgunmentsErrorResponse(
    res: NextResponse<APIResponse>,
    err: Error | undefined,
    meta?: unknown,
) {
    return new NextResponse(JSON.stringify({
        success: false,
        error: {
            message: "Invalid Arguments provided",
            cause: err?.message,
        },
        meta: meta ?? ""
    }), { status: 400 });
}

export function successfulResponse(
    res: NextResponse<APIResponse>,
    data: Record<string, unknown>,
    statusCode: number = 200,
) {
    return new NextResponse(JSON.stringify({ success: true, data }), { status: statusCode });
}

export function unauthorizedErrorResponse(
    res: NextResponse<APIResponse>,
    errorMessage: string = "Unauthorized access",
) {
    return new NextResponse(JSON.stringify({
        success: false,
        error: {
            message: errorMessage,
        },
    }), { status: 401 });
}

import { NextRequest, NextResponse } from 'next/server';
import { APIResponse, successResponseSchema, errorResponseSchema } from "@/types/genericModel";
import { db } from "@/utils/db";

async function handleDatabaseError(err: unknown): Promise<NextResponse<APIResponse>> {
    if (err instanceof Error && 'meta' in err && typeof err.meta === 'object' && err.meta !== null) {
        const targets = (err.meta as { target?: string[] }).target ?? [];
        return NextResponse.json(
            errorResponseSchema.parse({
                success: false,
                error: {
                    message: "Unique Constraint failed",
                    cause: targets.join(', '),
                    code: 'UNIQUE_CONSTRAINT_ERROR'
                },
                meta: {
                    uniqueFields: targets.reduce((prev: Record<string, string>, curr) => {
                        const key = curr === "id" ? "id" : "unknown";
                        const display = curr === "id" ? "ID" : "Unknown";
                        return { ...prev, [key]: `${display} already exists` };
                    }, {})
                }
            }),
            { status: 500 }
        );
    }
    
    return NextResponse.json(
        errorResponseSchema.parse({
            success: false,
            error: {
                message: 'Internal Server Error',
                code: 'INTERNAL_SERVER_ERROR'
            }
        }),
        { status: 500 }
    );
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json(
            errorResponseSchema.parse({
                success: false,
                error: {
                    message: 'User ID is required',
                    code: 'INVALID_INPUT'
                }
            }),
            { status: 400 }
        );
    }

    try {
        const user = await db.user.findUnique({
            where: { id: String(id) },
            select: { statuses: true },
        });

        if (!user) {
            return NextResponse.json(
                errorResponseSchema.parse({
                    success: false,
                    error: {
                        message: 'User not found',
                        code: 'NOT_FOUND'
                    }
                }),
                { status: 404 }
            );
        }

        return NextResponse.json(
        {
                data: user.statuses
        }
        );
    } catch (error) {
        console.error("error",error)
        return handleDatabaseError(error);
    }
}

export async function POST(req: NextRequest): Promise<NextResponse<APIResponse>> {
    try {
        const body = await req.json();
        const { id, statuses } = body;

        if (!id || !statuses) {
            return NextResponse.json(
                errorResponseSchema.parse({
                    success: false,
                    error: {
                        message: 'User ID and statuses are required',
                        code: 'INVALID_INPUT'
                    }
                }),
                { status: 400 }
            );
        }

        const user = await db.user.update({
            where: { id },
            data: { statuses },
        });

        return NextResponse.json(
            successResponseSchema.parse({
                success: true,
                data: user
            })
        );
    } catch (error) {
        return handleDatabaseError(error);
    }
}

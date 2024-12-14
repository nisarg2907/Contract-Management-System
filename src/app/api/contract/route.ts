import { NextRequest, NextResponse } from 'next/server';

/** Custom Types and Schemas */
import { APIResponse, successResponseSchema, errorResponseSchema } from "@/types/genericModel";
import {
    // CreateNewContract,
    CreateNewContractSchema,
    UpdateContractSchema
} from "@/types/contract";

/** Custom Functions */
import { db } from "@/utils/db";
import { validateSchema } from "@/utils/schemaValidation";

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

export async function GET(req: NextRequest): Promise<NextResponse<APIResponse>> {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
        return GET_BY_ID(req);
    }

    try {
        const contracts = await db.contract.findMany({
            select: {
                id: true,
                clientName: true,
                title: true,
                description: true,
                status: true,
                type: true
            }
        });

        return NextResponse.json(
            successResponseSchema.parse({
                success: true,
                data: { contracts: contracts.length === 0 ? [] : contracts }
            })
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
}

export async function GET_BY_ID(req: NextRequest): Promise<NextResponse<APIResponse>> {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                errorResponseSchema.parse({
                    success: false,
                    error: {
                        message: 'ID is required',
                        code: 'VALIDATION_ERROR'
                    }
                }),
                { status: 400 }
            );
        }

        const contract = await db.contract.findUnique({
            where: { id: id as string },
            select: {
                id: true,
                clientName: true,
                title: true,
                description: true,
                status: true,
                type: true
            }
        });

        if (!contract) {
            return NextResponse.json(
                errorResponseSchema.parse({
                    success: false,
                    error: {
                        message: 'Contract not found',
                        code: 'NOT_FOUND'
                    }
                }),
                { status: 404 }
            );
        }

        return NextResponse.json(
            successResponseSchema.parse({
                success: true,
                data: { contract }
            })
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
}

export async function POST(req: NextRequest): Promise<NextResponse<APIResponse>> {
    try {
      
        const body = await req.json();
        const parsedData = await validateSchema(CreateNewContractSchema, body);

        if (!parsedData) {
            return NextResponse.json(
                errorResponseSchema.parse({
                    success: false,
                    error: {
                        message: 'Validation failed',
                        code: 'VALIDATION_ERROR'
                    }
                }),
                { status: 400 }
            );
        }

        const newContract = await db.contract.create({ data: parsedData });
        return NextResponse.json(
            successResponseSchema.parse({
                success: true,
                data: { contract: newContract }
            }),
            { status: 201 }
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
}

export async function PUT(req: NextRequest): Promise<NextResponse<APIResponse>> {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id') as string;
        const body = await req.json();
        const parsedData = await validateSchema(UpdateContractSchema, body);
        if (!parsedData) {
            return NextResponse.json(
                errorResponseSchema.parse({
                    success: false,
                    error: {
                        message: 'Validation failed',
                        code: 'VALIDATION_ERROR'
                    }
                }),
                { status: 400 }
            );
        }
        const updatedContract = await db.contract.update({
            where: { id },
            data: parsedData,
        });
        return NextResponse.json(
            successResponseSchema.parse({
                success: true,
                data: { contract: updatedContract }
            })
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse<APIResponse>> {
    try {
        console.debug("DELETE request received", { url: req.url });
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        console.debug("Extracted ID from request", { id });
        
        if (!id) {
            console.error("Invalid ID provided", { id });
            return NextResponse.json(
                errorResponseSchema.parse({
                    success: false,
                    error: {
                        message: 'Invalid ID',
                        code: 'INVALID_INPUT'
                    }
                }),
                { status: 400 }
            );
        }
        
        await db.contract.delete({ where: { id } });
        return NextResponse.json(
            successResponseSchema.parse({
                success: true,
                data: {}
            }),
            { status: 200 }
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
}
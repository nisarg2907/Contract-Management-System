import { NextRequest, NextResponse } from 'next/server';
import { APIResponse, successResponseSchema, errorResponseSchema } from "@/types/genericModel";
import { CreateNewUserSchema, UpdateUserSchema } from "@/types/user";
import { db } from "@/utils/db";
import { validateSchema } from "@/utils/schemaValidation";
import { hash } from "bcryptjs";

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
    const pageIndex = parseInt(searchParams.get('pageIndex') || '0', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    try {
        if (id) {
            const user = await db.user.findUnique({
                where: { id: id as string },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password:true
                }
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
                successResponseSchema.parse({
                    success: true,
                    data: { user: { ...user, password: '' } }
                })
            );
        }

        const totalUsers = await db.user.count();

        const users = await db.user.findMany({
            skip: pageIndex * pageSize,
            take: pageSize,
            select: {
                id: true,
                name: true,
                email: true,
                statuses: true
            }
        });

        return NextResponse.json(
            successResponseSchema.parse({
                success: true,
                data: { 
                    users: users.length === 0 ? [] : users,
                    totalPages: Math.ceil(totalUsers / pageSize)
                }
            })
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
}

export async function POST(req: NextRequest): Promise<NextResponse<APIResponse>> {
    try {
        const body = await req.json();
        const parsedData = await validateSchema(CreateNewUserSchema, body);

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

        const existingUser = await db.user.findUnique({
            where: { email: parsedData.email }
        });

        if (existingUser) {
            return NextResponse.json(
                errorResponseSchema.parse({
                    success: false,
                    error: {
                        message: 'Email already exists',
                        code: 'UNIQUE_CONSTRAINT_ERROR'
                    }
                }),
                { status: 400 }
            );
        }

        const hashedPassword = await hash(parsedData.password, 10);
        const newUser = await db.user.create({ data: { ...parsedData, password: hashedPassword } });
        return NextResponse.json(
            successResponseSchema.parse({
                success: true,
                data: { user: newUser }
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
        const parsedData = await validateSchema(UpdateUserSchema, body);
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

        const updatedData = { ...parsedData };
        if (parsedData.password) {
            updatedData.password = await hash(parsedData.password, 10);
        }

        const updatedUser = await db.user.update({
            where: { id },
            data: updatedData,
        });

        return NextResponse.json(
            successResponseSchema.parse({
                success: true,
                data: { user: updatedUser }
            })
        );
    } catch (err) {
        return handleDatabaseError(err);
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse<APIResponse>> {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        
        if (!id) {
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
        await db.notification.deleteMany({where:{userId:id}})
        await db.user.delete({ where: { id } });
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

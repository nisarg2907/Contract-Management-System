import { Prisma,ContractStatus } from "@prisma/client";
import { z } from "zod";
import { genericDateSchema } from "./genericModel";

/* eslint-disable @typescript-eslint/no-empty-object-type */
type UserModel = Prisma.UserGetPayload<{}>;
export const UserSchema = genericDateSchema.extend({
    id: z.string(),
    name: z
        .string({ required_error: "Name is mandatory" })
        .min(1, "Name is mandatory"),

    email: z
        .string({ required_error: "Email is mandatory" })
        .email("Invalid email format"),
    password: z.string().min(1, "Password is mandatory"),
    statuses: z.array(z.nativeEnum(ContractStatus)),
}) satisfies z.Schema<UserModel>;
export type User = z.infer<typeof UserSchema>;

export const CreateNewUserSchema = UserSchema.pick({
    name: true,
    email: true,
    password: true,
    // statuses: true,
});
export type CreateNewUser = z.infer<typeof CreateNewUserSchema>;

export const UpdateUserSchema = CreateNewUserSchema.pick({
    name: true,
    email: true,
}).extend({
    password: z.string().optional(),
    id: z.string().min(1, "Id is required"),
});
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const UserDataTableRowSchema = UpdateUserSchema.pick({
    name: true,
    id: true,
    email: true,
}).extend({
    statuses: z.array(z.nativeEnum(ContractStatus)),
});
export type UserDataTableRow = z.infer<typeof UserDataTableRowSchema>;

export const CombinedUserSchema = z.union([CreateNewUserSchema, UpdateUserSchema]);

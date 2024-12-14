import { Prisma,ContractStatus,ContractType } from "@prisma/client";
import { z } from "zod";
import { genericDateSchema } from "./genericModel";

/* eslint-disable @typescript-eslint/no-empty-object-type */
type ContractModel = Prisma.ContractGetPayload<{}>;
export const ContractSchema = genericDateSchema.extend({
    id: z.string(),
    title: z
        .string({ required_error: "Title is mandatory" })
        .min(1, "Title is mandatory"),
    description: z.string().nullable(),
    clientName: z
        .string({ required_error: "Client Name is mandatory" })
        .min(1, "Client Name is mandatory"),
    status: z.nativeEnum(ContractStatus),
    type: z.nativeEnum(ContractType)
}) satisfies z.Schema<ContractModel>;
export type Contract = z.infer<typeof ContractSchema>;

export const CreateNewContractSchema = ContractSchema.pick({
    title: true,
    description: true,
    clientName: true,
    status: true,
    type: true
});
export type CreateNewContract = z.infer<typeof CreateNewContractSchema>;

export const UpdateContractSchema = CreateNewContractSchema.extend({
    id: z.string().min(1, "Id is required"),
});
export type UpdateContract = z.infer<typeof UpdateContractSchema>;

export const ContractDataTableRowSchema = UpdateContractSchema.pick({
    title: true,
    id: true,
    clientName: true
}).extend({
    status: z.nativeEnum(ContractStatus),
    type: z.nativeEnum(ContractType)
});
export type ContractDataTableRow = z.infer<typeof ContractDataTableRowSchema>;

export const CombinedContractSchema = z.union([CreateNewContractSchema, UpdateContractSchema]);

/*
  Warnings:

  - The values [PENDING,ACTIVE,EXPIRED,TERMINATED] on the enum `ContractStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `clientAddress` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `clientEmail` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `clientPhone` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `contractNumber` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `paymentTerms` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `renewalDate` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `signedDate` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `signingParties` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `totalValue` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileMetadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContractStatus_new" AS ENUM ('DRAFT', 'FINALIZED', 'IN_REVIEW', 'CANCELED');
ALTER TABLE "Contract" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Contract" ALTER COLUMN "status" TYPE "ContractStatus_new" USING ("status"::text::"ContractStatus_new");
ALTER TYPE "ContractStatus" RENAME TO "ContractStatus_old";
ALTER TYPE "ContractStatus_new" RENAME TO "ContractStatus";
DROP TYPE "ContractStatus_old";
ALTER TABLE "Contract" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "FileMetadata" DROP CONSTRAINT "FileMetadata_contractId_fkey";

-- DropIndex
DROP INDEX "Contract_contractNumber_key";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "clientAddress",
DROP COLUMN "clientEmail",
DROP COLUMN "clientPhone",
DROP COLUMN "contractNumber",
DROP COLUMN "createdBy",
DROP COLUMN "currency",
DROP COLUMN "endDate",
DROP COLUMN "isActive",
DROP COLUMN "notes",
DROP COLUMN "paymentTerms",
DROP COLUMN "renewalDate",
DROP COLUMN "signedDate",
DROP COLUMN "signingParties",
DROP COLUMN "startDate",
DROP COLUMN "tags",
DROP COLUMN "totalValue",
DROP COLUMN "updatedBy",
DROP COLUMN "version",
ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "FileMetadata";

-- DropTable
DROP TABLE "User";

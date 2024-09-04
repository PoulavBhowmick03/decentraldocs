-- AlterTable
ALTER TABLE "Issuer" ALTER COLUMN "organizationType" DROP NOT NULL,
ALTER COLUMN "licenseNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationName" TEXT,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Verifier" ALTER COLUMN "organizationType" DROP NOT NULL,
ALTER COLUMN "licenseNumber" DROP NOT NULL;

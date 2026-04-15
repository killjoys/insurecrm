-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ClientTier" AS ENUM ('VIP', 'Standard');

-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('New', 'Contacted', 'Quoted', 'Closed');

-- CreateEnum
CREATE TYPE "PolicyCategory" AS ENUM ('Life', 'Health', 'PA', 'Motor', 'Fire', 'Other');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('Pending', 'Inforced', 'Lapsed', 'Cancelled', 'Matured');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "idCard" TEXT NOT NULL DEFAULT '',
    "dateOfBirth" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "tier" "ClientTier" NOT NULL DEFAULT 'Standard',
    "createdAt" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "source" TEXT NOT NULL DEFAULT '',
    "stage" "LeadStage" NOT NULL DEFAULT 'New',
    "interest" "PolicyCategory" NOT NULL DEFAULT 'Life',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "convertedToClientId" TEXT,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "category" "PolicyCategory" NOT NULL,
    "lifeSubtype" TEXT,
    "provider" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "premiumFrequency" TEXT NOT NULL,
    "sumInsured" DOUBLE PRECISION NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'Pending',
    "effectiveDate" TEXT NOT NULL,
    "renewalDate" TEXT NOT NULL,
    "maturityDate" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "priority" "TicketPriority" NOT NULL DEFAULT 'Medium',
    "status" TEXT NOT NULL DEFAULT 'Open',
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "dueDate" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "relatedClientId" TEXT,
    "relatedClientName" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "policies_policyNumber_key" ON "policies"("policyNumber");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_convertedToClientId_fkey" FOREIGN KEY ("convertedToClientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_relatedClientId_fkey" FOREIGN KEY ("relatedClientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

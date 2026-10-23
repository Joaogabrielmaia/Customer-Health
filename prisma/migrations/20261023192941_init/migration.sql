-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CSM');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('BASICO', 'PROFISSIONAL', 'FROTA_PLUS');

-- CreateEnum
CREATE TYPE "TicketSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ActionChannel" AS ENUM ('LIGACAO', 'EMAIL', 'WHATSAPP', 'REUNIAO');

-- CreateEnum
CREATE TYPE "ActionOutcome" AS ENUM ('RESOLVIDO', 'EM_ANDAMENTO', 'SEM_RESPOSTA', 'ESCALADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "vehicles" INTEGER NOT NULL,
    "mrr" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "csmId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "mrr" INTEGER NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" SERIAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "module" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "category" TEXT NOT NULL,
    "severity" "TicketSeverity" NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpsResponse" (
    "id" SERIAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "NpsResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CsAction" (
    "id" SERIAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channel" "ActionChannel" NOT NULL,
    "playbook" TEXT,
    "note" TEXT NOT NULL,
    "outcome" "ActionOutcome" NOT NULL,
    "scoreAtTime" DOUBLE PRECISION,
    "colorAtTime" TEXT,

    CONSTRAINT "CsAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreConfigRow" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "weights" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "ScoreConfigRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_csmId_idx" ON "Account"("csmId");

-- CreateIndex
CREATE INDEX "Account_segment_idx" ON "Account"("segment");

-- CreateIndex
CREATE INDEX "Contract_accountId_endDate_idx" ON "Contract"("accountId", "endDate");

-- CreateIndex
CREATE INDEX "UsageEvent_accountId_date_idx" ON "UsageEvent"("accountId", "date");

-- CreateIndex
CREATE INDEX "Ticket_accountId_openedAt_idx" ON "Ticket"("accountId", "openedAt");

-- CreateIndex
CREATE INDEX "NpsResponse_accountId_date_idx" ON "NpsResponse"("accountId", "date");

-- CreateIndex
CREATE INDEX "Invoice_accountId_dueDate_idx" ON "Invoice"("accountId", "dueDate");

-- CreateIndex
CREATE INDEX "CsAction_accountId_createdAt_idx" ON "CsAction"("accountId", "createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_csmId_fkey" FOREIGN KEY ("csmId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpsResponse" ADD CONSTRAINT "NpsResponse_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CsAction" ADD CONSTRAINT "CsAction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CsAction" ADD CONSTRAINT "CsAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

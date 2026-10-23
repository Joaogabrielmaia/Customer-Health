/**
 * Popula o banco com o dataset sintético (semente fixa).
 * Uso: npm run db:seed   (idempotente: limpa e recria os dados)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { DEFAULT_SEED, generateDataset } from "./generate";
import { DEFAULT_CONFIG } from "../../src/lib/score/engine";

process.loadEnvFile?.(".env");
export const DEMO_PASSWORD = "Termometro@2026";

async function main() {
  const prisma = new PrismaClient();
  const seed = Number(process.env.SEED ?? DEFAULT_SEED);
  const ref = new Date(`${process.env.REFERENCE_DATE ?? "2026-10-15"}T12:00:00Z`);
  const ds = generateDataset(seed, ref);

  await prisma.csAction.deleteMany();
  await prisma.usageEvent.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.npsResponse.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.scoreConfigRow.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  await prisma.user.createMany({ data: ds.users.map((u) => ({ ...u, passwordHash })) });
  await prisma.account.createMany({
    data: ds.accounts.map((a) => ({
      id: a.id, name: a.name, segment: a.segment, plan: a.plan, vehicles: a.vehicles,
      mrr: a.mrr, city: a.city, createdAt: a.createdAt, csmId: a.csmId,
    })),
  });
  await prisma.contract.createMany({
    data: ds.accounts.map((a) => ({ accountId: a.id, startDate: a.contractStart, endDate: a.contractEnd, mrr: a.mrr })),
  });
  const chunk = <T,>(arr: T[], n = 5000): T[][] => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));
  for (const part of chunk(ds.usage)) await prisma.usageEvent.createMany({ data: part });
  await prisma.ticket.createMany({ data: ds.tickets });
  await prisma.npsResponse.createMany({ data: ds.nps });
  await prisma.invoice.createMany({ data: ds.invoices });
  await prisma.csAction.createMany({
    data: ds.actions.map((a) => ({ ...a, scoreAtTime: null, colorAtTime: null })),
  });
  await prisma.scoreConfigRow.create({ data: { id: "default", weights: DEFAULT_CONFIG.weights, thresholds: DEFAULT_CONFIG.thresholds } });

  console.log(
    `Seed ${seed} / ref ${ref.toISOString().slice(0, 10)}: ${ds.accounts.length} contas, ${ds.usage.length} eventos de uso, ` +
      `${ds.tickets.length} chamados, ${ds.nps.length} NPS, ${ds.invoices.length} faturas, ${ds.actions.length} ações.`,
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

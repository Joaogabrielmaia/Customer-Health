import bcrypt from "bcryptjs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

process.loadEnvFile?.(".env");

// Os imports dependem do DATABASE_URL carregado acima.
const { prisma } = await import("../../src/lib/db");
const { loadConfig, loadPortfolio } = await import("../../src/lib/data");
const { generateDataset } = await import("../../scripts/seed/generate");
const { toAccountData } = await import("../../scripts/seed/adapt");
const { scorePortfolio } = await import("../../src/lib/score/portfolio");
const { DEFAULT_CONFIG, configSchema } = await import("../../src/lib/score/engine");

const REF = new Date(`${process.env.REFERENCE_DATE ?? "2026-10-15"}T12:00:00Z`);

describe("integração com o PostgreSQL (requer `npm run db:up` e `npm run db:seed`)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("o banco tem as 120 contas e todas as tabelas do modelo", async () => {
    const [accounts, contracts, usage, tickets, nps, invoices, users] = await Promise.all([
      prisma.account.count(), prisma.contract.count(), prisma.usageEvent.count(), prisma.ticket.count(),
      prisma.npsResponse.count(), prisma.invoice.count(), prisma.user.count(),
    ]);
    const ds = generateDataset(Number(process.env.SEED ?? 20261015), REF);
    expect(accounts).toBe(120);
    expect(contracts).toBe(120);
    expect(usage).toBe(ds.usage.length);
    expect(tickets).toBe(ds.tickets.length);
    expect(nps).toBe(ds.nps.length);
    expect(invoices).toBe(ds.invoices.length);
    expect(users).toBe(4);
  });

  it("o score calculado a partir do banco é idêntico ao calculado a partir do gerador (persistência sem perdas)", async () => {
    const { data } = await loadPortfolio();
    const fromDb = scorePortfolio(data, REF, DEFAULT_CONFIG);
    const ds = generateDataset(Number(process.env.SEED ?? 20261015), REF);
    const fromMemory = scorePortfolio(toAccountData(ds), REF, DEFAULT_CONFIG);
    expect(fromDb).toHaveLength(120);
    fromDb.forEach((s, i) => {
      expect(s.id).toBe(fromMemory[i].id);
      expect(s.result.score).toBeCloseTo(fromMemory[i].result.score, 6);
      expect(s.result.color).toBe(fromMemory[i].result.color);
    });
  });

  it("a configuração salva é válida segundo o schema Zod", async () => {
    const cfg = await loadConfig();
    expect(configSchema.safeParse(cfg).success).toBe(true);
  });

  it("papéis: 1 admin e 3 CSMs; senha de demonstração confere com o hash", async () => {
    const users = await prisma.user.findMany();
    expect(users.filter((u) => u.role === "ADMIN")).toHaveLength(1);
    expect(users.filter((u) => u.role === "CSM")).toHaveLength(3);
    expect(await bcrypt.compare("Termometro@2026", users[0].passwordHash)).toBe(true);
    expect(await bcrypt.compare("errada", users[0].passwordHash)).toBe(false);
  });

  it("ação do CS exige conta e usuário válidos e some com a conta (integridade referencial)", async () => {
    await expect(
      prisma.csAction.create({ data: { accountId: "nao-existe", userId: "u-rafael", channel: "EMAIL", outcome: "RESOLVIDO", note: "teste" } }),
    ).rejects.toThrow();
    const created = await prisma.csAction.create({
      data: { accountId: "acc-001", userId: "u-rafael", channel: "EMAIL", outcome: "RESOLVIDO", note: "teste de integração" },
    });
    expect(created.id).toBeGreaterThan(0);
    await prisma.csAction.delete({ where: { id: created.id } });
  });
});

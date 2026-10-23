/**
 * Gerador de dados sintéticos do Termômetro ("Frota Leve").
 * Puro e determinístico: mesma semente + mesma data de referência => mesmo conjunto de dados.
 * Nada aqui vem de clientes reais. Ver docs/00-sobre-este-caso/dados-sinteticos.md.
 */
import { MODULES, type TicketSeverity } from "../../src/lib/score/types";

export const DEFAULT_SEED = 20261015;
export const DAY = 86_400_000;

export type Archetype =
  | "healthy"
  | "declining"
  | "lowAdoption"
  | "supportHeavy"
  | "unhappy"
  | "latePayer"
  | "newcomer"
  | "churning";

export type Plan = "BASICO" | "PROFISSIONAL" | "FROTA_PLUS";
export type Role = "ADMIN" | "CSM";
export type ActionChannel = "LIGACAO" | "EMAIL" | "WHATSAPP" | "REUNIAO";
export type ActionOutcome = "RESOLVIDO" | "EM_ANDAMENTO" | "SEM_RESPOSTA" | "ESCALADO";

export interface SynthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
export interface SynthAccount {
  id: string;
  name: string;
  segment: string;
  plan: Plan;
  vehicles: number;
  mrr: number;
  city: string;
  csmId: string;
  createdAt: Date;
  contractStart: Date;
  contractEnd: Date;
  archetype: Archetype;
}
export interface SynthUsage { accountId: string; date: Date; module: string; count: number }
export interface SynthTicket { accountId: string; openedAt: Date; resolvedAt: Date | null; category: string; severity: TicketSeverity; title: string }
export interface SynthNps { accountId: string; date: Date; score: number }
export interface SynthInvoice { accountId: string; dueDate: Date; paidAt: Date | null; amount: number }
export interface SynthAction {
  accountId: string; userId: string; createdAt: Date; channel: ActionChannel;
  playbook: string | null; note: string; outcome: ActionOutcome;
}

export interface Dataset {
  seed: number;
  referenceDate: Date;
  users: SynthUser[];
  accounts: SynthAccount[];
  usage: SynthUsage[];
  tickets: SynthTicket[];
  nps: SynthNps[];
  invoices: SynthInvoice[];
  actions: SynthAction[];
}

/** PRNG mulberry32: pequeno, rápido e determinístico. */
export function createRng(seed: number) {
  let a = seed >>> 0;
  const next = (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    between: (min: number, max: number) => min + next() * (max - min),
    int: (min: number, max: number) => Math.floor(min + next() * (max - min + 1)),
    chance: (p: number) => next() < p,
    pick: <T,>(arr: readonly T[]): T => arr[Math.floor(next() * arr.length)],
    /** distribuição normal aproximada (Box-Muller) */
    normal: (mean: number, sd: number) => {
      const u = Math.max(next(), 1e-9);
      const v = next();
      return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
  };
}
type Rng = ReturnType<typeof createRng>;

const SURNAME = ["Silva", "Souza", "Oliveira", "Santos", "Pereira", "Costa", "Rodrigues", "Almeida", "Nascimento", "Lima", "Araújo", "Ribeiro", "Carvalho", "Gomes", "Martins", "Rocha", "Barbosa", "Moreira", "Teixeira", "Mendes", "Cardoso", "Ferreira", "Cavalcanti", "Dias"];
const KIND = ["Transportes", "Logística", "Fretes", "Cargas", "Entregas", "Rotas"];
const SEGMENTS = ["Cargas secas", "Entregas urbanas", "Frigorificados", "Fretamento"] as const;
const CITIES = ["Contagem", "Betim", "Uberlândia", "Juiz de Fora", "Campinas", "Londrina", "Goiânia", "Ribeirão Preto", "Sorocaba", "Maringá", "Joinville", "Anápolis"];
const CATEGORIES = ["Rastreamento GPS", "Relatórios", "Abastecimento", "Manutenção", "Fatura e cobrança", "Acesso e login"];
const TICKET_TITLES: Record<string, string[]> = {
  "Rastreamento GPS": ["Veículo aparece offline no mapa", "Posição atrasada no rastreamento"],
  Relatórios: ["Relatório de consumo não carrega", "Exportação de relatório com erro"],
  Abastecimento: ["Lançamento de abastecimento duplicado", "Média de consumo incorreta"],
  Manutenção: ["Alerta de revisão não dispara", "Ordem de manutenção sem histórico"],
  "Fatura e cobrança": ["Dúvida sobre valor da fatura", "Segunda via de boleto"],
  "Acesso e login": ["Motorista não consegue entrar", "Redefinição de senha não chega"],
};

const PLAN_INFO: Record<Plan, { base: number; vehicles: [number, number] }> = {
  BASICO: { base: 190, vehicles: [3, 10] },
  PROFISSIONAL: { base: 490, vehicles: [11, 40] },
  FROTA_PLUS: { base: 990, vehicles: [41, 120] },
};

const ARCHETYPE_WEIGHTS: [Archetype, number][] = [
  ["healthy", 0.46],
  ["declining", 0.14],
  ["lowAdoption", 0.1],
  ["supportHeavy", 0.08],
  ["unhappy", 0.07],
  ["latePayer", 0.07],
  ["newcomer", 0.03],
  ["churning", 0.05],
];

function pickArchetype(rng: Rng): Archetype {
  let r = rng.next();
  for (const [a, w] of ARCHETYPE_WEIGHTS) {
    if (r < w) return a;
    r -= w;
  }
  return "healthy";
}

const daysAgo = (ref: Date, n: number): Date => new Date(ref.getTime() - n * DAY);
const startOfDay = (d: Date): Date => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

export function buildUsers(): SynthUser[] {
  return [
    { id: "u-marcela", name: "Marcela Andrade", email: "marcela@frotaleve.example", role: "ADMIN" },
    { id: "u-rafael", name: "Rafael Teixeira", email: "rafael@frotaleve.example", role: "CSM" },
    { id: "u-camila", name: "Camila Ferreira", email: "camila@frotaleve.example", role: "CSM" },
    { id: "u-bruno", name: "Bruno Souza", email: "bruno@frotaleve.example", role: "CSM" },
  ];
}

function genUsage(rng: Rng, acc: SynthAccount, ref: Date): SynthUsage[] {
  const out: SynthUsage[] = [];
  const start = new Date(Math.max(acc.createdAt.getTime(), ref.getTime() - 205 * DAY));
  const sizeFactor = Math.max(1, Math.sqrt(acc.vehicles) / 1.6);
  const a = acc.archetype;
  // módulos "usados" por padrão e probabilidade diária base
  let modulePool: number;
  switch (a) {
    case "lowAdoption": modulePool = rng.int(1, 2); break;
    case "churning": modulePool = rng.int(2, 3); break;
    case "newcomer": modulePool = rng.int(2, 4); break;
    case "healthy": modulePool = rng.int(4, 5); break;
    default: modulePool = rng.int(3, 5);
  }
  const modules = [...MODULES].sort(() => rng.next() - 0.5).slice(0, modulePool);
  const baseProb = a === "lowAdoption" ? 0.22 : a === "churning" ? 0.5 : a === "unhappy" ? 0.5 : 0.8;
  const declineStart = rng.int(24, 65); // dias antes de ref em que o uso começa a cair
  const declineSpeed = a === "churning" ? rng.between(0.05, 0.09) : rng.between(0.05, 0.09);

  for (let t = Math.ceil((ref.getTime() - start.getTime()) / DAY); t >= 0; t--) {
    const date = startOfDay(daysAgo(ref, t));
    const dow = date.getUTCDay();
    const weekend = dow === 0 || dow === 6;
    let trend = 1;
    if ((a === "declining" || a === "churning") && t < declineStart) trend = Math.max(a === "churning" ? 0.05 : 0.1, 1 - (declineStart - t) * declineSpeed);
    if (a === "supportHeavy" && t < 30) trend = 0.8;
    if (a === "unhappy" && t < 40) trend = 0.5;
    if (a === "newcomer") trend = Math.min(1, 0.4 + ((ref.getTime() - acc.createdAt.getTime()) / DAY - t) * 0.05);
    for (const m of modules) {
      const p = baseProb * trend * (weekend ? 0.25 : 1) * (m === "relatorios" ? 0.6 : 1);
      if (rng.next() < p) {
        const count = Math.max(1, Math.round(rng.between(1, 4) * sizeFactor * (a === "lowAdoption" ? 0.6 : 1) * Math.max(trend, 0.3)));
        out.push({ accountId: acc.id, date, module: m, count });
      }
    }
  }
  return out;
}

function genTickets(rng: Rng, acc: SynthAccount, ref: Date): SynthTicket[] {
  const out: SynthTicket[] = [];
  const rateMonthly =
    acc.archetype === "supportHeavy" ? 3.4 : acc.archetype === "churning" ? 2.2 : acc.archetype === "unhappy" ? 1.9 : acc.archetype === "declining" ? 0.8 : 0.35;
  const mainCategory = rng.pick(CATEGORIES);
  const spanDays = Math.min(150, (ref.getTime() - acc.createdAt.getTime()) / DAY);
  for (let t = spanDays; t >= 0; t -= 1) {
    if (rng.next() < rateMonthly / 30) {
      const category = (acc.archetype === "supportHeavy" || acc.archetype === "churning") && rng.chance(0.65) ? mainCategory : rng.pick(CATEGORIES);
      const r = rng.next();
      const severity: TicketSeverity = r < (acc.archetype === "supportHeavy" ? 0.2 : 0.08) ? "HIGH" : r < 0.4 ? "MEDIUM" : "LOW";
      const openedAt = new Date(daysAgo(ref, t).getTime() + rng.int(8, 17) * 3_600_000);
      if (openedAt > ref) continue; // a referência é 12h: nada pode ser aberto depois dela
      const slow = acc.archetype === "supportHeavy" && rng.chance(0.25);
      const resolveDays = slow ? rng.between(8, 14) : rng.between(0.2, 4);
      const resolvedAt = new Date(openedAt.getTime() + resolveDays * DAY);
      out.push({
        accountId: acc.id,
        openedAt,
        resolvedAt: resolvedAt > ref ? null : resolvedAt,
        category,
        severity,
        title: rng.pick(TICKET_TITLES[category]),
      });
    }
  }
  return out;
}

function genNps(rng: Rng, acc: SynthAccount, ref: Date): SynthNps[] {
  const out: SynthNps[] = [];
  const mean = { healthy: 8.8, declining: 6.8, lowAdoption: 7.0, supportHeavy: 5.8, unhappy: 3.8, churning: 2.8, latePayer: 7.6, newcomer: 8.0 }[acc.archetype];
  for (let k = 0; k < 3; k++) {
    const date = daysAgo(ref, k * 90 + rng.int(8, 60));
    if (date < acc.createdAt) continue;
    if (!rng.chance(k === 0 ? 0.72 : 0.62)) continue;
    // contas em queda: nota mais antiga era melhor
    const drift = acc.archetype === "declining" ? k * 1.6 : acc.archetype === "unhappy" ? k * 1.0 : acc.archetype === "churning" ? k * 1.5 : 0;
    const score = Math.round(Math.min(10, Math.max(0, rng.normal(mean + drift, 1.3))));
    out.push({ accountId: acc.id, date: startOfDay(date), score });
  }
  return out;
}

function genInvoices(rng: Rng, acc: SynthAccount, ref: Date): SynthInvoice[] {
  const out: SynthInvoice[] = [];
  const dueDay = rng.int(5, 25);
  const refMonth = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1));
  for (let m = 7; m >= -1; m--) {
    const dueDate = new Date(Date.UTC(refMonth.getUTCFullYear(), refMonth.getUTCMonth() - m, dueDay));
    if (dueDate < acc.createdAt || dueDate > new Date(ref.getTime() + 20 * DAY)) continue;
    let delay: number;
    if (acc.archetype === "latePayer" || acc.archetype === "churning") delay = rng.chance(0.8) ? rng.int(6, 30) : rng.int(0, 3);
    else if (acc.archetype === "unhappy" || acc.archetype === "supportHeavy") delay = rng.chance(0.15) ? rng.int(6, 12) : rng.int(-2, 3);
    else delay = rng.chance(0.04) ? rng.int(6, 10) : rng.int(-3, 3);
    const paidAt = new Date(dueDate.getTime() + delay * DAY);
    out.push({ accountId: acc.id, dueDate, paidAt: paidAt > ref ? null : paidAt, amount: acc.mrr });
  }
  return out;
}

function genActions(rng: Rng, accounts: SynthAccount[], ref: Date): SynthAction[] {
  const out: SynthAction[] = [];
  const notes: Record<string, string[]> = {
    "baixa-adocao": ["Mostrei os módulos de abastecimento e manutenção; cliente vai testar com 2 veículos.", "Agendei treinamento rápido com o motorista responsável."],
    "queda-de-uso": ["Cliente disse que trocou o responsável pela frota; reenviei o material de onboarding.", "Liguei para entender a queda; sazonalidade de fim de safra."],
    "chamados-repetidos": ["Escalei o problema de rastreamento para o suporte nível 2.", "Acompanhei os chamados abertos e passei status ao cliente."],
    "nps-baixo": ["Conversei sobre a nota; principal reclamação é a lentidão nos relatórios.", "Cliente pediu retorno após a correção prometida."],
    "renovacao-proxima": ["Enviei proposta de renovação com revisão do plano.", "Reunião de renovação marcada para a próxima semana."],
  };
  const csmIds = buildUsers().filter((u) => u.role === "CSM").map((u) => u.id);
  void csmIds;
  const targets = accounts.filter((a) => a.archetype !== "healthy");
  for (const acc of targets) {
    if (!rng.chance(0.55)) continue;
    const n = rng.int(1, 2);
    for (let i = 0; i < n; i++) {
      const playbook = rng.pick(Object.keys(notes));
      out.push({
        accountId: acc.id,
        userId: acc.csmId,
        createdAt: new Date(daysAgo(ref, rng.int(2, 55)).getTime() + rng.int(9, 17) * 3_600_000),
        channel: rng.pick(["LIGACAO", "EMAIL", "WHATSAPP", "REUNIAO"] as const),
        playbook,
        note: rng.pick(notes[playbook]),
        outcome: rng.pick(["RESOLVIDO", "EM_ANDAMENTO", "EM_ANDAMENTO", "SEM_RESPOSTA", "ESCALADO"] as const),
      });
    }
  }
  return out.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export function generateDataset(seed: number = DEFAULT_SEED, referenceDate: Date = new Date("2026-10-15T12:00:00Z"), accountCount = 120): Dataset {
  const rng = createRng(seed);
  const users = buildUsers();
  const csms = users.filter((u) => u.role === "CSM");
  const ref = referenceDate;
  const usedNames = new Set<string>();
  const accounts: SynthAccount[] = [];

  for (let i = 0; i < accountCount; i++) {
    let name = "";
    do {
      name = `${rng.pick(KIND)} ${rng.pick(SURNAME)}${rng.chance(0.3) ? ` & ${rng.pick(SURNAME)}` : ""}`;
    } while (usedNames.has(name));
    usedNames.add(name);

    const planR = rng.next();
    const plan: Plan = planR < 0.5 ? "BASICO" : planR < 0.88 ? "PROFISSIONAL" : "FROTA_PLUS";
    const info = PLAN_INFO[plan];
    const vehicles = rng.int(info.vehicles[0], info.vehicles[1]);
    const archetype = pickArchetype(rng);
    const contractEnd = startOfDay(new Date(ref.getTime() + rng.between(-6, 360) * DAY));
    const contractStart = new Date(contractEnd.getTime() - 365 * DAY);
    let createdAt = new Date(contractStart.getTime() - rng.int(0, 2) * 365 * DAY);
    let end = contractEnd;
    let start = contractStart;
    if (archetype === "newcomer") {
      createdAt = startOfDay(daysAgo(ref, rng.int(6, 24)));
      start = createdAt;
      end = new Date(createdAt.getTime() + 365 * DAY);
    }
    accounts.push({
      id: `acc-${String(i + 1).padStart(3, "0")}`,
      name,
      segment: rng.pick(SEGMENTS),
      plan,
      vehicles,
      mrr: info.base + vehicles * 12,
      city: rng.pick(CITIES),
      csmId: csms[i % csms.length].id,
      createdAt,
      contractStart: start,
      contractEnd: end,
      archetype,
    });
  }

  const usage = accounts.flatMap((a) => genUsage(rng, a, ref));
  const tickets = accounts.flatMap((a) => genTickets(rng, a, ref));
  const nps = accounts.flatMap((a) => genNps(rng, a, ref));
  const invoices = accounts.flatMap((a) => genInvoices(rng, a, ref));
  const actions = genActions(rng, accounts, ref);
  return { seed, referenceDate: ref, users, accounts, usage, tickets, nps, invoices, actions };
}


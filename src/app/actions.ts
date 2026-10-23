"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, destroySession, getSession } from "@/lib/auth";
import { loadConfig, loadPortfolio } from "@/lib/data";
import { configSchema, computeScore } from "@/lib/score/engine";
import { countByColor, scorePortfolio } from "@/lib/score/portfolio";
import { getReferenceDate } from "@/lib/reference";
import type { ScoreConfig } from "@/lib/score/types";

export interface FormState {
  error?: string;
  ok?: string;
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const valid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !valid) return { error: "E-mail ou senha incorretos" };
  await createSession({ userId: user.id, name: user.name, role: user.role });
  redirect("/");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}

const actionSchema = z.object({
  accountId: z.string().min(1),
  channel: z.enum(["LIGACAO", "EMAIL", "WHATSAPP", "REUNIAO"]),
  playbook: z.string().optional(),
  outcome: z.enum(["RESOLVIDO", "EM_ANDAMENTO", "SEM_RESPOSTA", "ESCALADO"]),
  note: z.string().trim().min(5, "Descreva a ação com pelo menos 5 caracteres").max(1000, "Máximo de 1000 caracteres"),
});

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Sessão expirada. Entre novamente." };
  const parsed = actionSchema.safeParse({
    accountId: formData.get("accountId"),
    channel: formData.get("channel"),
    playbook: formData.get("playbook") || undefined,
    outcome: formData.get("outcome"),
    note: formData.get("note"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data } = await loadPortfolio();
  const accountData = data.find((d) => d.account.id === parsed.data.accountId);
  if (!accountData) return { error: "Conta não encontrada" };
  const result = computeScore(accountData, getReferenceDate(), await loadConfig());

  await prisma.csAction.create({
    data: {
      accountId: parsed.data.accountId,
      userId: session.userId,
      channel: parsed.data.channel,
      playbook: parsed.data.playbook ?? null,
      outcome: parsed.data.outcome,
      note: parsed.data.note,
      scoreAtTime: result.score,
      colorAtTime: result.color,
    },
  });
  revalidatePath(`/contas/${parsed.data.accountId}`);
  return { ok: "Ação registrada." };
}

export interface PreviewResult {
  error?: string;
  counts?: { GREEN: number; YELLOW: number; RED: number };
  mrrAtRisk?: number;
}

function parseConfigInput(input: unknown): { config?: ScoreConfig; error?: string } {
  const parsed = configSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  return { config: parsed.data };
}

/** Simula uma configuração sem salvar (mostra o efeito antes de aplicar). */
export async function previewConfig(input: unknown): Promise<PreviewResult> {
  const session = await getSession();
  if (!session) return { error: "Sessão expirada" };
  const { config, error } = parseConfigInput(input);
  if (!config) return { error };
  const { data } = await loadPortfolio();
  const scores = scorePortfolio(data, getReferenceDate(), config);
  const mrrAtRisk = scores.filter((s) => s.result.color === "RED").reduce((sum, s) => sum + s.mrr, 0);
  return { counts: countByColor(scores), mrrAtRisk };
}

export async function saveConfig(input: unknown): Promise<PreviewResult & { saved?: boolean }> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return { error: "Apenas administradores podem alterar a configuração" };
  const { config, error } = parseConfigInput(input);
  if (!config) return { error };
  await prisma.scoreConfigRow.upsert({
    where: { id: "default" },
    create: { id: "default", weights: config.weights, thresholds: config.thresholds, updatedBy: session.userId },
    update: { weights: config.weights, thresholds: config.thresholds, updatedBy: session.userId },
  });
  revalidatePath("/", "layout");
  const preview = await previewConfig(config);
  return { ...preview, saved: true };
}

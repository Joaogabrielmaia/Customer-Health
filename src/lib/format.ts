const TZ = "UTC";

export const brl = (n: number): string => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
export const num1 = (n: number): string => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const dateBR = (d: Date): string => d.toLocaleDateString("pt-BR", { timeZone: TZ });
export const dateTimeBR = (d: Date): string =>
  d.toLocaleString("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const signed = (n: number): string => `${n > 0 ? "+" : n < 0 ? "−" : ""}${num1(Math.abs(n))}`;

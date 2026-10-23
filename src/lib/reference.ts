/** "Hoje" do estudo. Os dados são sintéticos e gerados em relação a esta data (ver docs/00-sobre-este-caso). */
export function getReferenceDate(): Date {
  return new Date(`${process.env.REFERENCE_DATE ?? "2026-10-15"}T12:00:00Z`);
}

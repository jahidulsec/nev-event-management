const ROLE_LABELS: Record<string, string> = {
  superadmin: "Super admin",
  ao: "AO",
  flm: "FLM",
  slm: "SLM",
  ec: "EC",
  marketing: "Marketing",
  director_sales: "Director sales",
  franchise_head: "Franchise head",
};

export const getRoleLabel = (role?: string | null) => {
  if (!role) return "";

  return (
    ROLE_LABELS[role] ??
    role.replace(/_/g, " ").replace(/^\w/, (char) => char.toUpperCase())
  );
};

export const getFirstName = (name?: string | null) =>
  name?.trim().split(/\s+/)[0] || "there";

/** Month-over-month change in percent, or `null` when there is no base to compare against. */
export const getChangePercent = (current: number, previous: number) =>
  previous > 0 ? ((current - previous) / previous) * 100 : null;

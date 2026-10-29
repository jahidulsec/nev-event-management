import "dotenv/config";
import { db } from "@/config/db";
import type { Prisma } from "@/lib/generated/prisma/client";

// copy rows from the old singular tables into the new plural tables.
// rows keep their id, so running it again updates what was already copied.
// usage: npx tsx scripts/migrate-data.ts [--dry-run]

const DRY_RUN = process.argv.includes("--dry-run");
const CHUNK_SIZE = 500;

type Upsert = Prisma.PrismaPromise<unknown>;

const stats: Record<string, { copied: number; skipped: number }> = {};

const copy = async <T extends { id: string }>(
  table: string,
  rows: T[],
  toUpsert: (row: T) => Upsert | null,
) => {
  const ops = rows.map((row) => ({ row, op: toUpsert(row) }));
  const valid = ops.filter((o) => o.op !== null) as { row: T; op: Upsert }[];
  stats[table] = { copied: 0, skipped: ops.length - valid.length };

  if (DRY_RUN) {
    stats[table].copied = valid.length;
    return;
  }

  for (let i = 0; i < valid.length; i += CHUNK_SIZE) {
    const chunk = valid.slice(i, i + CHUNK_SIZE);
    try {
      await db.$transaction(chunk.map((c) => c.op));
      stats[table].copied += chunk.length;
    } catch {
      // retry one by one so a single bad row doesn't drop the whole chunk
      for (const c of chunk) {
        try {
          await toUpsert(c.row);
          stats[table].copied++;
        } catch (e) {
          stats[table].skipped++;
          console.error(`${table} ${c.row.id}:`, (e as Error).message);
        }
      }
    }
  }

  console.log(`${table}: ${stats[table].copied} copied, ${stats[table].skipped} skipped`);
};

/**
 * Old tables reference users by work_area_code, new tables by employee_id.
 * Area users are found through users_area (work_area_code = sap_area_code),
 * the rest (marketing, ec, director ...) by matching their email to users.
 */
const buildEmployeeResolver = async () => {
  const [usersArea, users, details, ...roleTables] = await Promise.all([
    db.users_area.findMany({ select: { sap_area_code: true, employee_id: true } }),
    db.users.findMany({ select: { employee_id: true, email: true } }),
    db.user_details.findMany({ select: { user_id: true, email: true } }),
    db.ao.findMany({ select: { work_area_code: true, email: true } }),
    db.flm.findMany({ select: { work_area_code: true, email: true } }),
    db.slm.findMany({ select: { work_area_code: true, email: true } }),
    db.marketing.findMany({ select: { work_area_code: true, email: true } }),
    db.ec.findMany({ select: { work_area_code: true, email: true } }),
    db.franchise_head.findMany({ select: { work_area_code: true, email: true } }),
    db.director.findMany({ select: { work_area_code: true, email: true } }),
  ]);

  const byArea = new Map(usersArea.map((u) => [u.sap_area_code, u.employee_id]));
  const byEmail = new Map(users.map((u) => [u.email.trim().toLowerCase(), u.employee_id]));

  const emailOf = new Map<string, string>();
  for (const d of details) if (d.email) emailOf.set(d.user_id, d.email);
  for (const r of roleTables.flat()) if (r.email) emailOf.set(r.work_area_code, r.email);

  const unresolved = new Set<string>();

  const resolve = (work_area_code: string) => {
    const employee_id =
      byArea.get(work_area_code) ??
      byEmail.get(emailOf.get(work_area_code)?.trim().toLowerCase() ?? "") ??
      null;
    if (!employee_id) unresolved.add(work_area_code);
    return employee_id;
  };

  return { resolve, unresolved };
};

async function main() {
  if (DRY_RUN) console.log("dry run, nothing is written\n");

  const { resolve, unresolved } = await buildEmployeeResolver();

  // parents first so foreign keys exist when children are copied
  const events = await db.event.findMany();
  await copy("events", events, ({ id, user_id, ...e }) => {
    const data = { ...e, employee_id: resolve(user_id), sap_area_code: user_id };
    return db.events.upsert({ where: { id }, create: { id, ...data }, update: data });
  });

  const approvers = await db.event_approver.findMany();
  await copy("event_approvers", approvers, ({ id, user_id, ...a }) => {
    const data = { ...a, employee_id: resolve(user_id), sap_area_code: user_id };
    return db.event_approvers.upsert({ where: { id }, create: { id, ...data }, update: data });
  });

  const histories = await db.event_status_history.findMany();
  await copy("event_status_histories", histories, ({ id, ...data }) =>
    db.event_status_histories.upsert({ where: { id }, create: { id, ...data }, update: data }),
  );

  const attachments = await db.event_attachment.findMany();
  await copy("event_attachments", attachments, ({ id, ...data }) =>
    db.event_attachments.upsert({ where: { id }, create: { id, ...data }, update: data }),
  );

  const budgets = await db.event_budget.findMany();
  await copy("event_budgets", budgets, ({ id, ...data }) =>
    db.event_budgets.upsert({ where: { id }, create: { id, ...data }, update: data }),
  );

  const consultants = await db.event_consultant.findMany();
  await copy("event_consultants", consultants, ({ id, ...data }) =>
    db.event_consultants.upsert({ where: { id }, create: { id, ...data }, update: data }),
  );

  const consultantApprovals = await db.event_consultant_approval.findMany();
  await copy("event_consultant_approvals", consultantApprovals, ({ id, ...data }) =>
    db.event_consultant_approvals.upsert({ where: { id }, create: { id, ...data }, update: data }),
  );

  // employee_id is required on notifications, so rows without a user are skipped
  const notifications = await db.notification.findMany();
  await copy("notifications", notifications, ({ id, work_area_code, ...n }) => {
    const employee_id = resolve(work_area_code);
    if (!employee_id) return null;
    const data = { ...n, employee_id };
    return db.notifications.upsert({ where: { id }, create: { id, ...data }, update: data });
  });

  console.table(stats);
  if (unresolved.size) {
    console.warn("work_area_code without a matching employee:", [...unresolved].join(", "));
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });

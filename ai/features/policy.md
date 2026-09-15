# ABAC Policy Table + Evaluator (self-contained, admin-manageable)

## Context

The app has no centralized authorization today — every admin page (`app/dashboard/(admin)/products/page.tsx:41-43`, `doctors/page.tsx:41-43`, `employees/page.tsx:41-43`, `permission/page.tsx:5-7`, `events/[id]/page.tsx:22-24`, etc.) inlines its own `if (role !== "superadmin")` check, and server actions have no checks at all. Separately, the data model already carries attribute data nothing consumes for authorization: `role` (name only), `users_role` (user↔role), `users_area` (user↔area, managed at `app/dashboard/(admin)/users/relation`), `user_product` (user↔product). `lib/server-cache.ts` even reserves an unused `permissions` cache tag.

This plan adds a **self-contained** ABAC capability: a new `policy` table holding generic JSON-condition rules, an evaluator/authorize function, and a new admin CRUD page to manage policy rows — all as new files. **Nothing existing is modified**: no changes to `role`/`users`/`users_role`/`users_area`/`user_product`/`events*` schema, no changes to `login.ts`/session/`types/auth-user.ts`, no changes to any existing page, action, layout, or nav component. Wiring the evaluator into existing pages/actions is explicitly left for a later, separate task.

## Data model — `prisma/schema.prisma` (additive only)

```prisma
enum policy_effect {
  allow
  deny
}

model policy {
  id          String        @id @default(dbgenerated()) // nanoid(10), matching users_role/users_area style
  name        String
  description String?
  resource    String        // e.g. "users", "role", "policy", "area", "product", "events", "*"
  action      String        // e.g. "create", "read", "update", "delete", "approve", "export", "*"
  effect      policy_effect @default(allow)
  conditions  Json?         // { match: "all" | "any", rules: [{ attribute, operator, value }] }
  priority    Int           @default(0)
  enabled     Boolean       @default(true)
  created_at  DateTime      @default(now())
  updated_at  DateTime      @updatedAt

  @@index([resource, action])
}
```

`resource`/`action` are validated against fixed const catalogs in code (not DB-editable), so a policy can't reference something nothing checks. `conditions` is the generic rule payload — a flat list of `{attribute, operator, value}` combined with `match: "all"|"any"`:
- `attribute`: `subject.role`, `subject.areas`, `subject.products`, `subject.employeeId`, `subject.designation`, `subject.group`, or `resource.<key>` (caller-supplied per check, e.g. `resource.sap_area_code`, `resource.product_id`, `resource.status`, `resource.employee_id`).
- `operator`: `eq | ne | in | not_in | contains`.
- `value`: a literal, or a subject-reference string prefixed `$subject.` (e.g. `$subject.areas`) so a rule can express "resource's area must be one of the subject's granted areas" — the attribute-based comparison that distinguishes this from static RBAC.

## Core engine — `lib/abac/` (new files, nothing existing touched)

- `lib/abac/catalog.ts` — `RESOURCES` / `ACTIONS` const arrays + `Resource`/`Action` types; the enforceable vocabulary.
- `lib/abac/subject.ts` — `getSubjectAttributes(employeeId: string)`: read-only queries against the **existing** `users_role`, `users_area`, `user_product`, and `users` tables (no schema change, just `findMany`/`findUnique`) to build `{ employeeId, roles: string[], areas: string[], products: string[], designation, group }`. Returns an empty-attribute subject if `employeeId` doesn't resolve to a `users` row.
- `lib/abac/policies.ts` — `getPolicies()`: reads enabled `policy` rows via `cachedRead` from `lib/server-cache.ts`, reusing the existing reserved `cacheTags.permissions` tag (add a sibling `permissionsCount` tag for the count query, same pairing style as `roles`/`rolesCount`) — this is the only touch to `server-cache.ts`, purely additive.
- `lib/abac/evaluate.ts` — pure functions: `resolveValue(value, subject)` (resolves `$subject.*` refs), `evaluateRule(rule, subject, resource)`, `evaluateConditions(conditions, subject, resource)` (`all`/`any`), and `decide(policies, subject, resource, action, resourceAttrs)` → filters policies by resource/action match (exact or `"*"`), evaluates conditions, applies **deny-overrides, default-deny** (matching `deny` wins over `allow`; no match = deny).
- `lib/abac/authorize.ts` — the public entry points:
  - `can(employeeId: string, resource: Resource, action: Action, resourceAttrs?: Record<string, string | number | boolean | null>): Promise<boolean>` — builds subject via `getSubjectAttributes`, loads policies, calls `decide`.
  - `requirePermission(employeeId, resource, action, resourceAttrs?)` — throws if denied (a typed `ForbiddenError`), for callers that want exception-based flow.

These are the only two exports later work (page guards, action guards, nav filtering) would call — none of that wiring is part of this plan.

## Admin dashboard UI — new "Policies" feature (new files only)

Mirrors the existing `features/role/*` pattern exactly, so it fits the codebase's established layered convention:

- `features/policy/schema/schema.ts` — zod DTO: `name`, `description?`, `resource` (enum from catalog), `action` (enum from catalog), `effect` (`allow`/`deny`), `priority` (number), `enabled` (bool), `conditions` (`{ match: z.enum(["all","any"]), rules: z.array(z.object({attribute, operator, value})) }`).
- `features/policy/actions/policy.ts` — `createPolicy`/`updatePolicy`/`deletePolicy`, thin `"use server"` wrappers over `services/policy.ts` with the same `apiResponse` + try/catch shape as `features/role/actions/role.ts`.
- `features/policy/libs/policy.ts` — `getPolicies(query)` (paginated/searchable, cached), `getPolicy(id)`.
- `services/policy.ts` — Prisma CRUD + `cachedRead`/`mutate` wiring, tags from `lib/abac/policies.ts`'s tag additions.
- `features/policy/components/{form,table,create-button}.tsx` — table listing name/resource/action/effect/priority/enabled with edit (sheet) / delete (alert modal), matching `features/role/components/*`. The condition editor is a repeatable row list (attribute select, operator select, value input with a toggle for "compare to subject's own attribute" → sets a `$subject.*` value) plus a top-level all/any selector, built from existing primitives (`Field`, `Combobox`, `FormSheet`, `react-hook-form` + zod) — no new condition-builder library.
- `app/dashboard/(admin)/policies/page.tsx` — list page using `SearchForm` + `CreatePolicyButton` + Suspense-wrapped table container, same shape as `app/dashboard/(admin)/role/page.tsx`. Route name `policies` (not `permission`, since `/permission` already exists for the unrelated event-type approval chain). This new page inherits whatever the existing `app/dashboard/layout.tsx` guard currently does — that guard is not modified by this plan.

## Explicitly out of scope (left for a later task)

- No changes to `role`, `users`, `users_role`, `users_area`, `user_product`, `events*`, or any other existing table.
- No changes to `login.ts`, `types/auth-user.ts`, or session/cookie handling.
- No changes to any existing page's authorization check, any existing server action, `app/dashboard/layout.tsx`, or nav components.
- No seeding of default policies, no wiring of `can`/`requirePermission` into any real page or mutation.

## Verification

No test runner is configured in this repo. Verification is manual + static:

- `npx prisma migrate dev` applies the new `policy` model cleanly against the existing schema.
- `npm run lint` and `npx tsc --noEmit` pass.
- `npm run dev`: open `/dashboard/(admin)/policies`, create/edit/delete a policy row (including a condition with a `$subject.` reference), confirm it persists and the list/search/pagination work.
- Unit-verify the evaluator directly (no test runner available, so a scratch script via `tsx`): call `decide()` with a couple of hand-built policies + subjects/resources covering `allow`, `deny`-overrides-`allow`, `$subject.areas` membership, and default-deny-when-no-match, confirming each returns the expected boolean.

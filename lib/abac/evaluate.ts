import { AbacSubject } from "./subject";

export type ConditionOperator = "eq" | "ne" | "in" | "not_in" | "contains";

export type ConditionValue =
  | string
  | number
  | boolean
  | (string | number)[];

export type ConditionRule = {
  attribute: string; // "subject.<key>" or "resource.<key>"
  operator: ConditionOperator;
  value: ConditionValue;
};

export type PolicyConditions = {
  match: "all" | "any";
  rules: ConditionRule[];
};

export type ResourceAttributes = Record<
  string,
  string | number | boolean | null | undefined
>;

export type PolicyLike = {
  resource: string;
  action: string;
  effect: "allow" | "deny";
  conditions: unknown;
};

const SUBJECT_PREFIX = "subject.";
const RESOURCE_PREFIX = "resource.";
const SUBJECT_REF_PREFIX = "$subject.";

const getSubjectAttributeValue = (subject: AbacSubject, key: string) => {
  switch (key) {
    case "employeeId":
      return subject.employeeId;
    case "role":
    case "roles":
      return subject.roles;
    case "areas":
      return subject.areas;
    case "products":
      return subject.products;
    case "designation":
      return subject.designation;
    case "group":
      return subject.group;
    default:
      return undefined;
  }
};

const resolveAttribute = (
  attribute: string,
  subject: AbacSubject,
  resource: ResourceAttributes,
) => {
  if (attribute.startsWith(SUBJECT_PREFIX)) {
    return getSubjectAttributeValue(
      subject,
      attribute.slice(SUBJECT_PREFIX.length),
    );
  }
  if (attribute.startsWith(RESOURCE_PREFIX)) {
    return resource[attribute.slice(RESOURCE_PREFIX.length)];
  }
  return undefined;
};

const resolveValue = (value: ConditionValue, subject: AbacSubject) => {
  if (typeof value === "string" && value.startsWith(SUBJECT_REF_PREFIX)) {
    return getSubjectAttributeValue(
      subject,
      value.slice(SUBJECT_REF_PREFIX.length),
    );
  }
  return value;
};

const toArray = <T>(value: T | T[] | undefined | null): T[] =>
  value === undefined || value === null
    ? []
    : Array.isArray(value)
      ? value
      : [value];

const valuesEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export const evaluateRule = (
  rule: ConditionRule,
  subject: AbacSubject,
  resource: ResourceAttributes,
): boolean => {
  const left = resolveAttribute(rule.attribute, subject, resource);
  const right = resolveValue(rule.value, subject);

  switch (rule.operator) {
    case "eq":
      return valuesEqual(left, right);
    case "ne":
      return !valuesEqual(left, right);
    case "in":
      return toArray(right).some((r) => valuesEqual(r, left));
    case "not_in":
      return !toArray(right).some((r) => valuesEqual(r, left));
    case "contains":
      return toArray(left).some((l) => valuesEqual(l, right));
    default:
      return false;
  }
};

export const evaluateConditions = (
  conditions: unknown,
  subject: AbacSubject,
  resource: ResourceAttributes,
): boolean => {
  const parsed = conditions as PolicyConditions | null | undefined;

  if (!parsed || !parsed.rules || parsed.rules.length === 0) return true;

  const results = parsed.rules.map((rule) =>
    evaluateRule(rule, subject, resource),
  );

  return parsed.match === "any" ? results.some(Boolean) : results.every(Boolean);
};

const matchesResourceAction = (
  policy: PolicyLike,
  resource: string,
  action: string,
) =>
  (policy.resource === "*" || policy.resource === resource) &&
  (policy.action === "*" || policy.action === action);

/**
 * Deny-overrides, default-deny: any matching "deny" policy wins; otherwise
 * any matching "allow" policy grants access; no match denies.
 */
export const decide = (
  policies: PolicyLike[],
  subject: AbacSubject,
  resource: string,
  action: string,
  resourceAttrs: ResourceAttributes = {},
): boolean => {
  const matching = policies.filter(
    (p) =>
      matchesResourceAction(p, resource, action) &&
      evaluateConditions(p.conditions, subject, resourceAttrs),
  );

  if (matching.some((p) => p.effect === "deny")) return false;
  return matching.some((p) => p.effect === "allow");
};

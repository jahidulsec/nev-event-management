import { getSubjectAttributes } from "./subject";
import { getActivePolicies } from "./policies";
import { decide, ResourceAttributes } from "./evaluate";
import { Action, Resource } from "./catalog";

export class ForbiddenError extends Error {
  constructor(resource: string, action: string) {
    super(`Not permitted to ${action} ${resource}`);
    this.name = "ForbiddenError";
  }
}

export const can = async (
  employeeId: string,
  resource: Resource,
  action: Action,
  resourceAttrs?: ResourceAttributes,
): Promise<boolean> => {
  const [subject, policies] = await Promise.all([
    getSubjectAttributes(employeeId),
    getActivePolicies(),
  ]);

  return decide(policies, subject, resource, action, resourceAttrs);
};

export const requirePermission = async (
  employeeId: string,
  resource: Resource,
  action: Action,
  resourceAttrs?: ResourceAttributes,
): Promise<void> => {
  const allowed = await can(employeeId, resource, action, resourceAttrs);
  if (!allowed) throw new ForbiddenError(resource, action);
};

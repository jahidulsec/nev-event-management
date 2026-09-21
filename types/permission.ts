/** Row-level actions a table may show, resolved on the server from the role's permissions. */
export type RowPermissions = {
  update?: boolean;
  delete?: boolean;
};

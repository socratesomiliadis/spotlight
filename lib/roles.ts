export const appRoles = ["user", "staff", "admin"] as const
export type AppRole = (typeof appRoles)[number]
export type StaffAssignableRole = Exclude<AppRole, "admin">

function isAppRole(value: string): value is AppRole {
  return appRoles.includes(value as AppRole)
}

export function roleValues(role: unknown): AppRole[] {
  const values = Array.isArray(role)
    ? role
    : typeof role === "string"
      ? role.split(",")
      : []

  return values.map((value) => String(value).trim()).filter(isAppRole)
}

export function normalizeRole(role: unknown): AppRole {
  return roleValues(role)[0] || "user"
}

export function hasStaffAccess(role: unknown) {
  const roles = roleValues(role)
  return roles.includes("staff") || roles.includes("admin")
}

export function hasAdminAccess(role: unknown) {
  return roleValues(role).includes("admin")
}

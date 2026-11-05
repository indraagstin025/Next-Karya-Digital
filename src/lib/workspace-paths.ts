export const WORKSPACE_PATH_PREFIXES = [
  "/dashboard",
  "/cms",
  "/crm",
  "/pengaturan",
] as const;

export function isWorkspacePath(pathname: string): boolean {
  return WORKSPACE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

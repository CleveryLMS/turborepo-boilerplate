/** Devolvemos TRUE si el rol del usuario está en la lista de roles permitidos. */
export const isRoleAllowed = (rolesAllowed: string[], currentRole?: string): boolean => {
  if (!currentRole) return false;
  else return rolesAllowed.includes(currentRole);
};

/**
 * Comprueba si el usuario tiene permisos para ejecutar la acción
 *
 * @param key Permisos a comprobar
 */
export const checkPermissions = (key?: boolean) => {
  return key === false ? false : true;
};

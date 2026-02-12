export const ROUTEPATHS = {
  LOGIN: '/inicio-sesion',
  REGISTER: '/registro',
  DASHBOARD: '/app/dashboard',
  PROFILE: '/app/perfil',
  USERS: '/app/usuarios',
} as const;

export type ROUTEPATH = (typeof ROUTEPATHS)[keyof typeof ROUTEPATHS];
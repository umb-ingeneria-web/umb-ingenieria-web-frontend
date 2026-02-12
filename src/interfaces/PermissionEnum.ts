export const PermissionEnum = {

    //Permisos de usuarios
    USER_READ: 'USER_READ',
    USER_WRITE: 'USER_WRITE',
    ROLE_SWITCH: 'ROLE_SWITCH',

} as const;

export type PermissionEnum = (typeof PermissionEnum)[keyof typeof PermissionEnum];
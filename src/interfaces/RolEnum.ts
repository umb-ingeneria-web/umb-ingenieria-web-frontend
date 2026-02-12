export const RolEnum = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const;

export type RolEnum = (typeof RolEnum)[keyof typeof RolEnum];
export const AllRoles = Object.values(RolEnum) as RolEnum[];

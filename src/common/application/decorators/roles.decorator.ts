import { SetMetadata } from "@nestjs/common";

import { Roles } from "@common/domain/enums";

export const ROLE_KEY = 'role';
export const Role = (...roles: Roles[]) => (SetMetadata(ROLE_KEY, roles));
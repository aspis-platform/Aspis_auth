import { SetMetadata } from '@nestjs/common';
import { UserAuthority } from 'src/domain/user/entity/authority.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserAuthority[]) => SetMetadata(ROLES_KEY, roles); //roles.guard연결
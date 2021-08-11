import { UserRole } from '@vnbp/common/dist/models'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserDto } from '../../../../common/dist/models'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> {
    const roles = this._reflector.get<UserRole[]>('roles', ctx.getHandler())

    if (!roles) return true

    const req = ctx.switchToHttp().getRequest()
    const user = req.user as UserDto

    return user && matchRoles(roles, user.roles)
  }
}

const matchRoles = (
  roles: string[],
  userRoles: string[]
): boolean | Promise<boolean> => {
  return roles.every((role) => userRoles?.indexOf(role) > -1)
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/users/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ActiveUserData } from 'src/interfaces/active-user-data.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!contextRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user: ActiveUserData }>();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    const hasRole = contextRoles.includes(user.role);
    console.log('User role:', user.role);
    console.log('Has required role:', hasRole);

    return hasRole;
  }
}

import { UserRole } from 'src/modules/users/enums/user-role.enum';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: UserRole;
}

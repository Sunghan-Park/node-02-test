import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from '../authentication/dto/register.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './enums/user-role.enum';
import { RegisterType } from './enums/register-type.enum';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(registerDto: RegisterDto) {
    const user = this.userRepository.create({
      ...registerDto,
      role: UserRole.USER,
    });
    await this.userRepository.save(user);

    const { password, ...rest } = user;
    return rest;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });
  }

  async findUserBySocialId(
    socialId: string,
    registerType: RegisterType,
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { socialId, registerType },
    });
  }
}

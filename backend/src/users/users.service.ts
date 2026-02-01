import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserRole } from './enum/user-role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUserAccount(createUserDto: CreateUserDto): Promise<User> {
    const exitingUser = await this.repo.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (exitingUser) {
      throw new Error('User with given email or username already exists');
    }

    const user = this.repo.create({
      ...createUserDto,
      role: createUserDto.role || UserRole.GUEST,
    });

    return await this.repo.save(user);
  }

  async findByUsernameOrEmail(
    username?: string,
    email?: string,
  ): Promise<User | null> {
    const where: FindOptionsWhere<User>[] = [];
    if (username) {
      where.push({ username });
    }
    if (email) {
      where.push({ email });
    }

    return await this.repo.findOne({
      where,
    });
  }
}

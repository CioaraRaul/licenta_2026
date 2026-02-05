import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './auth/dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { UserRole } from './enum/user-role.enum';
import { Buyer } from './entities/buyer.entity';
import { Seller } from './entities/seller.entity';
import { Admin } from './entities/admin.entity';
import { Guest } from './entities/guest.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Buyer) private buyerRepo: Repository<Buyer>,
    @InjectRepository(Seller) private sellerRepo: Repository<Seller>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(Guest) private guestRepo: Repository<Guest>,
  ) {}

  async createUserAccount(createUserDto: CreateUserDto): Promise<User> {
    const exitingUser = await this.userRepo.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (exitingUser) {
      throw new Error('User with given email or username already exists');
    }

    let user: User;

    switch (createUserDto.role) {
      case UserRole.BUYER:
        user = this.buyerRepo.create(createUserDto);
        return await this.buyerRepo.save(user);
      case UserRole.SELLER:
        user = this.sellerRepo.create(createUserDto);
        return await this.sellerRepo.save(user);
      case UserRole.ADMIN:
        user = this.adminRepo.create(createUserDto);
        return await this.adminRepo.save(user);
      case UserRole.GUEST:
        user = this.guestRepo.create(createUserDto);
        return await this.guestRepo.save(user);
    }
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

    return await this.userRepo.findOne({
      where,
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async updateResetToken(
    userId: number,
    resetToken: string,
    resetTokenExpires: Date,
  ): Promise<void> {
    await this.userRepo.update(userId, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires,
    });
  }

  async findByResetToken(resetToken: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepo.update(userId, {
      password: hashedPassword,
    });
  }

  async clearResetToken(userId: number): Promise<void> {
    await this.userRepo.update(userId, {
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  create(createUserDto: CreateUserDto) {
    return this.createUserAccount(createUserDto);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.findById(id);
  }

  update(id: number, updateUserDto: any) {
    return this.userRepo.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }

  async updateVerificationToken(
    userId: number,
    verificationToken: string,
    verificationExpires: Date,
  ): Promise<void> {
    await this.userRepo.update(userId, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: MoreThan(new Date()),
      },
    });
  }

  async verifyUserEmail(userId: number): Promise<void> {
    await this.userRepo.update(userId, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });
  }
}

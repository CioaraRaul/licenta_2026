import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './auth/dtos/create-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
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
    const existingUser = await this.userRepo.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new Error('User with given email or username already exists');
    }

    const user = this.userRepo.create(createUserDto);
    const savedUser = await this.userRepo.save(user);

    switch (createUserDto.role) {
      case UserRole.BUYER: {
        const buyer = this.buyerRepo.create({ userId: savedUser.id });
        await this.buyerRepo.save(buyer);
        break;
      }
      case UserRole.SELLER: {
        const seller = this.sellerRepo.create({ userId: savedUser.id });
        await this.sellerRepo.save(seller);
        break;
      }
      case UserRole.ADMIN: {
        const admin = this.adminRepo.create({ userId: savedUser.id });
        await this.adminRepo.save(admin);
        break;
      }
      case UserRole.GUEST: {
        const guest = this.guestRepo.create({ userId: savedUser.id });
        await this.guestRepo.save(guest);
        break;
      }
    }

    return savedUser;
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

  update(id: number, updateUserDto: UpdateProfileDto) {
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

  async deactivateAccount(userId: number): Promise<void> {
    await this.userRepo.update(userId, {
      isActive: false,
      deactivatedAt: new Date(),
    });
  }

  async reactivateAccount(userId: number): Promise<void> {
    await this.userRepo.update(userId, {
      isActive: true,
      deactivatedAt: null,
    });
  }

  async deleteAccount(userId: number): Promise<void> {
    await this.userRepo.delete(userId);
  }
}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Buyer } from './entities/buyer.entity';
import { Seller } from './entities/seller.entity';
import { Guest } from './entities/guest.entity';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Buyer, Seller, Admin, Guest])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}

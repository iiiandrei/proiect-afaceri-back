import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../typeorm/entities/user.entity';
import { AnnouncementEntity } from 'src/typeorm/entities/announcement.entity';
import { UserBasketEntity } from 'src/typeorm/entities/user-basket-item.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AnnouncementEntity,
      UserBasketEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}

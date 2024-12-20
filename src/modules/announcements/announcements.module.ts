import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementEntity } from 'src/typeorm/entities/announcement.entity';
import { UserBasketEntity } from 'src/typeorm/entities/user-basket-item.entity';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from 'src/typeorm/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnnouncementEntity,
      UserBasketEntity,
      UserEntity,
    ]),
  ],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService, AuthService],
})
export class AnnouncementModule {}

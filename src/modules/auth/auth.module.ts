import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../typeorm/entities/user.entity';
import { UserBasketEntity } from 'src/typeorm/entities/user-basket-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserBasketEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './typeorm/database.module';
import { AnnouncementModule } from './modules/announcements/announcements.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AnnouncementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

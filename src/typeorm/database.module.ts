
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        useFactory: () => ({
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: parseInt(process.env.MYSQL_PORT) || 3306,
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          logging: false,
          entities: ["dist/typeorm/entities/*.entity{.ts,.js}"],
          migrations: ["dist/migrations/*{.ts,.js}"],
          synchronize: true
        }),
      inject: [ConfigService]
    }),
  ],
})
export class DatabaseModule {}
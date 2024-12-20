import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { AnnouncementEntity } from 'src/typeorm/entities/announcement.entity';
import { AuthUser } from '../auth/decorators/auth.decorator';
import { UserEntity } from 'src/typeorm/entities/user.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join('./uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createAnnouncement(
    @Body() body: CreateAnnouncementDto,
    @AuthUser() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AnnouncementEntity> {
    return await this.announcementsService.createAnnouncement(user, body, file);
  }

  @Get('my-announcements')
  @UseGuards(AuthGuard)
  async getMyAnnouncements(
    @AuthUser() user: UserEntity,
    @Query('search_input') searchInput: string,
  ): Promise<AnnouncementEntity[]> {
    return await this.announcementsService.getMyAnnouncements(user, searchInput);
  }

  @Get('all-announcements')
  @UseGuards(AuthGuard)
  async getAllAnnouncements(
    @Query() pagination: PaginationDto
  ): Promise<AnnouncementEntity[]> {
    return await this.announcementsService.getAllAnnouncements(pagination);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join('./uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateAnnouncement(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAnnouncementDto,
    @AuthUser() user: UserEntity,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    await this.announcementsService.updateAnnouncement(id, body, user, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ) {
    await this.announcementsService.deleteAnnouncement(id, user);
  }
}

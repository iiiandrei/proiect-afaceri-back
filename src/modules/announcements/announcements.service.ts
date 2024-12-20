import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '../../typeorm/entities/user.entity';
import { AnnouncementEntity } from 'src/typeorm/entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UserBasketEntity } from 'src/typeorm/entities/user-basket-item.entity';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { promises as fs } from 'fs';
import { PaginationDto } from './dto/pagination.dto';
const path = require('path');

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private announcementRepository: Repository<AnnouncementEntity>,
    @InjectRepository(UserBasketEntity)
    private announcementFileRepository: Repository<UserBasketEntity>,
  ) {}

  public async createAnnouncement(
    user: UserEntity,
    createAnnouncementDto: CreateAnnouncementDto,
    file: Express.Multer.File,
  ): Promise<AnnouncementEntity> {
    const createdAnnouncement = await this.announcementRepository.save({
      ...createAnnouncementDto,
      userId: user.id,
      phoneNumber: createAnnouncementDto.phoneNumber || user.phoneNumber,
      file: `http://localhost:8808/${file.filename}`,
    });

    return createdAnnouncement;
  }

  public async getMyAnnouncements(
    user: UserEntity,
    searchInput: string = null,
  ): Promise<AnnouncementEntity[]> {
    const myAnnouncements = await this.announcementRepository.find({
      where: {
        userId: user.id,
        ...(searchInput && { title: Like(`%${searchInput}%`) }),
      },
    });

    return myAnnouncements;
  }

  public async updateAnnouncement(
    id: number,
    updateAnnouncementDto: UpdateAnnouncementDto,
    user: UserEntity,
    file?: Express.Multer.File,
  ): Promise<AnnouncementEntity[]> {
    const announcementExists = await this.announcementRepository.findOneBy({
      id: id,
    });

    if (!announcementExists) {
      throw new BadRequestException(
        `Announcement with id: ${id} doesn't exist`,
      );
    }

    if (file) {
      const fileName: string = announcementExists.file.split(
        'http://localhost:8808/',
      )[1];

      const uploadsDir = path.join(process.cwd(), 'uploads');

      await fs.unlink(path.join(uploadsDir, fileName));
    }

    await this.announcementRepository.update(id, {
      ...updateAnnouncementDto,
      file: file
        ? `http://localhost:8808/${file.filename}`
        : announcementExists.file,
    });

    return await this.getMyAnnouncements(user);
  }

  public async deleteAnnouncement(id: number, user: UserEntity) {
    const announcementExists = await this.announcementRepository.findOneBy({
      id: id,
      userId: user.id,
    });

    if (!announcementExists) {
      throw new BadRequestException(
        `Announcement with id: ${id} doesn't exist`,
      );
    }

    if (announcementExists.file) {
      const fileName: string = announcementExists.file.split(
        'http://localhost:8808/',
      )[1];

      const uploadsDir = path.join(process.cwd(), 'uploads');

      await fs.unlink(path.join(uploadsDir, fileName));
    }

    return await this.announcementRepository.delete(id);
  }

  public async getAllAnnouncements(
    paginationDto: PaginationDto,
  ): Promise<AnnouncementEntity[]> {
    const myAnnouncements = await this.announcementRepository.find({
      order: {
        title: 'ASC',
      },
      skip: (paginationDto.page - 1) * paginationDto.size,
      take: paginationDto.size,
    });

    return myAnnouncements;
  }
}

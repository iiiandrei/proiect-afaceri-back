import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '../../typeorm/entities/user.entity';
import { UserBasketEntity } from 'src/typeorm/entities/user-basket-item.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserBasketEntity)
    private userBasketRepository: Repository<UserBasketEntity>,
  ) {}

  // updateUser(id: number, updateUserDetails: UpdateUserDto) {
  //     return this.userRepository.update({ id }, { ...updateUserDetails })
  // }

  deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

  public async addItemToBasket(
    user: UserEntity,
    announcementId: number,
  ): Promise<UserBasketEntity> {
    const alreadyAdded = await this.userBasketRepository.find({
      where: {
        userId: user.id,
        announcementId: announcementId,
      },
    });

    if (alreadyAdded.length) {
      throw new BadRequestException(
        'Item already added. For now we only support adding one item of a type',
      );
    }

    return await this.userBasketRepository.save({
      userId: user.id,
      announcementId: announcementId,
    });
  }

  public async getUserBasketItems(user:UserEntity): Promise<UserBasketEntity[]> {
    const userBasketItems = await this.userBasketRepository.find({
      where: {
        userId: user.id
      },
      relations: ['announcement']
    });

    return userBasketItems;
  }

  public async deleteItemFromBasket(announcementId: number, user: UserEntity) {
    const userHasItemInBasket = await this.userBasketRepository.findOne({
      where: {
        userId: user.id,
        announcementId: announcementId
      }
    });

    if (!userHasItemInBasket) {
      throw new ForbiddenException('You can delete items only from your basket. :D')
    }
    return await this.userBasketRepository.delete(userHasItemInBasket.id)
  }
}

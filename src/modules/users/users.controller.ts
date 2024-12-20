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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthUser } from '../auth/decorators/auth.decorator';
import { UserEntity } from 'src/typeorm/entities/user.entity';
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // @Put(':id')
  // async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
  //     await this.userService.updateUser(id, updateUserDto);
  // }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }

  @Post('basket/:announcement_id')
  @UseGuards(AuthGuard)
  async addItemToBasket(
    @Param('announcement_id') announcementId: number,
    @AuthUser() user: UserEntity,
  ) {
    return await this.userService.addItemToBasket(user, announcementId);
  }

  @Delete('basket/:announcement_id')
  @UseGuards(AuthGuard)
  async deleteItemFromBasket(
    @Param('announcement_id') announcementId: number,
    @AuthUser() user: UserEntity,
  ) {
    return await this.userService.deleteItemFromBasket(announcementId, user);
  }

  @Get('basket')
  @UseGuards(AuthGuard)
  async getUserBasketItems(
    @AuthUser() user: UserEntity
  ) {
    return await this.userService.getUserBasketItems(user);
  }
}

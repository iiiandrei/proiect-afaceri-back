import { Controller, Get, Post, Body, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginResponse, RegisterResponse } from './types/auth.pb';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){ }
  @Post('register')
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<RegisterResponse>  {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  public async loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.loginUser(loginUserDto);
  }
}

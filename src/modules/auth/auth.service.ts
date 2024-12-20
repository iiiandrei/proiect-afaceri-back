import { 
  Injectable, 
  NotFoundException,
  HttpException, 
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { LoginResponse, RegisterResponse, ValidateTokenResponse } from './types/auth.pb';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { UserEntity } from '../../typeorm/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) { }

  public async validateToken({
    token,
  }: ValidateTokenDto): Promise<ValidateTokenResponse> {
    try {
      const decoded = jwt.verify(token, 'secret', {
        ignoreExpiration: false,
      });
  
      if (!decoded) {
        return {
          status: HttpStatus.FORBIDDEN,
          error: ['Token is invalid'],
          data: null,
        };
      }
  
      const user = await this.userRepository.findOneBy({ id: decoded.id });
      if (!user) {
        return {
          status: HttpStatus.CONFLICT,
          error: ['User not found'],
          data: null,
        };
      }
  
      return {
        status: HttpStatus.OK,
        error: null,
        data: user,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: ['Token has expired'],
          data: null,
        };
      } else {
        return {
          status: HttpStatus.FORBIDDEN,
          error: ['Token is invalid'],
          data: null,
        };
      }
    }
  }

  public async createUser(userDetails: CreateUserDto): Promise<RegisterResponse> {
    const userExists = await this.userRepository.findOneBy({username: userDetails.username});
    if (userExists) {
      throw new HttpException (
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Username already exists'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);
    const refreshToken = crypto.randomBytes(16).toString('hex');
    const userToCreate = {
      ...userDetails,
      username: userDetails.username,
      password: hashedPassword,
      refreshToken: refreshToken
    };
    const newUser = this.userRepository.create({ ...userToCreate, createdAt: new Date() });
    const savedUser = await this.userRepository.save(newUser);
    const token = await jwt.sign({id:savedUser.id}, 'secret' ,{expiresIn: '30d'});
    return {
      status: HttpStatus.CREATED,
      error: null,
      data: newUser.id,
      token: token,
      refreshToken: refreshToken,
    }
  }

  public async loginUser(userDetails: LoginUserDto): Promise<LoginResponse> {
    const userExists = await this.userRepository.findOneBy({username: userDetails.username});
    if (!userExists) {
      throw new HttpException (
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Wrong username'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPasswordCorrect = await bcrypt.compare(userDetails.password, userExists.password);
    if (!isPasswordCorrect) {
      throw new HttpException (
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Wrong password'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = await jwt.sign({id:userExists.id}, 'secret' ,{expiresIn: '30d'});
    const refreshToken = crypto.randomBytes(16).toString('hex');
    userExists.refreshToken = refreshToken;
    await this.userRepository.save(userExists);
    return {
      status: HttpStatus.ACCEPTED,
      error: null,
      data: userExists.id,
      token: token,
      refreshToken: refreshToken,
    }
  }
}

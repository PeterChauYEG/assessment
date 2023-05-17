import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { ResponseType } from '../types/response.type';
import { RegisterRequestDto } from './dtos/register.request.dto';
import { LoginRequestDto } from './dtos/login.request.dto';
import { LoginResponseDto } from './dtos/login.response.dto';
import { RegisterResponseDto } from './dtos/register.response.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  @ApiResponse({
    status: 201,
    description: 'signup successful',
    type: RegisterResponseDto,
  })
  async signup(
    @Body() dto: RegisterRequestDto,
  ): Promise<ResponseType<RegisterResponseDto>> {
    try {
      const externalId: string = await this.authService.passwordRegister(dto);

      const userId: string = await this.userService.create({
        email: dto.email,
        externalId,
      });

      const payload = { userId };
      const token: string = await this.jwtService.signAsync(payload);

      return {
        data: {
          email: dto.email,
          token,
        },
      };
    } catch (error) {
      throw new HttpException(error['error_message'], HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  async login(
    @Body() dto: LoginRequestDto,
  ): Promise<ResponseType<LoginResponseDto>> {
    try {
      const externalId: string = await this.authService.passwordSignIn(dto);
      const entity: User = await this.userService.findOneByExternalId(
        externalId,
      );

      const payload = { userId: entity.id };
      const token: string = await this.jwtService.signAsync(payload);

      return {
        data: {
          email: entity.email,
          id: entity.id,
          token,
        },
      };
    } catch (error) {
      throw new HttpException(error['error_message'], HttpStatus.BAD_REQUEST);
    }
  }
}

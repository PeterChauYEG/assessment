import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  token: string;
}

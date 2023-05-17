import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  email: string;
}

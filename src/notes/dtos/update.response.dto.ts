import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateResponseDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsBoolean()
  @ApiProperty()
  published: boolean;
}

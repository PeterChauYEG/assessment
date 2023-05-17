import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRequestDto {
  @IsString()
  @ApiProperty()
  content: string;
}

import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteRequestDto {
  @IsString()
  @ApiProperty()
  content: string;
}

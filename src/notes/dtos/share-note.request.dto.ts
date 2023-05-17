import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareNoteRequestDto {
  @IsString()
  @ApiProperty()
  sharedUserId: string;
}

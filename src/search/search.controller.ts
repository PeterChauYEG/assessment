import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ResponseType } from '../types/response.type';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Notes } from '@prisma/client';
import { AuthGuard } from '../guard/auth.guard';
import { SearchNoteResponseDto } from './dtos/search-note.response.dto';
import { NotesService } from '../notes/notes.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private notesService: NotesService) {}

  @UseGuards(AuthGuard)
  @Get('')
  @ApiResponse({
    status: 200,
    description: 'search notes successful',
    isArray: true,
    type: SearchNoteResponseDto,
  })
  async search(
    @Request() req,
    @Query('q') query: string,
  ): Promise<ResponseType<SearchNoteResponseDto[]>> {
    try {
      const notes: Notes[] | null = await this.notesService.search(
        req.user.userId,
        query,
      );

      if (!notes) {
        throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
      }

      return {
        data: notes,
      };
    } catch (error) {
      throw new HttpException(error['error_message'], HttpStatus.BAD_REQUEST);
    }
  }
}

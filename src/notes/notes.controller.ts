import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ResponseType } from '../types/response.type';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetNoteResponseDto } from './dtos/get-note.response.dto';
import { Notes } from '@prisma/client';
import { AuthGuard } from '../guard/auth.guard';
import { NotesService } from './notes.service';
import { CreateNoteRequestDto } from './dtos/create-note.request.dto';
import { CreateNoteResponseDto } from './dtos/create-note.response.dto';
import { UpdateRequestDto } from './dtos/update.request.dto';
import { UpdateResponseDto } from './dtos/update.response.dto';
import { ShareNoteRequestDto } from './dtos/share-note.request.dto';
import { ShareNoteResponseDto } from './dtos/share-note.response.dto';
import { DeleteNoteResponseDto } from './dtos/delete-note.response.dto';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'update note successful',
    type: UpdateResponseDto,
  })
  async update(
    @Body() dto: UpdateRequestDto,
    @Request() req,
    @Param('id') id: string,
  ): Promise<ResponseType<UpdateResponseDto>> {
    try {
      const note: Notes = await this.notesService.update(id, {
        ...dto,
        userId: req.user.userId,
      });

      return {
        data: note,
      };
    } catch (error) {
      throw new HttpException(error['error_message'], HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Post('')
  @ApiResponse({
    status: 200,
    description: 'create note successful',
    type: CreateNoteResponseDto,
  })
  async create(
    @Body() dto: CreateNoteRequestDto,
    @Request() req,
  ): Promise<ResponseType<CreateNoteResponseDto>> {
    try {
      const note: Notes = await this.notesService.create({
        ...dto,
        userId: req.user.userId,
      });

      return {
        data: note,
      };
    } catch (error) {
      throw new HttpException(error['error_message'], HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get('')
  @ApiResponse({
    status: 200,
    description: 'get notes successful',
    isArray: true,
    type: GetNoteResponseDto,
  })
  async getMany(@Request() req): Promise<ResponseType<GetNoteResponseDto[]>> {
    try {
      const notes: Notes[] = await this.notesService.findMany(req.user.userId);

      return {
        data: notes,
      };
    } catch (error) {
      throw new HttpException(error['error_message'], HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'get note successful',
    isArray: true,
    type: GetNoteResponseDto,
  })
  async get(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ResponseType<GetNoteResponseDto>> {
    try {
      const note: Notes | null = await this.notesService.findOne(
        req.user.userId,
        id,
      );

      if (!note) {
        throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
      }

      return {
        data: note,
      };
    } catch (error) {
      throw new HttpException(error['error_message'], HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'delete note successful',
    isArray: true,
    type: DeleteNoteResponseDto,
  })
  async delete(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ResponseType<DeleteNoteResponseDto>> {
    try {
      const note: Notes = await this.notesService.delete(id, req.user.userId);

      return {
        data: note,
      };
    } catch (error) {
      throw new HttpException(error['error_message'], HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Post(':id/share')
  @ApiResponse({
    status: 200,
    description: 'share note successful',
    type: ShareNoteResponseDto,
  })
  async share(
    @Body() dto: ShareNoteRequestDto,
    @Request() req,
    @Param('id') id: string,
  ): Promise<ResponseType<ShareNoteResponseDto>> {
    try {
      const note: Notes = await this.notesService.share(req.user.userId, {
        ...dto,
        noteId: id,
      });

      return {
        data: note,
      };
    } catch (error) {
      throw new HttpException(error['error_message'], HttpStatus.BAD_REQUEST);
    }
  }
}

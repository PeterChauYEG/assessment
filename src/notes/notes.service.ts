import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notes, Prisma, SharedNotes } from '@prisma/client';
import { SharedNotesService } from '../shared-notes/shared-notes.service';

@Injectable()
export class NotesService {
  private readonly logger: Logger = new Logger(NotesService.name);

  constructor(
    private prisma: PrismaService,
    private sharedNotesService: SharedNotesService,
  ) {}

  async create(data: Prisma.NotesCreateInput): Promise<Notes> {
    this.logger.debug('create');

    return await this.prisma.notes.create({
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Notes> {
    this.logger.debug('delete');

    const note: Notes = await this.findOne(userId, id);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.userId !== userId) {
      throw new Error('This note does not belong to you');
    }

    if (!note.published) {
      throw new Error('This note is not published');
    }

    const deletedNote = await this.prisma.notes.update({
      where: {
        id,
      },
      data: {
        published: false,
      },
    });

    return deletedNote;
  }

  async update(id: string, data: Prisma.NotesUpdateInput): Promise<Notes> {
    this.logger.debug('update');

    const note: Notes = await this.findOne(data.userId as string, id);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.userId !== data.userId) {
      throw new Error('This note does not belong to you');
    }

    const updatedNote = await this.prisma.notes.update({
      where: {
        id,
      },
      data,
    });

    return updatedNote;
  }

  async findMany(userId: string): Promise<Notes[]> {
    this.logger.debug('findMany');

    return await this.prisma.notes.findMany({
      where: {
        userId,
        published: true,
      },
    });
  }

  async findOne(userId: string, id: string): Promise<Notes> {
    this.logger.debug('findOne');

    const params: {
      where: {
        id: string;
        published: boolean;
        userId?: string;
      };
    } = {
      where: {
        id,
        published: true,
      },
    };

    const sharedNote: SharedNotes = await this.sharedNotesService.findOne(
      userId,
      id,
    );

    if (!sharedNote) {
      params.where.userId = userId;
    }

    return await this.prisma.notes.findFirst(params);
  }

  async share(
    userId: string,
    data: Prisma.SharedNotesCreateInput,
  ): Promise<Notes> {
    this.logger.debug('share');

    const note: Notes = await this.findOne(userId, data.noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    if (note.userId !== userId) {
      throw new Error('This note does not belong to you');
    }

    await this.sharedNotesService.share(data);

    return note;
  }

  async search(userId: string, query: string): Promise<Notes[]> {
    this.logger.debug('search');

    const notes: Notes[] = await this.prisma.notes.findMany({
      where: {
        published: true,
        content: {
          search: query,
        },
      },
    });

    const authorizedNotes = [];

    const promises = notes.map(async (note) => {
      const sharedNote: SharedNotes = await this.sharedNotesService.findOne(
        userId,
        note.id,
      );

      if (note.userId === userId || sharedNote) {
        authorizedNotes.push(note);
      }
    });

    await Promise.all(promises);

    return authorizedNotes;
  }
}

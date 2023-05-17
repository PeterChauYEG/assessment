import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SharedNotes, Prisma } from '@prisma/client';

@Injectable()
export class SharedNotesService {
  private readonly logger: Logger = new Logger(SharedNotesService.name);

  constructor(private prisma: PrismaService) {}

  async share(data: Prisma.SharedNotesCreateInput): Promise<SharedNotes> {
    this.logger.debug('share');

    const note: SharedNotes = await this.prisma.sharedNotes.create({
      data,
    });

    return note;
  }

  async findOne(userId: string, noteId: string): Promise<SharedNotes> {
    this.logger.debug('share');

    const note: SharedNotes = await this.prisma.sharedNotes.findFirst({
      where: {
        sharedUserId: userId,
        noteId,
      },
    });

    return note;
  }
}

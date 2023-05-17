import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotesService } from './notes.service';
import { SharedNotesModule } from '../shared-notes/shared-notes.module';

@Module({
  imports: [PrismaModule, SharedNotesModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}

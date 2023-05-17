import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [PrismaModule, NotesModule],
  controllers: [SearchController],
})
export class SearchModule {}

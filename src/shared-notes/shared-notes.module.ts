import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedNotesService } from './shared-notes.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [SharedNotesService],
  exports: [SharedNotesService],
})
export class SharedNotesModule {}

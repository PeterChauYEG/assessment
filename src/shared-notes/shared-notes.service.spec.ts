import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { PrismaModule } from '../prisma/prisma.module';
import configuration from '../config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { SharedNotesService } from './shared-notes.service';
import { UserModule } from '../user/user.module';

describe('SharedNotesService', () => {
  let sharedNotesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
          }),
          inject: [ConfigService],
          global: true,
        }),
        PrismaModule,
        UserModule,
      ],
      providers: [SharedNotesService],
    }).compile();

    sharedNotesService = moduleRef.get<SharedNotesService>(SharedNotesService);
  });

  describe('share', () => {
    it('should create a shared note entry and return it', async () => {
      const result = {
        id: '1',
      };

      jest
        .spyOn(sharedNotesService.prisma.sharedNotes, 'create')
        .mockImplementation(() => {
          return {
            id: '1',
          };
        });

      expect(
        await sharedNotesService.share({
          id: '1',
        }),
      ).toStrictEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return the matching shared note entry', async () => {
      const result = {
        id: '1',
      };

      jest
        .spyOn(sharedNotesService.prisma.sharedNotes, 'findFirst')
        .mockImplementation(() => {
          return {
            id: '1',
          };
        });

      expect(
        await sharedNotesService.findOne('userId', 'noteId'),
      ).toStrictEqual(result);
    });
  });
});

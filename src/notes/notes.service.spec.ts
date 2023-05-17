import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { PrismaModule } from '../prisma/prisma.module';
import configuration from '../config/configuration';
import { NotesService } from './notes.service';
import { SharedNotesModule } from '../shared-notes/shared-notes.module';
import { NotesController } from './notes.controller';
import { JwtModule } from '@nestjs/jwt';

describe('NotesService', () => {
  let notesService;

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
        SharedNotesModule,
      ],
      controllers: [NotesController],
      providers: [NotesService],
    }).compile();

    notesService = moduleRef.get<NotesService>(NotesService);
  });

  describe('create', () => {
    it('should create a note and return it', async () => {
      const result = {
        id: '1',
      };

      jest.spyOn(notesService.prisma.notes, 'create').mockImplementation(() => {
        return {
          id: '1',
        };
      });

      expect(
        await notesService.create({
          id: '1',
        }),
      ).toStrictEqual(result);
    });
  });

  describe('delete', () => {
    it('should unpublished a note and return it', async () => {
      const result = {
        id: '1',
        published: false,
      };

      jest.spyOn(notesService, 'findOne').mockImplementation(() => {
        return {
          id: '1',
          published: true,
        };
      });

      jest.spyOn(notesService.prisma.notes, 'update').mockImplementation(() => {
        return {
          id: '1',
          published: false,
        };
      });

      expect(
        await notesService.delete({
          id: '1',
        }),
      ).toStrictEqual(result);
    });
  });

  describe('update', () => {
    it('should update a note and return it', async () => {
      const result = {
        id: '1',
        content: 'content',
      };

      jest.spyOn(notesService, 'findOne').mockImplementation(() => {
        return {
          id: '1',
          content: 'content',
        };
      });

      jest.spyOn(notesService.prisma.notes, 'update').mockImplementation(() => {
        return {
          id: '1',
          content: 'content',
        };
      });

      expect(
        await notesService.update('1', {
          content: 'content',
        }),
      ).toStrictEqual(result);
    });
  });

  describe('findMany', () => {
    it('should return the published notes for authenticated user', async () => {
      const result = [
        {
          id: '1',
        },
      ];

      jest
        .spyOn(notesService.prisma.notes, 'findMany')
        .mockImplementation(() => {
          return [
            {
              id: '1',
            },
          ];
        });

      expect(await notesService.findMany('userId')).toStrictEqual(result);
    });
  });

  describe('findOne', () => {
    it('should find a published note for the authorized user and return it', async () => {
      const result = {
        id: '1',
        content: 'content',
        userId: 'userId',
      };

      jest
        .spyOn(notesService.sharedNotesService, 'findOne')
        .mockImplementation(() => {
          return {
            id: '1',
            content: 'content',
          };
        });

      jest
        .spyOn(notesService.prisma.notes, 'findFirst')
        .mockImplementation(() => {
          return {
            id: '1',
            content: 'content',
            userId: 'userId',
          };
        });

      expect(await notesService.findOne('userId', '1')).toStrictEqual(result);
    });
  });

  describe('share', () => {
    it('should share the authorized users note by id and return it', async () => {
      const result = {
        id: '1',
        published: true,
        userId: 'userId',
      };

      jest.spyOn(notesService, 'findOne').mockImplementation(() => {
        return {
          id: '1',
          published: true,
          userId: 'userId',
        };
      });

      jest
        .spyOn(notesService.sharedNotesService, 'share')
        .mockImplementation(() => {
          return {
            id: '1',
            content: 'content',
            userId: 'userId',
          };
        });

      expect(
        await notesService.share('userId', {
          sharedUserId: 'sharedUserId',
        }),
      ).toStrictEqual(result);
    });
  });

  describe('search', () => {
    it('should find a query in a published note for the authorized user and return it', async () => {
      const result = [
        {
          id: '1',
          published: true,
          userId: 'userId',
        },
      ];

      jest
        .spyOn(notesService.prisma.notes, 'findMany')
        .mockImplementation(() => {
          return [
            {
              id: '1',
              published: true,
              userId: 'userId',
            },
          ];
        });

      jest
        .spyOn(notesService.sharedNotesService, 'findOne')
        .mockImplementation(() => {
          return {
            id: '1',
            content: 'content',
            userId: 'userId',
          };
        });

      expect(await notesService.search('userId', 'query')).toStrictEqual(
        result,
      );
    });
  });
});

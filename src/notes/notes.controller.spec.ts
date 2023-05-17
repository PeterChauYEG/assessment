import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import configuration from '../config/configuration';
import { SharedNotesModule } from '../shared-notes/shared-notes.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { AuthGuard } from '../guard/auth.guard';

describe('NotesController', () => {
  let notesController;
  let notesService;

  const AuthGuardMock = {
    canActivate(ctx) {
      const request = ctx.switchToHttp().getRequest();
      request.user = { userId: 'userId' };
      return true;
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
        PrismaModule,
        SharedNotesModule,
      ],
      controllers: [NotesController],
      providers: [NotesService],
    })
      .overrideGuard(AuthGuard)
      .useValue(AuthGuardMock)
      .compile();

    notesController = moduleRef.get<NotesController>(NotesController);
    notesService = moduleRef.get<NotesService>(NotesService);
  });

  describe('Get notes', () => {
    it('should return all published notes for the authenticated user', async () => {
      const result = {
        data: [
          {
            id: '1',
          },
        ],
      };

      jest
        .spyOn(notesService, 'findMany')
        .mockImplementation(() => [{ id: '1' }]);

      expect(
        await notesController.getMany({ user: { userId: 'userId' } }),
      ).toStrictEqual(result);
    });
  });

  describe('Get note by id', () => {
    it('should return the matching published notes for the authenticated user', async () => {
      const result = {
        data: {
          id: '1',
        },
      };

      jest
        .spyOn(notesService, 'findOne')
        .mockImplementation(() => ({ id: '1' }));

      expect(
        await notesController.get({ user: { userId: 'userId' } }, '1'),
      ).toStrictEqual(result);
    });
  });

  describe('Create note', () => {
    it('should create a note and return it for the authenticated user', async () => {
      const result = {
        data: {
          content: 'content',
          userId: 'userId',
        },
      };

      jest.spyOn(notesService, 'create').mockImplementation((data) => data);

      expect(
        await notesController.create(
          { content: 'content' },
          { user: { userId: 'userId' } },
        ),
      ).toStrictEqual(result);
    });
  });

  describe('Update note', () => {
    it('should update a note and return it for the authenticated user', async () => {
      const result = {
        data: {
          content: 'content',
          userId: 'userId',
          id: '1',
        },
      };

      jest.spyOn(notesService, 'update').mockImplementation((id, data: any) => {
        return {
          id,
          ...data,
        };
      });

      expect(
        await notesController.update(
          { content: 'content' },
          { user: { userId: 'userId' } },
          '1',
        ),
      ).toStrictEqual(result);
    });

    describe('Delete note by id', () => {
      it('should return unpublish the matching published notes for the authenticated user', async () => {
        const result = {
          data: {
            id: '1',
          },
        };

        jest
          .spyOn(notesService, 'delete')
          .mockImplementation(() => ({ id: '1' }));

        expect(
          await notesController.delete({ user: { userId: 'userId' } }, '1'),
        ).toStrictEqual(result);
      });
    });

    describe('Share note by id', () => {
      it('should return share the matching published notes for the authenticated user', async () => {
        const result = {
          data: {
            id: '1',
          },
        };

        jest
          .spyOn(notesService, 'share')
          .mockImplementation(() => ({ id: '1' }));

        expect(
          await notesController.share(
            { sharedUserId: 'sharedUserId' },
            { user: { userId: 'userId' } },
            '1',
          ),
        ).toStrictEqual(result);
      });
    });
  });
});

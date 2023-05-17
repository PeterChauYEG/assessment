import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedNotesModule } from '../shared-notes/shared-notes.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import configuration from '../config/configuration';
import { AuthGuard } from '../guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';

describe('NoteController', () => {
  let app: INestApplication;
  const notesService = {
    findMany: () => [],
    findOne: (_userId, noteId) => ({
      id: noteId,
    }),
    create: (data) => ({
      id: '1',
      ...data,
    }),
    update: (id, data) => ({
      id,
      ...data,
    }),
    delete: (id, userId) => ({
      id,
      userId,
    }),
    share: (userId, data) => ({
      userId,
      ...data,
    }),
  };

  const AuthGuardMock = {
    canActivate(ctx) {
      const request = ctx.switchToHttp().getRequest();
      request.user = { userId: 'userId' };
      return true;
    },
  };

  beforeAll(async () => {
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
    })
      .overrideGuard(AuthGuard)
      .useValue(AuthGuardMock)
      .overrideProvider(NotesService)
      .useValue(notesService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET notes`, async () => {
    return request(app.getHttpServer())
      .get('/notes')
      .set('authorization', 'Bearer token')
      .expect(200)
      .expect({
        data: [],
      });
  });

  it(`/GET note`, async () => {
    return request(app.getHttpServer())
      .get('/notes/1')
      .set('authorization', 'Bearer token')
      .expect(200)
      .expect({
        data: {
          id: '1',
        },
      });
  });

  it(`/POST note`, async () => {
    return request(app.getHttpServer())
      .post('/notes')
      .set('authorization', 'Bearer token')
      .send({
        content: 'content',
      })
      .expect(201)
      .expect({
        data: {
          id: '1',
          content: 'content',
          userId: 'userId',
        },
      });
  });

  it(`/PUT note`, async () => {
    return request(app.getHttpServer())
      .put('/notes/1')
      .set('authorization', 'Bearer token')
      .send({
        content: 'content',
      })
      .expect(200)
      .expect({
        data: {
          id: '1',
          content: 'content',
          userId: 'userId',
        },
      });
  });

  it(`/DELETE note`, async () => {
    return request(app.getHttpServer())
      .delete('/notes/1')
      .set('authorization', 'Bearer token')
      .expect(200)
      .expect({
        data: {
          id: '1',
          userId: 'userId',
        },
      });
  });

  it(`/POST share note`, async () => {
    return request(app.getHttpServer())
      .post('/notes/1/share')
      .set('authorization', 'Bearer token')
      .send({
        sharedUserId: 'userId',
      })
      .expect(201)
      .expect({
        data: {
          userId: 'userId',
          noteId: '1',
          sharedUserId: 'userId',
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

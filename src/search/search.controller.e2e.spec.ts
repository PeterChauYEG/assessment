import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import configuration from '../config/configuration';
import { AuthGuard } from '../guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { SearchController } from './search.controller';
import { NotesModule } from '../notes/notes.module';
import { NotesService } from '../notes/notes.service';

describe('SearchController', () => {
  let app: INestApplication;
  const notesService = {
    search: (userId, _data) => ({
      userId,
      content: 'content',
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
        NotesModule,
      ],
      controllers: [SearchController],
    })
      .overrideGuard(AuthGuard)
      .useValue(AuthGuardMock)
      .overrideProvider(NotesService)
      .useValue(notesService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET search`, async () => {
    return request(app.getHttpServer())
      .get('/search?q=note')
      .set('authorization', 'Bearer token')
      .expect(200)
      .expect({
        data: {
          userId: 'userId',
          content: 'content',
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

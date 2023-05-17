import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import configuration from '../config/configuration';
import { SearchController } from './search.controller';
import { AuthGuard } from '../guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { NotesModule } from '../notes/notes.module';

describe('SearchController', () => {
  let searchController;

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
      .compile();

    searchController = moduleRef.get<SearchController>(SearchController);
  });

  describe('GET search', () => {
    it('should return all matching published notes for the authenticated user', async () => {
      const result = {
        data: [
          {
            id: '1',
          },
        ],
      };

      jest
        .spyOn(searchController.notesService, 'search')
        .mockImplementation(() => [{ id: '1' }]);

      expect(
        await searchController.search({ user: { userId: 'userId' } }, 'query'),
      ).toStrictEqual(result);
    });
  });
});

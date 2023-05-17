import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import configuration from '../config/configuration';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
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
        UserModule,
        ConfigModule,
        PrismaModule,
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('passwordRegister', () => {
    it('should return the external id', async () => {
      const result = 'externalId';

      jest
        .spyOn(authService.authClient.passwords, 'create')
        .mockImplementation(() => {
          return {
            user_id: 'externalId',
          };
        });

      expect(
        await authService.passwordRegister({
          email: 'email',
          password: 'password',
        }),
      ).toStrictEqual(result);
    });
  });

  describe('passwordSignIn', () => {
    it('should return the external id', async () => {
      const result = 'externalId';

      jest
        .spyOn(authService.authClient.passwords, 'authenticate')
        .mockImplementation(() => {
          return {
            user_id: 'externalId',
          };
        });

      expect(
        await authService.passwordSignIn({
          email: 'email',
          password: 'password',
        }),
      ).toStrictEqual(result);
    });
  });
});

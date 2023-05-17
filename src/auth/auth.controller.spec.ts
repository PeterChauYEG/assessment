import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let authController;
  let authService;
  let userService;
  let jwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
      imports: [
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
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('signup', () => {
    it('should create a new user and return the email and token', async () => {
      const result = {
        data: {
          token: 'token',
          email: 'email',
        },
      };

      jest
        .spyOn(authService, 'passwordRegister')
        .mockImplementation(() => 'externalId');
      jest.spyOn(userService, 'create').mockImplementation(() => 'userId');
      jest.spyOn(jwtService, 'signAsync').mockImplementation(() => 'token');

      expect(
        await authController.signup({
          email: 'email',
          password: 'password',
        }),
      ).toStrictEqual(result);
    });
  });

  describe('login', () => {
    it('should login to a user and return the id, email and token', async () => {
      const result = {
        data: {
          id: 'id',
          token: 'token',
          email: 'email',
        },
      };

      jest
        .spyOn(authService, 'passwordSignIn')
        .mockImplementation(() => 'externalId');
      jest.spyOn(userService, 'findOneByExternalId').mockImplementation(() => {
        return {
          id: 'id',
          email: 'email',
        };
      });
      jest.spyOn(jwtService, 'signAsync').mockImplementation(() => 'token');

      expect(
        await authController.login({
          email: 'email',
          password: 'password',
        }),
      ).toStrictEqual(result);
    });
  });
});

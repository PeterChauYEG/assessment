import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from '../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let app: INestApplication;
  const authService = {
    passwordRegister: () => 'externalId',
    passwordSignIn: () => 'externalId',
  };
  const userService = {
    create: () => 'id',
    findOneByExternalId: () => ({
      id: 'id',
      email: 'email',
    }),
  };
  const jwtService = {
    signAsync: () => 'token',
  };

  beforeAll(async () => {
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
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideProvider(JwtService)
      .useValue(jwtService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST signup`, async () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'email',
        password: 'password',
      })
      .expect(201)
      .expect({
        data: {
          token: 'token',
          email: 'email',
        },
      });
  });

  it(`/POST login`, async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'email',
        password: 'password',
      })
      .expect(201)
      .expect({
        data: {
          id: 'id',
          token: 'token',
          email: 'email',
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

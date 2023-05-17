import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthService } from './health.service';

describe('Health', () => {
  let app: INestApplication;
  const healthService = { check: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
        TerminusModule,
        HttpModule,
      ],
      providers: [HealthService],
    })
      .overrideProvider(HealthService)
      .useValue(healthService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET health`, async () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(await healthService.check());
  });

  afterAll(async () => {
    await app.close();
  });
});

import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';

import { HealthService } from './health.service';
import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import configuration from '../config/configuration';
import { HttpModule } from '@nestjs/axios';

describe('HealthService', () => {
  let healthService;

  beforeEach(async () => {
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
    }).compile();

    healthService = moduleRef.get<HealthService>(HealthService);
  });

  describe('check', () => {
    it('should return the status of the api', async () => {
      const pingCheckRes = { ping: true };
      const checkHeapRes = { heap: true };
      const checkRSSRes = { rss: true };

      jest
        .spyOn(healthService.http, 'pingCheck')
        .mockImplementation(() => pingCheckRes);
      jest
        .spyOn(healthService.memory, 'checkHeap')
        .mockImplementation(() => checkHeapRes);
      jest
        .spyOn(healthService.memory, 'checkRSS')
        .mockImplementation(() => checkRSSRes);

      expect(await healthService.check()).toStrictEqual({
        details: {
          ...pingCheckRes,
          ...checkHeapRes,
          ...checkRSSRes,
        },
        environment: 'test',
        error: {},
        info: {
          ...pingCheckRes,
          ...checkHeapRes,
          ...checkRSSRes,
        },
        status: 'ok',
      });
    });
  });
});

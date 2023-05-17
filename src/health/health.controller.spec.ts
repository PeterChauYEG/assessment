import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { Test } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';

describe('HealthController', () => {
  let healthController;
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
    healthController = moduleRef.get<HealthController>(HealthController);
  });

  describe('healthCheck', () => {
    it('should return the status of the api', async () => {
      const result = ['test'];
      jest.spyOn(healthService, 'check').mockImplementation(() => result);

      expect(await healthController.healthCheck()).toBe(result);
    });
  });
});

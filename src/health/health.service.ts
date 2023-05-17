import { Injectable, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';
import { HealthResponseDto } from './dtos/health.response.dto';

// this decorator indicates to nest that this class can be provided to a module
// we want to handle logic in services to keep our resolvers and controllers clean
@Injectable()
export class HealthService {
  // grab the global logger instance
  private readonly logger: Logger = new Logger(HealthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  async check(): Promise<HealthResponseDto> {
    // this logger has several logging levels
    this.logger.log('check');

    const statuses: HealthCheckResult = await this.health.check([
      async () => this.http.pingCheck('website', 'http://localhost:3001.com'),
      async () => this.memory.checkHeap('memoryHeap', 200 * 1024 * 1024),
      async () => this.memory.checkRSS('memoryRss', 3000 * 1024 * 1024),
    ]);

    const environment: string = this.configService.get<string>('NODE_ENV');

    return {
      environment,
      ...statuses,
    };
  }
}

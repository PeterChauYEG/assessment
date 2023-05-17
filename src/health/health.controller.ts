import { HealthService } from './health.service';
import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';

import { HealthResponseDto } from './dtos/health.response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'health check successful',
    type: HealthResponseDto,
  })
  @HealthCheck()
  async healthCheck(): Promise<HealthResponseDto> {
    return this.healthService.check();
  }
}

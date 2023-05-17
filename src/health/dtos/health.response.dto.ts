import {
  HealthCheckResult,
  HealthCheckStatus,
} from '@nestjs/terminus/dist/health-check/health-check-result.interface';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HealthIndicatorResult } from '@nestjs/terminus/dist/health-indicator';

export class HealthResponseDto implements HealthCheckResult {
  @ApiProperty()
  status: HealthCheckStatus;

  @ApiProperty()
  info?: HealthIndicatorResult;

  @ApiProperty()
  error?: HealthIndicatorResult;

  @ApiProperty()
  details: HealthIndicatorResult;

  @IsString()
  @ApiProperty()
  environment: string;
}

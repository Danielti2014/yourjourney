import { Controller, Get } from '@nestjs/common';

export type HealthStatus = {
  status: 'ok';
  service: string;
  uptimeSeconds: number;
  timestamp: string;
};

@Controller('health')
export class HealthController {
  @Get()
  check(): HealthStatus {
    return {
      status: 'ok',
      service: 'yourjourney-api',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}

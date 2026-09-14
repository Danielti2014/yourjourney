import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

/**
 * Este módulo não tem model nem repository, porque saúde não guarda nada no
 * banco. Módulo que não precisa de uma camada simplesmente não a cria.
 */
@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}

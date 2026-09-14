import { Injectable } from '@nestjs/common';
import { HealthResponseDto } from './dto/health-response.dto.js';

const NOME_DO_SERVICO = 'yourjourney-api';

/**
 * A regra. Repare que este arquivo não importa nada de HTTP: ele não conhece
 * requisição, resposta nem código de status. É isso que permite testá-lo sem
 * subir servidor nenhum.
 */
@Injectable()
export class HealthService {
  verificar(): HealthResponseDto {
    return {
      status: 'ok',
      service: NOME_DO_SERVICO,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}

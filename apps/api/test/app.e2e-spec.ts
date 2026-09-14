import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { HealthModule } from '../src/health/health.module.js';

/**
 * Sobe a aplicação de verdade e bate na rota pela rede, que é o que o teste
 * unitário não faz.
 *
 * Importa o HealthModule, e não o AppModule inteiro, porque o AppModule já
 * inclui o banco e exigiria um PostgreSQL no ar só para testar saúde. Quando
 * houver módulo que dependa do banco, a suíte de ponta a ponta ganha um banco
 * de verdade, e isso está previsto na issue do CI.
 */
describe('Health (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /health devolve 200 e status ok', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
        expect(body.service).toBe('yourjourney-api');
      });
  });
});

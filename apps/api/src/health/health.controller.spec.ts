import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('responde com status ok', () => {
    expect(controller.check().status).toBe('ok');
  });

  it('identifica qual servico respondeu', () => {
    expect(controller.check().service).toBe('yourjourney-api');
  });

  it('devolve um timestamp valido em ISO 8601', () => {
    const { timestamp } = controller.check();

    expect(Number.isNaN(Date.parse(timestamp))).toBe(false);
  });
});

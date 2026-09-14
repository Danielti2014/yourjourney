import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

const PORTA_PADRAO = 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.WEB_BASE_URL ?? true });

  const porta = Number(process.env.API_PORT ?? PORTA_PADRAO);

  // 0.0.0.0 e obrigatorio dentro de um conteiner: escutar apenas em localhost
  // deixaria a API inalcancavel de fora dele.
  await app.listen(porta, '0.0.0.0');

  console.log(`API ouvindo em http://localhost:${porta}`);
}

await bootstrap();

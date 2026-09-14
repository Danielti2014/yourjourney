import 'reflect-metadata';
import { DataSource } from 'typeorm';

/**
 * Usado pela linha de comando do TypeORM para gerar e aplicar migrações.
 *
 * Este arquivo roda FORA do NestJS, então ele é a única exceção à regra de
 * ninguém ler `process.env` direto. Dentro da aplicação, quem lê configuração
 * é o AppConfigService.
 *
 * As migrações são executadas por `make migrate`, que roda dentro do contêiner
 * da API, onde o compose já injeta a DATABASE_URL.
 */
const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    'DATABASE_URL não está definida. Rode "make migrate", que executa dentro do contêiner da API, onde essa variável já existe.',
  );
}

export default new DataSource({
  type: 'postgres',
  url,
  // synchronize NUNCA pode ser true. Ele altera o banco sozinho para bater com
  // as entidades, sem migração, sem histórico e sem aviso, e chega a apagar
  // coluna com dado dentro. Quem manda no formato do banco é a migração.
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});

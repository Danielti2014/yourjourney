import { ERRO_DE_CONFIGURACAO, validarEnv } from './env.schema.js';

const ENV_VALIDO = {
  NODE_ENV: 'test',
  API_PORT: '8080',
  WEB_BASE_URL: 'http://localhost:3000',
  DATABASE_URL: 'postgres://usuario:senha@localhost:5432/banco',
};

describe('validarEnv', () => {
  it('converte a porta de texto para número', () => {
    expect(validarEnv(ENV_VALIDO).API_PORT).toBe(8080);
  });

  it('aplica os padrões quando a variável opcional não vem', () => {
    const { DATABASE_URL } = ENV_VALIDO;

    const env = validarEnv({ DATABASE_URL });

    expect(env.API_PORT).toBe(8080);
    expect(env.NODE_ENV).toBe('development');
    expect(env.WEB_BASE_URL).toBe('http://localhost:3000');
  });

  it('recusa subir sem DATABASE_URL, dizendo qual variável falta', () => {
    expect(() => validarEnv({})).toThrow(/DATABASE_URL/);
  });

  it('recusa DATABASE_URL que não é de Postgres', () => {
    expect(() =>
      validarEnv({ ...ENV_VALIDO, DATABASE_URL: 'mysql://u:s@localhost/b' }),
    ).toThrow(/DATABASE_URL/);
  });

  it('recusa porta que não é número', () => {
    expect(() => validarEnv({ ...ENV_VALIDO, API_PORT: 'oitenta' })).toThrow(
      /API_PORT/,
    );
  });

  it('recusa endereço do front que não é URL', () => {
    expect(() =>
      validarEnv({ ...ENV_VALIDO, WEB_BASE_URL: 'localhost' }),
    ).toThrow(/WEB_BASE_URL/);
  });

  it('nunca mostra o valor de uma variável secreta na mensagem de erro', () => {
    const segredo = 'postgres-com-senha-super-secreta-123';

    try {
      validarEnv({ ...ENV_VALIDO, DATABASE_URL: segredo });
      throw new Error('deveria ter falhado');
    } catch (erro) {
      expect((erro as Error).message).not.toContain(segredo);
      expect((erro as Error).message).toContain('DATABASE_URL');
    }
  });

  it('mostra o valor recebido de variável que não é segredo, para ajudar a achar o erro', () => {
    try {
      validarEnv({ ...ENV_VALIDO, API_PORT: 'oitenta' });
      throw new Error('deveria ter falhado');
    } catch (erro) {
      expect((erro as Error).message).toContain('oitenta');
    }
  });

  it('marca o erro para o main saber que é configuração e não mostrar a pilha', () => {
    try {
      validarEnv({});
      throw new Error('deveria ter falhado');
    } catch (erro) {
      expect((erro as Error).name).toBe(ERRO_DE_CONFIGURACAO);
    }
  });

  it('junta todos os problemas numa mensagem só, em vez de reclamar de um por vez', () => {
    try {
      validarEnv({ API_PORT: 'oitenta', WEB_BASE_URL: 'localhost' });
      throw new Error('deveria ter falhado');
    } catch (erro) {
      const mensagem = (erro as Error).message;

      expect(mensagem).toContain('API_PORT');
      expect(mensagem).toContain('WEB_BASE_URL');
      expect(mensagem).toContain('DATABASE_URL');
    }
  });
});

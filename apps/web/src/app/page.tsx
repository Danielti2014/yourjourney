'use client';

import {
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { cadastrar } from '../lib/auth-api';
import styles from './page.module.css';

const cadastroSchema = z.object({
  nome: z.string().min(3, 'Informe seu nome completo.'),
  email: z.email('Digite um e-mail válido.'),
  senha: z
    .string()
    .min(8, 'A senha precisa de pelo menos 8 caracteres.')
    .regex(/[0-9]/, 'A senha precisa de pelo menos um número.'),
  aceitouTermos: z.literal(true, 'É preciso aceitar os termos para continuar.'),
});

type Campos = {
  nome: string;
  email: string;
  senha: string;
  aceitouTermos: boolean;
};
type Erros = Partial<Record<keyof Campos, string>>;
type DocumentoModal = 'termos' | 'privacidade';
type CampoProps = {
  id: keyof Omit<Campos, 'aceitouTermos'>;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  value: string;
  hint?: string;
  error?: string;
  touched: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
};

const beneficios = [
  { icon: 'map', text: 'Mapa do que seu material cobre, e do que falta' },
  { icon: 'calendar', text: 'Roadmap semana a semana até a data da prova' },
  { icon: 'cards', text: 'Flashcards dos tópicos que mais caem' },
];

function BeneficioIcon({ tipo }: { tipo: string }) {
  if (tipo === 'calendar') {
    return (
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <rect x="2.25" y="3.75" width="13.5" height="12" rx="1.5" />
        <path d="M5.5 2.25v3M12.5 2.25v3M2.5 7.25h13" />
      </svg>
    );
  }

  if (tipo === 'cards') {
    return (
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <rect x="4.25" y="2.25" width="9.5" height="13.5" rx="1.25" />
        <path d="M6.5 5.5h5M6.5 8.5h5M6.5 11.5h3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="m2.25 4.25 4.5-2 4.5 2 4.5-2v11.5l-4.5 2-4.5-2-4.5 2z" />
      <path d="M6.75 2.25v11.5M11.25 4.25v11.5" />
    </svg>
  );
}

function Campo({
  id,
  label,
  type,
  placeholder,
  value,
  hint,
  error,
  touched,
  onChange,
  onBlur,
}: CampoProps) {
  const errorId = `${id}-erro`;
  const hintId = `${id}-ajuda`;

  return (
    <div className={styles.campo}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(touched && error)}
        aria-describedby={
          touched && error ? errorId : hint ? hintId : undefined
        }
      />
      {hint && (
        <span id={hintId} className={styles.ajuda}>
          {hint}
        </span>
      )}
      <span
        id={errorId}
        className={styles.erro}
        role={touched && error ? 'alert' : undefined}
      >
        {touched ? error : ''}
      </span>
    </div>
  );
}

function PainelApresentacao() {
  return (
    <section className={styles.apresentacao} aria-label="Sobre o Your Journey">
      <p className={styles.marca}>Your Journey</p>

      <div className={styles.mensagem}>
        <h1>
          Seu material.
          <br />
          Seu plano.
          <br />
          Sua prova.
        </h1>
        <p>
          Envie suas apostilas e provas antigas. A gente devolve o que estudar
          em cada dia até a data da prova.
        </p>

        <ul className={styles.beneficios}>
          {beneficios.map((beneficio) => (
            <li key={beneficio.text}>
              <span className={styles.icone}>
                <BeneficioIcon tipo={beneficio.icon} />
              </span>
              <span>{beneficio.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.rodape}>
        Para quem estuda para o ENEM e para concurso público.
      </p>
    </section>
  );
}

function LayoutDuasColunas({
  painel,
  conteudo,
}: {
  painel: React.ReactNode;
  conteudo: React.ReactNode;
}) {
  return (
    <main className={styles.pagina}>
      {painel}
      <section className={styles.cadastro} aria-label="Criar conta">
        {conteudo}
      </section>
    </main>
  );
}

export default function Home() {
  const router = useRouter();
  const [campos, setCampos] = useState<Campos>({
    nome: '',
    email: '',
    senha: '',
    aceitouTermos: false,
  });
  const [erros, setErros] = useState<Erros>({});
  const [tocados, setTocados] = useState<
    Partial<Record<keyof Campos, boolean>>
  >({});
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [avisoGeral, setAvisoGeral] = useState<string | null>(null);
  const [emailJaCadastrado, setEmailJaCadastrado] = useState(false);
  const [modalAberto, setModalAberto] = useState<DocumentoModal | null>(null);
  const termosTriggerRef = useRef<HTMLAnchorElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalAberto) return;

    const focoAnterior = document.activeElement as HTMLElement | null;
    const elementoTrigger = termosTriggerRef.current;
    const corpoOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focoInicial = window.setTimeout(() => {
      modalRef.current
        ?.querySelector<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        )
        ?.focus();
    }, 0);

    function lidarComTeclado(evento: globalThis.KeyboardEvent) {
      if (evento.key === 'Escape') {
        setModalAberto(null);
        return;
      }

      if (evento.key !== 'Tab' || !modalRef.current) return;

      const elementosFocaveis = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (elementosFocaveis.length === 0) return;

      const primeiro = elementosFocaveis[0];
      const ultimo = elementosFocaveis[elementosFocaveis.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener('keydown', lidarComTeclado);

    return () => {
      window.clearTimeout(focoInicial);
      document.body.style.overflow = corpoOverflow;
      document.removeEventListener('keydown', lidarComTeclado);
      (focoAnterior ?? elementoTrigger)?.focus();
    };
  }, [modalAberto]);

  function fecharModal() {
    setModalAberto(null);
  }

  function lidarComCliqueNoFundo(evento: MouseEvent<HTMLDivElement>) {
    if (evento.target === evento.currentTarget) fecharModal();
  }

  function lidarComTeclaNoFundo(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Enter' || evento.key === ' ') fecharModal();
  }

  function atualizarCampo(campo: keyof Campos, valor: string | boolean) {
    setCampos((estado) => ({ ...estado, [campo]: valor }));
    if (tocados[campo]) validarCampo(campo, valor);
    setEnviado(false);
    setAvisoGeral(null);
    if (campo === 'email') setEmailJaCadastrado(false);
  }

  function validarCampo(campo: keyof Campos, valor = campos[campo]) {
    const resultado = cadastroSchema.shape[campo].safeParse(valor);
    setErros((estado) => ({
      ...estado,
      [campo]: resultado.success
        ? undefined
        : resultado.error.issues[0]?.message,
    }));
  }

  function tocarCampo(campo: keyof Campos, valor = campos[campo]) {
    setTocados((estado) => ({ ...estado, [campo]: true }));
    validarCampo(campo, valor);
  }

  const formularioValido = cadastroSchema.safeParse(campos).success;

  async function criarConta(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (carregando) return;
    const resultado = cadastroSchema.safeParse(campos);

    if (!resultado.success) {
      const novosErros: Erros = {};
      resultado.error.issues.forEach((issue) => {
        const campo = issue.path[0] as keyof Campos;
        if (!novosErros[campo]) novosErros[campo] = issue.message;
      });
      setErros(novosErros);
      setTocados({
        nome: true,
        email: true,
        senha: true,
        aceitouTermos: true,
      });
      return;
    }

    setErros({});
    setAvisoGeral(null);
    setEmailJaCadastrado(false);
    setCarregando(true);

    try {
      const resposta = await cadastrar({
        nome: campos.nome,
        email: campos.email,
        senha: campos.senha,
      });

      if (resposta.status === 201) {
        router.push('/confirmar-email');
        return;
      }

      if (resposta.status === 409) {
        setEmailJaCadastrado(true);
        setErros((estado) => ({
          ...estado,
          email: 'Este e-mail já está cadastrado.',
        }));
        return;
      }

      if (resposta.status === 422) {
        const errosDoServidor = resposta.errors ?? [];
        const novosErros: Erros = {};
        errosDoServidor.forEach((erro) => {
          const campo = erro.field ?? erro.path?.[0];
          if (
            (campo === 'nome' || campo === 'email' || campo === 'senha') &&
            erro.message
          ) {
            novosErros[campo] = erro.message;
          }
        });
        if (Object.keys(novosErros).length === 0 && resposta.message) {
          setAvisoGeral(resposta.message);
        }
        setErros(novosErros);
        return;
      }

      setAvisoGeral(
        resposta.message ??
          'Não foi possível criar sua conta agora. Tente novamente em instantes.',
      );
    } catch {
      setAvisoGeral(
        'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.',
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <LayoutDuasColunas
        painel={<PainelApresentacao />}
        conteudo={
          <div className={styles.formulario}>
            <h2>Criar sua conta</h2>
            <p className={styles.introducao}>
              Leva menos de um minuto. Você já pode enviar seu primeiro material
              em seguida.
            </p>

            <form onSubmit={criarConta} noValidate>
              <Campo
                id="nome"
                label="Nome completo"
                type="text"
                placeholder="Ana Souza"
                value={campos.nome}
                error={erros.nome}
                touched={Boolean(tocados.nome)}
                onChange={(value) => atualizarCampo('nome', value)}
                onBlur={() => tocarCampo('nome')}
              />
              <Campo
                id="email"
                label="E-mail"
                type="email"
                placeholder="voce@exemplo.com"
                value={campos.email}
                error={erros.email}
                touched={Boolean(tocados.email)}
                onChange={(value) => atualizarCampo('email', value)}
                onBlur={() => tocarCampo('email')}
              />
              <Campo
                id="senha"
                label="Senha"
                type="password"
                placeholder="Mínimo de 8 caracteres"
                value={campos.senha}
                hint="Mínimo de 8 caracteres, com pelo menos um número."
                error={erros.senha}
                touched={Boolean(tocados.senha)}
                onChange={(value) => atualizarCampo('senha', value)}
                onBlur={() => tocarCampo('senha')}
              />

              <div className={styles.termosGrupo}>
                <label className={styles.termos}>
                  <input
                    type="checkbox"
                    checked={campos.aceitouTermos}
                    onChange={(event) => {
                      const valor = event.target.checked;
                      atualizarCampo('aceitouTermos', valor);
                      tocarCampo('aceitouTermos', valor);
                    }}
                    onBlur={() => tocarCampo('aceitouTermos')}
                    aria-invalid={Boolean(erros.aceitouTermos)}
                  />
                  <span className={styles.checkbox} aria-hidden="true">
                    ✓
                  </span>
                  <span>
                    Li e aceito os{' '}
                    <a
                      href="/termos"
                      className={styles.link}
                      ref={termosTriggerRef}
                      onClick={(evento) => {
                        evento.preventDefault();
                        setModalAberto('termos');
                      }}
                    >
                      termos de uso
                    </a>{' '}
                    e a{' '}
                    <a
                      href="/privacidade"
                      onClick={(evento) => {
                        evento.preventDefault();
                        setModalAberto('privacidade');
                      }}
                    >
                      política de privacidade
                    </a>
                    .
                  </span>
                </label>
                {erros.aceitouTermos && (
                  <span className={styles.erro}>{erros.aceitouTermos}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={carregando || !formularioValido}
                aria-busy={carregando}
              >
                {carregando ? 'Criando conta...' : 'Criar conta'}
              </button>
              {emailJaCadastrado && (
                <p className={styles.erroGeral}>
                  Já existe uma conta com este e-mail.{' '}
                  <a href="/entrar">Entre na sua conta.</a>
                </p>
              )}
              {avisoGeral && (
                <p className={styles.erroGeral} role="alert">
                  {avisoGeral}
                </p>
              )}
              {enviado && (
                <p className={styles.sucesso}>
                  Conta criada! Você já pode enviar seu material.
                </p>
              )}
            </form>

            <p className={styles.entrar}>
              Já tem conta? <a href="/entrar">Entrar</a>
            </p>
          </div>
        }
      />
      {modalAberto && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onClick={lidarComCliqueNoFundo}
          onKeyDown={lidarComTeclaNoFundo}
          tabIndex={-1}
        >
          <div
            ref={modalRef}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="termos-titulo"
          >
            <header className={styles.modalCabecalho}>
              <h2 id="termos-titulo">
                {modalAberto === 'termos'
                  ? 'Termos de uso'
                  : 'Política de privacidade'}
              </h2>
              <button
                type="button"
                className={styles.modalFechar}
                aria-label={`Fechar ${
                  modalAberto === 'termos'
                    ? 'termos de uso'
                    : 'política de privacidade'
                }`}
                onClick={fecharModal}
              >
                ×
              </button>
            </header>
            <div className={styles.modalConteudo}>
              <h3>1. O que a plataforma faz</h3>
              <p>
                O Your Journey recebe o material de estudo que você envia e
                devolve um mapa do que ele cobre, um plano de estudos até a data
                da sua prova e flashcards. Os resultados são gerados
                automaticamente e servem de apoio, não substituem o material
                oficial da prova.
              </p>
              <h3>2. O material que você envia</h3>
              <p>
                Você continua dono do que envia. Usamos o seu material apenas
                para gerar os resultados, e ele não é compartilhado com outros
                estudantes. Envie somente material que você tem o direito de
                usar.
              </p>
              <h3>3. Créditos</h3>
              <p>
                Cada análise de material, geração de plano e geração de
                flashcards consome créditos. O plano gratuito tem uma quantidade
                limitada por mês. Consultar resultados já gerados não consome
                nada.
              </p>
              <h3>4. Encerramento da conta</h3>
              <p>
                Você pode encerrar sua conta quando quiser. Ao encerrar, o
                material enviado e os resultados gerados são apagados.
              </p>
            </div>
            <footer className={styles.modalAcoes}>
              <button
                type="button"
                className={styles.modalCancelar}
                onClick={fecharModal}
              >
                Fechar
              </button>
              <button
                type="button"
                className={styles.modalAceitar}
                onClick={() => {
                  atualizarCampo('aceitouTermos', true);
                  fecharModal();
                }}
              >
                Li e aceito
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

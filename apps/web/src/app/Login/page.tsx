'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function Login() {
  return (
    <main className={styles.container}>
      {/* Lado Esquerdo - Verde escuro institucional */}
      <section className={styles.left}>
        <div className={styles.leftContent}>
          <span className={styles.logo}>Your Journey</span>

          <div className={styles.heroText}>
            <h1 className={styles.title}>
              Seu material.
              <br />
              Seu plano.
              <br />
              Sua prova.
            </h1>

            <p className={styles.subtitle}>
              Envie suas apostilas e provas antigas. A gente devolve o que
              estudar em cada dia até a data da prova.
            </p>

            <ul className={styles.featureList}>
              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>Mapa do que seu material cobre, e do que falta</span>
              </li>

              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Roadmap semana a semana até a data da prova</span>
              </li>

              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                  <path d="M7 7h10"></path>
                  <path d="M7 12h10"></path>
                  <path d="M7 17h6"></path>
                </svg>
                <span>Flashcards dos tópicos que mais caem</span>
              </li>
            </ul>
          </div>

          <p className={styles.footerNote}>
            Para quem estuda para o ENEM e para concurso público.
          </p>
        </div>
      </section>

      {/* Lado Direito - Formulário de Login */}
      <section className={styles.right}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Entrar</h2>
          <p className={styles.formSubtitle}>Bom te ver de volta.</p>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="ana.souza@gmail.com"
                defaultValue="ana.souza@gmail.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="senha">Senha</label>
                <a href="#" className={styles.forgotPassword}>
                  Esqueci minha senha
                </a>
              </div>
              <input
                id="senha"
                type="password"
                placeholder="Sua senha"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Entrar
            </button>

            <p className={styles.signupText}>
              Ainda não tem conta?{' '}
              <a href="#" className={styles.signupLink}>
                Criar conta
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

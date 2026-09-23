import styles from './PainelApresentacao.module.css';

const beneficios = [
  'Mapa do que seu material cobre, e do que falta',
  'Roadmap semana a semana até a data da prova',
  'Flashcards dos tópicos que mais caem',
];

export function PainelApresentacao() {
  return (
    <section className={styles.panel} aria-label="Sobre o Your Journey">
      <p className={styles.brand}>Your Journey</p>
      <div className={styles.message}>
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
        <ul>
          {beneficios.map((beneficio) => (
            <li key={beneficio}>◈ {beneficio}</li>
          ))}
        </ul>
      </div>
      <p className={styles.footer}>
        Para quem estuda para o ENEM e para concurso público.
      </p>
    </section>
  );
}

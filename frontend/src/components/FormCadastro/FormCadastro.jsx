import styles from './FormCadastro.module.css'

export default function FormCadastro({ title, subtitle, cadastro }) {
  return (
    <form className={styles.formCadastro}>
      <h2 className="text-[36px] font-medium text-gray-800">{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>

      <div>
        <p>Nome <b>*</b></p>
        <input type="text" placeholder="Digite seu nome" />
      </div>

      <div className={styles.both}>
        <div className={styles.halfsize}>
          <p>CPF <b>*</b></p>
          <input type="text" data-size="half" placeholder="Digite seu CPF" />
        </div>
        <div className={styles.halfsize}>
          <p>Data de nascimento <b>*</b></p>
          <input type="date" data-size="half" />
        </div>
      </div>

      <div>
        <p>Email <b>*</b></p>
        <input type="email" placeholder="Digite seu email" />
      </div>

      <div>
        <p>Senha <b>*</b></p>
        <input type="password" placeholder="Digite sua senha" />
      </div>

      {cadastro && (
        <>
          <button type="submit">Criar conta</button>
          <div style={{ textAlign: "center" }}>
            <p>Tem uma conta?</p>
            <a href="/login" style={{ color: "#1926DB" }}>Entrar</a>
          </div>
        </>
      )}
    </form>
  )
}

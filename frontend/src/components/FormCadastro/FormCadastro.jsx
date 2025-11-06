import { useNavigate } from 'react-router-dom'
import styles from './FormCadastro.module.css'
import FormEntry from '../../components/FormEntry'

export default function FormCadastro({ title, subtitle, cadastro, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chama a API de cadastro
    // Se foi bem-sucedido:
    setIsAuthenticated(true);
    navigate('/');
}
  return (
    <form className={styles.formCadastro} onSubmit={handleSubmit}>
      <h2 className="text-[36px] font-medium text-gray-800">{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>

      <div className={styles.fields}>
        {/* Nome */}
        <FormEntry
          label="Nome"
          placeholder="Digite seu nome"
        />

        {/* CPF + Data de nascimento */}
        <div className={styles.both}>
          <div className={styles.halfsize}>
            <FormEntry
              label="CPF"
              placeholder="Digite seu CPF"
              inputClass={styles.halfInput}
            />
          </div>
          <div className={styles.halfsize}>
            <label className="mb-1.5 text-base font-medium text-gray-700 flex items-center gap-1">
              Data de nascimento
              <span className="text-gray-500 ml-1">*</span>
            </label>
            <input
              type="date"
              className={styles.input}
            />
          </div>
          
        </div>

        {/* Email */}
        <FormEntry
          label="Email"
          placeholder="Digite seu email"
        />

        {/* Senha */}
        <div>
          <label className="mb-1.5 text-base font-medium text-gray-700 flex items-center gap-1">
            Senha
            <span className="text-gray-500 ml-1">*</span>
          </label>
          <input
            type="password"
            placeholder="Digite sua senha"
            className={styles.input}
          />
        </div>

        {cadastro && (
          <>
            <button type="submit">Criar conta</button>
            <div style={{ textAlign: "center" }}>
              <p>Tem uma conta?</p>
              <a href="/login" className={styles.link}>Entrar</a>
            </div>
          </>
        )}
      </div>
    </form>
  )
}

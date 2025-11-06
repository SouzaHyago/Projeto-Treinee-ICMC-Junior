import Logo from '@/components/Logo'
import background from '@/assets/background.png'
import styles from './Cadastro.module.css'
import FormCadastro from '@/components/FormCadastro'

export default function Cadastro({ setIsAuthenticated }) {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>

      <div className={styles.formContainer}>
        <FormCadastro
          title="Comece Agora"
          subtitle = "Insira seus dados para criar uma conta" 
          cadastro={true}
          setIsAuthenticated={setIsAuthenticated}
        />
      </div>

      <div>
        <img src={background} className={styles.background} alt="" />
      </div>
    </div>
  )
}

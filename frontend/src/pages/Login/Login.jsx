import Logo from '@/components/Logo'
import background from '@/assets/background.png'
import styles from './Login.module.css'
import FormLogin from '@/components/FormLogin'

export default function Cadastro() {
  return (
    <div className={styles.container}>

      <div className={styles.logo}>
        <Logo />
      </div>

      <div className={styles.formContainer}>
        <FormLogin/>
      </div>

      <div>
        <img src={background} className={styles.background} alt="" />
      </div>
    </div>
  )
}

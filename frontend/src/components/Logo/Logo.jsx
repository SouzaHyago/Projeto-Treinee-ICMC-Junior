import lamp from '@/assets/lamp.svg'
import icmcJunior from '@/assets/icmcJr_logo.svg'
import styles from './Logo.module.css'

export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <img src={lamp} alt="Lâmpada" className={styles.logoIcon} />
      <img src={icmcJunior} alt="ICMC Junior" className={styles.logoText} />
    </div>
  )
}

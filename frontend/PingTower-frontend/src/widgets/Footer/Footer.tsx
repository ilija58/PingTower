import logo from '../../assets/img/logo-dark.svg'

import styles from './Footer.module.scss'

export function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.copyright}>
					<img src={logo} alt="logo" />
					<p>&copy; {new Date().getFullYear()} PingTower</p>
				</div>
				<div className={styles.list}>
					<a href="#" className={styles.item}>
						Тарифы
					</a>
					<a href="#" className={styles.item}>
						Документация
					</a>
					<a href="#" className={styles.item}>
						Правила конфиденциальности
					</a>
				</div>
			</div>
		</footer>
	)
}

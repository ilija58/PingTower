import { Link } from 'react-router-dom'

import IcoFolder from '../../assets/img/folder-add-ico.svg'
import IcoLightError from '../../assets/img/light-error.svg'
import IcoLightSuccess from '../../assets/img/light-success.svg'
import IcoLightWarning from '../../assets/img/light-warning.svg'
import IcoOpen from '../../assets/img/open-ico.svg'
import SearchIcon from '../../assets/img/search-ico.svg'

import styles from './Home.module.scss'
import { ROUTES } from '@/routes'
import { useUserStore } from '@/store/userStore'

const lights = {
	success: IcoLightSuccess,
	error: IcoLightError,
	warning: IcoLightWarning
}

export function Home() {
	const services = useUserStore(state => state.services)
	const isLoadingServices = useUserStore(state => state.isLoadingServices)

	return (
		<div className={styles.container}>
			<div className={styles.heading}>
				<div className={styles.left}>
					<p>Мониторинг сбоев</p>
				</div>
				<div className={styles.right}>
					<div className={styles.searchInputWrapper}>
						<img src={SearchIcon} alt="Search" className={styles.searchIcon} />
						<input type="text" placeholder="Поиск..." id={styles.search} />
					</div>
					<Link to="/addService" className={styles.addBtn}>
						Добавьте сервис
					</Link>
				</div>
			</div>

			<div className={styles.content}>
				{isLoadingServices ? (
					<p>Загрузка сервисов...</p>
				) : services.length > 0 ? (
					<div className={styles.servicesList}>
						{services.map(service => (
							<div className={styles.serviceCard}>
								<div className={styles.left}>
									<div className={styles.light}>
										<img src={lights[service.type]} alt="light ico" />
									</div>
									<div className={styles.text}>
										<div className={styles.serviceName}>{service.name}</div>
										<div className={`${styles.status} ${styles[service.type]}`}>
											{service.status}
										</div>
									</div>
								</div>
								<div className={styles.right}>
									<Link
										to={`/service/${service.id}`}
										key={service.id}
										className={styles.openBtn}
									>
										Открыть <img src={IcoOpen} alt="open ico" />
									</Link>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className={styles.block}>
						<p className={styles.heading}>Ваши сервисы</p>
						<div className={styles.add}>
							<img src={IcoFolder} alt="folder ico" />
							<div>
								<p className={styles.title}>Нет сервисов в мониторинге</p>
								<p className={styles.text}>
									Вы пока не добавили ни одного сервиса
								</p>
							</div>
							<Link to={ROUTES.addService.path}>Добавить проект</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

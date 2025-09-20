import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useUserStore } from '@/store/userStore'

import IcoFolder from '../../assets/img/folder-add-ico.svg'
import IcoLightError from '../../assets/img/light-error.svg'
import IcoLightSuccess from '../../assets/img/light-success.svg'
import IcoOpen from '../../assets/img/open-ico.svg'
import SearchIcon from '../../assets/img/search-ico.svg'

import styles from './Home.module.scss'
import { ROUTES } from '@/routes'

const statusMap = {
	up: {
		text: 'Online',
		style: 'success',
		icon: IcoLightSuccess
	},
	down: {
		text: 'Offline',
		style: 'error',
		icon: IcoLightError
	}
}

export function Home() {
	const { services, isLoadingServices, fetchSites } = useUserStore(
		state => state
	)

	useEffect(() => {
		fetchSites()
	}, [fetchSites])

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
					<Link to={ROUTES.addService.path} className={styles.addBtn}>
						Добавить сервис
					</Link>
				</div>
			</div>

			<div className={styles.content}>
				{isLoadingServices ? (
					<p>Загрузка сервисов...</p>
				) : services.length > 0 ? (
					<div className={styles.servicesList}>
						{services.map(service => {
							const statusInfo = statusMap[service.status] || statusMap.down
							return (
								<div key={service.id} className={styles.serviceCard}>
									<div className={styles.left}>
										<div className={styles.light}>
											<img src={statusInfo.icon} alt="status icon" />
										</div>
										<div className={styles.text}>
											<div className={styles.serviceName}>{service.name}</div>
											<div
												className={`${styles.status} ${styles[statusInfo.style]}`}
											>
												{statusInfo.text}
											</div>
										</div>
									</div>
									<div className={styles.right}>
										<Link
											to={`/service/${service.id}`}
											className={styles.openBtn}
										>
											Открыть <img src={IcoOpen} alt="open ico" />
										</Link>
									</div>
								</div>
							)
						})}
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

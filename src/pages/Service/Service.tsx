import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useServiceStore } from '@/store/serviceStore'

import IcoConfigure from '../../assets/img/configure-ico.svg'
import IcoDelete from '../../assets/img/delete-ico.svg'
import IcoStop from '../../assets/img/stop-ico.svg'
import { ResponseTimeChart } from '../../widgets/ResponseTimeChart/ResponseTimeChart'

import styles from './Service.module.scss'
import { ROUTES } from '@/routes'

export function Service() {
	const { id } = useParams<{ id: string }>()
	const { service, isLoading, error, fetchService, clearService } =
		useServiceStore()

	useEffect(() => {
		if (id) {
			fetchService(id)
		}

		return () => {
			clearService()
		}
	}, [id, fetchService, clearService])

	if (isLoading) {
		return (
			<div className={styles.container}>
				<p>Загрузка данных о сервисе...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.container}>
				<p>Ошибка: {error}</p>
			</div>
		)
	}

	if (!service) {
		return (
			<div className={styles.container}>
				<p>Сервис не найден.</p>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className="header">
				<div className={styles.breadcrumbs}>
					<Link to={ROUTES.home.path}>Главная</Link> /{' '}
					<span className={styles.active}>{service.name}</span>
				</div>
				<div className={styles.info}>
					<div className={styles.left}>
						<div className={styles.top}>{service.name}</div>
						<div className={styles.bottom}>
							<div className={`${styles.status} ${styles[service.type]}`}>
								{service.status}
							</div>
							<div className={styles.check}>Проверка каждую минуту</div>
						</div>
					</div>
					<div className={styles.right}>
						<button className={styles.stop}>
							<img src={IcoStop} alt="stop ico" /> Приостановить
						</button>
						<button className={styles.configure}>
							<img src={IcoConfigure} alt="stop ico" /> Настроить
						</button>
						<button className={styles.delete}>
							<img src={IcoDelete} alt="stop ico" /> Удалить
						</button>
					</div>
				</div>
			</div>
			<div className={styles.statistics}>
				{/* This part can also be populated with dynamic data later */}
				<div className={styles.cardColumn}>
					<div className={styles.cardS}>
						<div className={styles.heading}>HTTP-код ответа</div>
						<div className={styles.text}>200</div>
					</div>
					<div className={styles.cardS}>
						<div className={styles.heading}>Последняя проверка</div>
						<div className={styles.text}>36 секунд назад</div>
					</div>
				</div>
				<div className={styles.cardColumn}>
					<div className={styles.cardS}>
						<div className={styles.heading}>Аптайм</div>
						<div className={styles.text}>64 дня</div>
					</div>
					<div className={styles.cardS}>
						<div className={styles.heading}>SSL-сертификат</div>
						<div className={styles.text}>До 19 сентября 2026</div>
					</div>
				</div>
				<div className={styles.cardL}>
					<div className={styles.heading}>Состояние системы</div>
					<div className={styles.text}>Сервисы</div>
					<div className={styles.list}>
						{/* This list can be dynamic too */}
					</div>
				</div>
				<div className={styles.chart}>
					<ResponseTimeChart />
				</div>
			</div>
		</div>
	)
}

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useServiceStore } from '@/store/serviceStore'
import { useUserStore } from '@/store/userStore'

import { getSiteChecks, getSiteIncidents } from '@/services/serviceService'

import { ResponseTimeChart } from '@/widgets/ResponseTimeChart/ResponseTimeChart'

import IcoConfigure from '../../assets/img/configure-ico.svg'
import IcoDelete from '../../assets/img/delete-ico.svg'
import IcoStop from '../../assets/img/stop-ico.svg'
import { Incidents } from '../../widgets/Incidents/Incidents'

import styles from './Service.module.scss'
import { ROUTES } from '@/routes'
import { type ISiteChecks, type Incidents as IncidentsType } from '@/types'

const formatTimeAgo = (date: Date) => {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
	let interval = seconds / 31536000
	if (interval > 1) {
		return Math.floor(interval) + ' years ago'
	}
	interval = seconds / 2592000
	if (interval > 1) {
		return Math.floor(interval) + ' months ago'
	}
	interval = seconds / 86400
	if (interval > 1) {
		return Math.floor(interval) + ' days ago'
	}
	interval = seconds / 3600
	if (interval > 1) {
		return Math.floor(interval) + ' hours ago'
	}
	interval = seconds / 60
	if (interval > 1) {
		return Math.floor(interval) + ' minutes ago'
	}
	return Math.floor(seconds) + ' seconds ago'
}

export function Service() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { service, isLoading, error, fetchService, clearService } =
		useServiceStore()
	const { removeSite } = useUserStore(state => state)
	const [checks, setChecks] = useState<ISiteChecks[]>([])
	const [loadingChecks, setLoadingChecks] = useState(true)
	const [incidents, setIncidents] = useState<IncidentsType[]>([])
	const [loadingIncidents, setLoadingIncidents] = useState(true)

	useEffect(() => {
		if (id) {
			fetchService(Number(id))

			const fetchChecks = async () => {
				try {
					setLoadingChecks(true)
					const data = await getSiteChecks(Number(id))
					// Sort checks by date to get the latest one
					data.sort(
						(a, b) =>
							new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
					)
					setChecks(data)
				} catch (err) {
					// setErrorChecks('Failed to fetch checks')
					console.error(err)
				} finally {
					setLoadingChecks(false)
				}
			}
			fetchChecks()

			const fetchIncidents = async () => {
				try {
					setLoadingIncidents(true)
					const data = await getSiteIncidents(Number(id))
					data.sort(
						(a, b) =>
							new Date(b.start_time).getTime() -
							new Date(a.start_time).getTime()
					)
					setIncidents(data)
				} catch (err) {
					// setErrorIncidents('Failed to fetch incidents')
					console.error(err)
				} finally {
					setLoadingIncidents(false)
				}
			}
			fetchIncidents()
		}

		return () => {
			clearService()
		}
	}, [id, fetchService, clearService])

	const handleDelete = async (id: number) => {
		if (window.confirm('Are you sure you want to delete this site?')) {
			await removeSite(id)
			navigate(ROUTES.home.path)
		}
	}

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

	const lastCheck = checks.length > 0 ? new Date(checks[0].timestamp) : null
	const lastIncident =
		incidents.length > 0 && incidents[0].end_time
			? new Date(incidents[0].end_time)
			: null

	const statusMap = {
		ok: {
			text: 'Доступен',
			style: 'success'
		},
		fail: {
			text: 'Не доступен',
			style: 'error'
		},
		degraded: {
			text: 'Проверяется',
			style: 'warning'
		},
		unknown: {
			text: 'Неизвестно',
			style: 'error'
		}
	}

	const statusInfo = statusMap[service.status]

	const chartChecks = checks.slice(0, 20).reverse()

	const chartData = {
		labels: chartChecks.map(check =>
			new Date(check.timestamp).toLocaleTimeString('ru-RU')
		),
		datasets: [
			{
				label: 'Latency (ms)',
				data: chartChecks.map(check => check.latency_ms),
				backgroundColor: 'rgba(138, 99, 255, 0.7)'
			}
		]
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
							<div className={`${styles.status} ${styles[statusInfo.style]}`}>
								{statusInfo.text}
							</div>
							<div className={styles.check}>Проверка каждую минуту</div>
						</div>
					</div>
					<div className={styles.right}>
						<button className={styles.stop} disabled>
							<img src={IcoStop} alt="stop ico" /> Приостановить
						</button>
						<button className={styles.configure} disabled>
							<img src={IcoConfigure} alt="stop ico" /> Настроить
						</button>
						<button
							className={styles.delete}
							onClick={() => handleDelete(service.id)}
						>
							<img src={IcoDelete} alt="stop ico" /> Удалить
						</button>
					</div>
				</div>
			</div>
			<div className={styles.statistics}>
				<div className={styles.cardS}>
					<div className={styles.heading}>HTTP-код ответа</div>
					<div className={styles.text}>{service.expected_status_code}</div>
				</div>
				<div className={styles.cardS}>
					<div className={styles.heading}>Последняя проверка</div>
					<div className={styles.text}>
						{loadingChecks
							? 'Загрузка...'
							: lastCheck
								? formatTimeAgo(lastCheck)
								: 'Нет данных'}
					</div>
				</div>
				<div className={styles.cardS}>
					<div className={styles.heading}>Аптайм</div>
					<div className={styles.text}>
						{loadingIncidents
							? 'Загрузка...'
							: lastIncident
								? formatTimeAgo(lastIncident)
								: 'Нет данных'}
					</div>
				</div>
				<div className={styles.cardS}>
					<div className={styles.heading}>SSL-сертификат</div>
					<div className={styles.text}>
						{service.ssl_expires_at
							? `До ${new Date(service.ssl_expires_at).toLocaleDateString(
									'ru-RU',
									{
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									}
								)}`
							: 'Нет данных'}
					</div>
				</div>
				<div className={styles.chart}>
					<ResponseTimeChart data={chartData} />
				</div>
				<div className={styles.chart}>
					<Incidents />
				</div>
			</div>
		</div>
	)
}

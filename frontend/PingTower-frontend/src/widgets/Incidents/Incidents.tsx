import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getSiteIncidents } from '@/services/serviceService'

import IcoSuccessCheck from '../../assets/img/success-check-ico.svg'

import styles from './Incidents.module.scss'
import { type Incidents as IncidentsType } from '@/types'

// Helper function to get the last 30 days
const getLast30Days = () => {
	const dates = []
	for (let i = 0; i < 30; i++) {
		const date = new Date()
		date.setDate(date.getDate() - i)
		dates.push(date)
	}
	return dates.reverse()
}

export function Incidents() {
	const { id } = useParams<{ id: string }>()
	const [incidents, setIncidents] = useState<IncidentsType[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [selectedDate, setSelectedDate] = useState(new Date())

	useEffect(() => {
		if (id) {
			const fetchIncidents = async () => {
				try {
					setLoading(true)
					const data = await getSiteIncidents(Number(id))
					setIncidents(data)
				} catch (err: unknown) {
					setError('Failed to fetch incidents.')
					console.error(err)
				} finally {
					setLoading(false)
				}
			}
			fetchIncidents()
		}
	}, [id])

	if (loading) {
		return <p>Загрузка инцидентов...</p>
	}

	if (error) {
		return <p>{error}</p>
	}

	const days = getLast30Days()

	const incidentsByDay = days.map(day => {
		const dayString = day.toISOString().split('T')[0]
		const hasIncident = incidents.some(incident => {
			const incidentDate = new Date(incident.start_time)
				.toISOString()
				.split('T')[0]
			return incidentDate === dayString
		})
		return { date: day, hasIncident }
	})

	const selectedDayString = selectedDate.toISOString().split('T')[0]
	const incidentsForSelectedDay = incidents.filter(incident => {
		const incidentDate = new Date(incident.start_time)
			.toISOString()
			.split('T')[0]
		return incidentDate === selectedDayString
	})

	return (
		<div className={styles.incidents}>
			<h2 className={styles.title}>Инциденты</h2>
			<p className={styles.subtitle}>Данные за последние 30 дней</p>
			<div className={styles.timeline}>
				{incidentsByDay.map(({ date, hasIncident }) => (
					<div
						key={date.toISOString()}
						className={`${styles.timelineBar} ${
							hasIncident ? styles.error : styles.ok
						} ${
							date.toISOString().split('T')[0] === selectedDayString
								? styles.selected
								: ''
						}`}
						onClick={() => setSelectedDate(date)}
					/>
				))}
			</div>
			<div className={styles.list}>
				<div className={styles.listHeader}>
					{selectedDate.toLocaleDateString('ru-RU', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric'
					})}
				</div>
				{incidentsForSelectedDay.length === 0 ? (
					<div className={styles.noIncidents}>
						<img src={IcoSuccessCheck} alt="success check ico" />
						<p>Ошибок не обнаружено</p>
						<span>Все сервисы работают штатно</span>
					</div>
				) : (
					incidentsForSelectedDay.map(incident => (
						<div key={incident.id} className={styles.incidentItem}>
							<div className={styles.incidentHeader}>
								<span className={styles.incidentTime}>
									{new Date(incident.start_time).toLocaleTimeString('ru-RU', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</span>
							</div>
							<div className={styles.incidentBody}>
								<p className={styles.incidentTitle}>
									{incident.severity}{' '}
									<span className={styles.active}>Активен</span>
								</p>
								<p className={styles.incidentMessage}>{incident.description}</p>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	)
}

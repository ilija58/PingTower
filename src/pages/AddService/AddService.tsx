import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

import { useUserStore } from '@/store/userStore'

import { type CreateSitePayload } from '@/services/serviceService'

import { CustomSelect } from '../../widgets/CustomSelect/CustomSelect'

import styles from './AddService.module.scss'
// import IcoFlag from '../../assets/img/flag.svg'

import { ROUTES } from '@/routes'

const MONITORING_TYPES = ['HTTP/HTTPS', 'Ping', 'Порт TCP']
const CHECK_INTERVALS = ['1 мин', '3 мин', '5 мин']
const TIMEOUT_OPTIONS = ['1 сек', '10 сек', '30 сек', '60 сек']
const METHOD_OPTIONS = ['HEAD', 'GET', 'OPTIONS', 'POST', 'PUT', 'PATCH']

export function AddService() {
	// Form state
	const [monitoringType, setMonitoringType] = useState(MONITORING_TYPES[0])
	const [host, setHost] = useState('')
	const [method, setMethod] = useState(METHOD_OPTIONS[0])
	const [checkInterval, setCheckInterval] = useState(CHECK_INTERVALS[0])
	const [serviceName, setServiceName] = useState('')
	const [sslCheck, setSslCheck] = useState(false)
	const [followRedirects, setFollowRedirects] = useState(true) // UI only, not in API
	const [timeout, setTimeout] = useState(TIMEOUT_OPTIONS[0])

	// Submission state
	const [isLoading, setIsLoading] = useState(false)

	const { addSite } = useUserStore()
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!host) {
			toast.error('Хост является обязательным полем.')
			return
		}

		setIsLoading(true)

		// --- Data Transformation ---
		const getCheckIntervalInSeconds = (interval: string): number => {
			const value = parseInt(interval, 10)
			return value * 60 // Convert minutes to seconds
		}

		const getTimeoutInSeconds = (timeoutStr: string): number => {
			return parseInt(timeoutStr, 10)
		}

		const getCheckType = (type: string): CreateSitePayload['check_type'] => {
			if (type === 'HTTP/HTTPS') return 'http'
			if (type === 'Ping') return 'ping'
			return 'tcp'
		}

		const payload: CreateSitePayload = {
			name: serviceName || host,
			target: host,
			check_type: getCheckType(monitoringType),
			http_method: method as CreateSitePayload['http_method'],
			port: 443,
			timeout: getTimeoutInSeconds(timeout),
			check_interval: getCheckIntervalInSeconds(checkInterval),
			expected_status_code: 200,
			ssl_check_enabled: sslCheck,
			domain_check_enabled: sslCheck,
			active: true
		}

		try {
			await addSite(payload)
			toast.success('Сервис успешно добавлен!')
			navigate(ROUTES.home.path) // Redirect on success
		} catch (err) {
			toast.error('Не удалось добавить сервис. Пожалуйста, попробуйте снова.')
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.breadcrumbs}>
				<Link to={ROUTES.home.path}>Главная</Link> /{' '}
				<span className={styles.active}>Новый сервис</span>
			</div>

			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<h2>Новый сервис</h2>
					<p>Выберите нужный способ мониторинга и настройте его под себя</p>
				</div>

				<div className={styles.formGroup}>
					<label>Тип мониторинга</label>
					<div className={styles.toggleButtonGroup}>
						{MONITORING_TYPES.map(type => (
							<button
								type="button"
								key={type}
								className={monitoringType === type ? styles.active : ''}
								onClick={() => setMonitoringType(type)}
							>
								{type}
							</button>
						))}
					</div>
				</div>

				<div className={styles.gridGroup}>
					<div className={styles.formGroup}>
						<label htmlFor="host">Хост</label>
						<input
							type="text"
							id="host"
							placeholder="http://pingtower.ru"
							value={host}
							onChange={e => setHost(e.target.value)}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<label>Метод</label>
						<CustomSelect
							options={METHOD_OPTIONS}
							value={method}
							onChange={setMethod}
						/>
					</div>
				</div>

				<div className={styles.formGroup}>
					<label>Интервал проверки</label>
					<div className={styles.toggleButtonGroup}>
						{CHECK_INTERVALS.map(interval => (
							<button
								type="button"
								key={interval}
								className={checkInterval === interval ? styles.active : ''}
								onClick={() => setCheckInterval(interval)}
							>
								{interval}
							</button>
						))}
					</div>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="service-name">Название сервиса</label>
					<input
						type="text"
						id="service-name"
						placeholder="Необязательно"
						value={serviceName}
						onChange={e => setServiceName(e.target.value)}
					/>
				</div>

				<div className={styles.switchGroup}>
					<label htmlFor="ssl-toggle">Контроль SSL-сертификата и домена</label>
					<label className={styles.switch}>
						<input
							type="checkbox"
							id="ssl-toggle"
							checked={sslCheck}
							onChange={e => setSslCheck(e.target.checked)}
						/>
						<span className={styles.slider}></span>
					</label>
				</div>

				<div className={styles.switchGroup}>
					<label htmlFor="redirect-toggle">Следовать за редиректами</label>
					<label className={styles.switch}>
						<input
							type="checkbox"
							id="redirect-toggle"
							checked={followRedirects}
							onChange={e => setFollowRedirects(e.target.checked)}
						/>
						<span className={styles.slider}></span>
					</label>
				</div>

				<div className={styles.formGroup}>
					<label>
						Таймаут запроса
						<br />
						<span>Максимальное время ожидания ответа от сервера</span>
					</label>
					<div className={styles.toggleButtonGroup}>
						{TIMEOUT_OPTIONS.map(option => (
							<button
								type="button"
								key={option}
								className={timeout === option ? styles.active : ''}
								onClick={() => setTimeout(option)}
							>
								{option}
							</button>
						))}
					</div>
				</div>

				{/* {error && <p className={styles.error}>{error}</p>} */}

				<button
					type="submit"
					className={styles.submitButton}
					disabled={isLoading}
				>
					{isLoading ? 'Добавление...' : 'Начать мониторинг'}
				</button>
			</form>
		</div>
	)
}

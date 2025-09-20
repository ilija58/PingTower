import { useState } from 'react'
import { Link } from 'react-router-dom'

import IcoFlag from '../../assets/img/flag.svg'
import { CustomSelect } from '../../widgets/CustomSelect/CustomSelect'

import styles from './AddService.module.scss'
import { ROUTES } from '@/routes'

const MONITORING_TYPES = ['HTTP/HTTPS', 'Ping', 'Порт TCP']
const CHECK_INTERVALS = ['1 мин', '3 мин', '5 мин', 'Свой интервал']
const TIMEOUT_OPTIONS = ['1 сек', '10 сек', '30 сек', '60 сек']
const METHOD_OPTIONS = ['HEAD', 'GET', 'OPTIONS', 'POST', 'PUT', 'PATCH']
const REGION_OPTIONS = ['Москва', 'Санкт-Петербург', 'Нижний Новгород']

export function AddService() {
	const [monitoringType, setMonitoringType] = useState(MONITORING_TYPES[0])
	const [checkInterval, setCheckInterval] = useState(CHECK_INTERVALS[0])
	const [timeout, setTimeout] = useState(TIMEOUT_OPTIONS[0])
	const [method, setMethod] = useState(METHOD_OPTIONS[0])
	const [selectedRegions, setSelectedRegions] = useState([
		'Москва',
		'Санкт-Петербург',
		'Нижний Новгород'
	])

	const handleRegionToggle = (region: string) => {
		setSelectedRegions(
			prev =>
				prev.includes(region)
					? prev.filter(r => r !== region) // unselect
					: [...prev, region] // select
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.breadcrumbs}>
				<Link to={ROUTES.home.path}>Главная</Link> /{' '}
				<span className={styles.active}>Новый сервис</span>
			</div>

			<form className={styles.form} onSubmit={e => e.preventDefault()}>
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
						<input type="text" id="host" placeholder="http://pingtower.ru" />
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
					<input type="text" id="service-name" placeholder="Необязательно" />
				</div>

				<div className={styles.formGroup}>
					<label>Регионы проверки</label>
					<div className={styles.regionGroup}>
						{REGION_OPTIONS.map(region => (
							<button
								type="button"
								key={region}
								className={
									selectedRegions.includes(region) ? styles.active : ''
								}
								onClick={() => handleRegionToggle(region)}
							>
								<span className={styles.flag}>
									<img src={IcoFlag} alt="flag ico" />
								</span>{' '}
								{region}
							</button>
						))}
					</div>
					<p className={styles.subtleText}>
						Несколько регионов увеличивают надёжность мониторинга
					</p>
				</div>

				<div className={styles.switchGroup}>
					<label htmlFor="ssl-toggle">Контроль SSL-сертификата и домена</label>
					<label className={styles.switch}>
						<input type="checkbox" id="ssl-toggle" />
						<span className={styles.slider}></span>
					</label>
				</div>

				<div className={styles.switchGroup}>
					<label htmlFor="redirect-toggle">Следовать за редиректами</label>
					<label className={styles.switch}>
						<input type="checkbox" id="redirect-toggle" defaultChecked />
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

				<button type="submit" className={styles.submitButton}>
					Начать мониторинг
				</button>
			</form>
		</div>
	)
}

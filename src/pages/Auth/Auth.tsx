import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'

import Logo from '../../assets/img/logo.svg'

import styles from './Auth.module.scss'

export function Auth() {
	const [isLoginMode, setIsLoginMode] = useState(true)
	const [username, setUsername] = useState('')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [termsAccepted, setTermsAccepted] = useState(false)
	const [registrationSuccess, setRegistrationSuccess] = useState(false)
	const navigate = useNavigate()

	// Get state and actions from the Zustand store
	const { login, register, isLoading, error, isAuthenticated } = useAuthStore()

	// Effect to redirect on successful authentication
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/')
		}
	}, [isAuthenticated, navigate])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setRegistrationSuccess(false)
		try {
			if (isLoginMode) {
				await login(username, password)
				// The useEffect above will handle the redirect on success
			} else {
				await register(username, email, name, password)
				// Handle successful registration
				setRegistrationSuccess(true)
				setIsLoginMode(true)
				// Clear form fields except for username/password which might be the same
				setName('')
				setEmail('')
				setTermsAccepted(false)
			}
		} catch (err) {
			// Error is already set in the store, just log it for debugging
			console.error('Failed to authenticate:', err)
		}
	}

	let isButtonDisabled = isLoading || !username || !password
	if (!isLoginMode) {
		isButtonDisabled = isButtonDisabled || !termsAccepted || !name || !email
	}

	return (
		<div className={styles.container}>
			<div className={styles.logo}>
				<img src={Logo} alt="logo" />
				<div className={styles.text}>PingTower</div>
			</div>
			<div className={styles.formWrapper}>
				<form onSubmit={handleSubmit}>
					<div className={styles.header}>
						<h2>{isLoginMode ? 'Вход в аккаунт' : 'Создание аккаунта'}</h2>
						<p>Введите свои данные, чтобы продолжить работу</p>
					</div>

					{registrationSuccess && (
						<p className={styles.success}>
							Регистрация прошла успешно! Теперь вы можете войти.
						</p>
					)}

					{!isLoginMode && (
						<div className={styles.formGroup}>
							<label htmlFor="name">ФИО</label>
							<input
								type="text"
								id="name"
								placeholder="Введите ваше ФИО"
								value={name}
								onChange={e => setName(e.target.value)}
								required
							/>
						</div>
					)}

					<div className={styles.formGroup}>
						<label htmlFor="username">Никнейм</label>
						<input
							type="text"
							id="username"
							placeholder={
								isLoginMode ? 'Введите свой никнейм' : 'Придумайте себе никнейм'
							}
							value={username}
							onChange={e => setUsername(e.target.value)}
							required
						/>
					</div>

					{!isLoginMode && (
						<div className={styles.formGroup}>
							<label htmlFor="email">Email</label>
							<input
								type="email"
								id="email"
								placeholder="Введите ваш email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
							/>
						</div>
					)}

					<div className={styles.formGroup}>
						<label htmlFor="password">Пароль</label>
						<input
							type="password"
							id="password"
							placeholder="Введите ваше пэсуорд"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</div>

					{!isLoginMode && (
						<label className={styles.customCheckbox}>
							<input
								type="checkbox"
								checked={termsAccepted}
								onChange={e => setTermsAccepted(e.target.checked)}
							/>
							<span className={styles.checkmark}></span>
							<span className={styles.labelText}>
								Я согласен с <a href="#">Условиями предоставления услуг</a> и
								подтверждаю <a href="#">Политику конфиденциальности</a>
							</span>
						</label>
					)}

					{error && <p className={styles.error}>{error}</p>}

					<button
						type="submit"
						className={styles.primaryButton}
						disabled={isButtonDisabled}
					>
						{isLoading
							? 'Загрузка...'
							: isLoginMode
								? 'Войти'
								: 'Зарегистрироваться'}
					</button>

					<div className={styles.divider}>
						<div className={styles.line}></div>
						или
						<div className={styles.line}></div>
					</div>

					<button
						type="button"
						className={styles.secondaryButton}
						onClick={() => {
							setIsLoginMode(!isLoginMode)
							setRegistrationSuccess(false)
							useAuthStore.setState({ error: null })
						}}
					>
						{isLoginMode ? 'Зарегистрироваться' : 'Войти в аккаунт'}
					</button>
				</form>
			</div>
		</div>
	)
}

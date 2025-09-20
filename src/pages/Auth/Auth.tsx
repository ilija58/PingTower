import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'

import Logo from '../../assets/img/logo.svg'

import styles from './Auth.module.scss'

export function Auth() {
	const [isLoginMode, setIsLoginMode] = useState(true)
	const [nickname, setNickname] = useState('')
	const [password, setPassword] = useState('')
	const [termsAccepted, setTermsAccepted] = useState(false)
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
		const action = isLoginMode ? login : register
		try {
			await action(nickname, password)
			// The useEffect above will handle the redirect
		} catch (err) {
			// Error is already set in the store, just log it
			console.error('Failed to authenticate:', err)
		}
	}

	let isButtonDisabled = isLoading || !nickname || !password
	if (!isLoginMode) {
		isButtonDisabled = isButtonDisabled || !termsAccepted
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

					<div className={styles.formGroup}>
						<label htmlFor="nickname">Никнейм</label>
						<input
							type="text" // Changed from email to text to reflect "nickname"
							id="nickname"
							placeholder={
								isLoginMode ? 'Введите свой никнейм' : 'Придумайте себе никнейм'
							}
							value={nickname}
							onChange={e => setNickname(e.target.value)}
							required
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="password">Пароль</label>
						<input
							type="password"
							id="password"
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
							// Also reset error from the store if you switch modes
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

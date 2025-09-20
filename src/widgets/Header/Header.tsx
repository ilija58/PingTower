import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'

import avatar from '../../assets/img/avatar.png'
import logo from '../../assets/img/logo.svg'
import IcoLogout from '../../assets/img/logout-ico.svg'
import IcoNotification from '../../assets/img/notification-ico.svg'

import styles from './Header.module.scss'
import { ROUTES } from '@/routes'

export function Header() {
	const logout = useAuthStore(state => state.logout)
	const user = useUserStore(state => state.user)

	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className={styles.container}>
			<div className={styles.flex}>
				<Link to={ROUTES.home.path} className={styles.logo}>
					<img src={logo} alt="logo" />
					<div className={styles.text}>PingTower</div>
				</Link>
				<div className={styles.account}>
					<button className={styles.notification}>
						<img src={IcoNotification} alt="notification ico" />
					</button>

					<div className={styles.profileWrapper} ref={dropdownRef}>
						<button
							className={styles.profile}
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						>
							<img src={avatar} alt="profile image" />
							<div className={styles.text}>{user ? user.nickname : '...'}</div>
						</button>

						{isDropdownOpen && (
							<div className={styles.profileDropdown}>
								<div className={styles.userInfo}>
									<p className={styles.name}>
										{user?.fullName || user?.nickname}
									</p>
									<p className={styles.email}>{user?.email}</p>
								</div>
								<div className={styles.line}></div>
								<button onClick={logout} className={styles.logoutButton}>
									<span>Выйти</span>
									<img src={IcoLogout} alt="Logout" />
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

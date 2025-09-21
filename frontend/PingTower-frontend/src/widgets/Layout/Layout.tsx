import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'

import { SearchProvider } from '@/providers/search/SearchProvider'

import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'

import styles from './Layout.module.scss'

export function Layout() {
	return (
		<SearchProvider>
			<div className={styles.layout}>
				<Header />
				<div className={styles.container}>
					<Outlet />
				</div>
				<Footer />
			</div>
			<Toaster />
		</SearchProvider>
	)
}

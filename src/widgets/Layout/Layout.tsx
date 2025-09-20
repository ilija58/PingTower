import { Outlet } from 'react-router-dom'

import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'

import styles from './Layout.module.scss'
import { SearchProvider } from '@/providers/search/SearchProvider'

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
		</SearchProvider>
	)
}

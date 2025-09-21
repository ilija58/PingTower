import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AddService } from './pages/AddService/AddService'
import { Auth } from './pages/Auth/Auth'
import { Home } from './pages/Home/Home'
import { ROUTES } from './routes'
import { useAuthStore } from './store/authStore'
import { useUserStore } from './store/userStore'
import { Layout } from './widgets/Layout/Layout'
import { ProtectedRoute } from './widgets/ProtectedRoute/ProtectedRoute'
import { Service } from '@/pages/Service/Service'

function App() {
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)
	const fetchServices = useUserStore(state => state.fetchSites)

	useEffect(() => {
		if (isAuthenticated) {
			fetchServices()
		}
	}, [isAuthenticated, fetchServices])

	return (
		<BrowserRouter>
			<Routes>
				{/* Public route for authentication */}
				<Route path={ROUTES.auth.path} element={<Auth />} />

				{/* Protected routes */}
				<Route element={<ProtectedRoute />}>
					<Route element={<Layout />}>
						<Route path={ROUTES.home.path} element={<Home />} />
						<Route path={ROUTES.service.path} element={<Service />} />
						<Route path={ROUTES.addService.path} element={<AddService />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App

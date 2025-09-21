import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute() {
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)

	if (!isAuthenticated) {
		// User is not authenticated, redirect to login page
		return <Navigate to="/auth" />
	}

	// User is authenticated, render the child routes
	return <Outlet />
}

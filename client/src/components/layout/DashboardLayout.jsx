import { Outlet } from 'react-router-dom'
import ProtectedRoute from '../../pages/ProtectedRoute'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function DashboardLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-surface">
        <Sidebar />
        <Navbar />
        <main className="md:ml-60 pt-16 md:pt-0 min-h-screen">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from '../../pages/ProtectedRoute'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { PageEnter } from '../ui/motion'

export default function DashboardLayout() {
  const location = useLocation()

  return (
    <ProtectedRoute>
      <div className="min-h-screen app-bg">
        <Sidebar />
        <Navbar />
        <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
          <div className="p-4 md:p-8 max-w-7xl mx-auto bg bg-blue-50">
            <AnimatePresence mode="wait">
              <PageEnter key={location.pathname}>
                <Outlet />
              </PageEnter>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

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
      <div className="min-h-screen bg-surface">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        </div>
        <Sidebar />
        <Navbar />
        <main className="md:ml-60 pt-16 md:pt-0 min-h-screen relative">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
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

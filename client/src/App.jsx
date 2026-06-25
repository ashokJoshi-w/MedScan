import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import DashboardLayout from './components/layout/DashboardLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Prescription from './pages/Prescription'
import Reports from './pages/Reports'
import UploadReport from './pages/UploadReport'
import Vitals from './pages/Vitals'
import HealthInsights from './pages/HealthInsights'
import History from './pages/History'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/upload-report" element={<UploadReport />} />
            <Route path="/prescription" element={<Prescription />} />
            <Route path="/lab-reports" element={<Navigate to="/upload-report" replace />} />
            <Route path="/vitals" element={<Vitals />} />
            <Route path="/health-insights" element={<HealthInsights />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

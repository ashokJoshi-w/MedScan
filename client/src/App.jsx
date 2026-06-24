import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import DashboardLayout from './components/layout/DashboardLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Prescription from './pages/Prescription'
import LabReports from './pages/LabReports'
import Vitals from './pages/Vitals'
import History from './pages/History'

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
            <Route path="/prescription" element={<Prescription />} />
            <Route path="/lab-reports" element={<LabReports />} />
            <Route path="/vitals" element={<Vitals />} />
            <Route path="/history" element={<History />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

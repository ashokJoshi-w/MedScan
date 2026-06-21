import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './pages/ProtectedRoute'
import AuthPage from './pages/AuthPage'

import Header from './components/layout/Header'
import TabNav from './components/layout/TabNav'
import PrescriptionTab from './components/tabs/PrescriptionTab'
import LabTab from './components/tabs/LabTab'
import VitalsTab from './components/tabs/VitalsTab'
import HistoryTab from './components/tabs/HistoryTab'

const tabs = {
  prescription: <PrescriptionTab />,
  lab: <LabTab />,
  vitals: <VitalsTab />,
  history: <HistoryTab />,
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('prescription')
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <TabNav active={activeTab} setActive={setActiveTab} />
        <div>{tabs[activeTab]}</div>
      </main>
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

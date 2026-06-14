import { useState } from 'react'
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

const App = () => {
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

export default App
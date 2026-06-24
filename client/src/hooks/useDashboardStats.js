import { useMemo, useState, useEffect } from 'react'
import useHistory from './useHistory'

export const VITALS_KEY = 'medscan_vitals_log'

function parseEntryDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? null : d
}

function getTrend(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

function countByType(items, type) {
  return items.filter((h) => h.type === type).length
}

export default function useDashboardStats() {
  const { history } = useHistory()
  const [vitalsCount, setVitalsCount] = useState(0)

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem(VITALS_KEY)
        setVitalsCount(saved ? JSON.parse(saved).length : 0)
      } catch {
        setVitalsCount(0)
      }
    }
    load()
    window.addEventListener('storage', load)
    window.addEventListener('medscan-vitals-update', load)
    return () => {
      window.removeEventListener('storage', load)
      window.removeEventListener('medscan-vitals-update', load)
    }
  }, [])

  return useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 86400000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000)

    const inRange = (start, end) =>
      history.filter((h) => {
        const d = parseEntryDate(h.date)
        return d && d >= start && d < end
      })

    const thisWeek = inRange(weekAgo, now)
    const lastWeek = inRange(twoWeeksAgo, weekAgo)

    const prescriptions = countByType(history, 'prescription')
    const labReports = countByType(history, 'lab')
    const vitalsFromHistory = countByType(history, 'vitals')
    const vitalsLogged = Math.max(vitalsCount, vitalsFromHistory)

    return {
      total: history.length,
      prescriptions,
      labReports,
      vitalsLogged,
      recentActivity: history.slice(0, 5).map((item, index) => ({
        id: item.id ?? index,
        type: item.type || 'prescription',
        title: item.title || item.summary || 'Analysis record',
        date: item.date,
        status: item.status || 'normal',
      })),
      trends: {
        total: getTrend(thisWeek.length, lastWeek.length),
        prescriptions: getTrend(countByType(thisWeek, 'prescription'), countByType(lastWeek, 'prescription')),
        labReports: getTrend(countByType(thisWeek, 'lab'), countByType(lastWeek, 'lab')),
        vitals: getTrend(countByType(thisWeek, 'vitals'), countByType(lastWeek, 'vitals')),
      },
    }
  }, [history, vitalsCount])
}

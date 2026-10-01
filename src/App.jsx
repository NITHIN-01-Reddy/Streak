import { useEffect } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useStore } from './store'
import Today from './pages/Today.jsx'
import Habits from './pages/Habits.jsx'
import Stats from './pages/Stats.jsx'
import Settings from './pages/Settings.jsx'

const tabs = [
  { to: '/', label: 'Today', icon: '☀️' },
  { to: '/habits', label: 'Habits', icon: '📋' },
  { to: '/stats', label: 'Stats', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' }
]

export default function App() {
  const dark = useStore((s) => s.dark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className="mx-auto min-h-screen max-w-md pb-24">
      <main className="px-4 pt-6">
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-indigo-100 bg-white/90 backdrop-blur dark:border-indigo-950 dark:bg-[#161433]/90"
           style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {tabs.map((t) => (
            <li key={t.to}>
              <NavLink
                to={t.to}
                end
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-2 text-xs font-medium ${
                    isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400'
                  }`
                }
              >
                <span className="text-xl">{t.icon}</span>
                {t.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

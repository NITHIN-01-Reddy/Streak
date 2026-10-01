import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useStore } from '../store'
import { useStepCounter } from '../hooks/useStepCounter'
import { dateKey, daysAgo } from '../utils'

const card = 'rounded-2xl bg-white p-4 shadow-sm dark:bg-[#1b1940]'

export default function Steps() {
  const { logs, stepGoal, setStepGoal, addSteps } = useStore()
  const { active, error, start, stop } = useStepCounter()
  const [manual, setManual] = useState('')

  const steps = logs[dateKey()]?.steps || 0
  const pct = Math.min(steps / stepGoal, 1)
  const km = ((steps * 0.762) / 1000).toFixed(2) // ~76 cm average stride
  const kcal = Math.round(steps * 0.04)

  const R = 80
  const C = 2 * Math.PI * R

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = daysAgo(6 - i)
    return { day: d.toLocaleDateString(undefined, { weekday: 'short' }), steps: logs[dateKey(d)]?.steps || 0 }
  })

  const addManual = () => {
    const n = parseInt(manual, 10)
    if (n > 0) addSteps(dateKey(), n)
    setManual('')
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Steps</h1>

      <section className={`${card} flex flex-col items-center`}>
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
            <circle cx="100" cy="100" r={R} fill="none" strokeWidth="14" className="stroke-indigo-100 dark:stroke-indigo-950" />
            <circle
              cx="100" cy="100" r={R} fill="none" strokeWidth="14" strokeLinecap="round"
              className="stroke-indigo-600 transition-all duration-500"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-4xl font-bold">{steps.toLocaleString()}</p>
              <p className="text-sm text-slate-500 dark:text-indigo-300">of {stepGoal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-8 text-center">
          <div><p className="text-xl font-semibold">{km}</p><p className="text-xs text-slate-500">km</p></div>
          <div><p className="text-xl font-semibold">{kcal}</p><p className="text-xs text-slate-500">kcal</p></div>
        </div>

        <button
          onClick={active ? stop : start}
          className={`mt-4 w-full rounded-xl py-3 font-semibold text-white active:scale-95 ${active ? 'bg-rose-500' : 'bg-indigo-600'}`}
        >
          {active ? 'Stop tracking' : 'Start tracking'}
        </button>
        {active && (
          <p className="mt-2 text-center text-xs text-slate-500">
            Tracking. Keep the app open with the screen on, and carry your phone in a pocket.
          </p>
        )}
        {error && <p className="mt-2 text-center text-sm text-rose-500">{error}</p>}
      </section>

      <section className={card}>
        <h2 className="mb-2 font-semibold">Last 7 days</h2>
        <div className="h-40">
          <ResponsiveContainer>
            <BarChart data={week}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis hide domain={[0, Math.max(stepGoal, ...week.map((w) => w.steps))]} />
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Bar dataKey="steps" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={`${card} space-y-3`}>
        <label className="flex items-center justify-between gap-3">
          <span className="font-medium">Daily goal</span>
          <input
            type="number" min="1000" step="500" value={stepGoal}
            onChange={(e) => setStepGoal(Math.max(1000, Number(e.target.value) || 8000))}
            className="w-28 rounded-xl border border-indigo-100 bg-transparent px-3 py-2 text-right outline-none focus:border-indigo-500 dark:border-indigo-900"
          />
        </label>
        <div className="flex gap-2">
          <input
            type="number" min="1" value={manual} onChange={(e) => setManual(e.target.value)}
            placeholder="Add steps manually"
            className="min-w-0 flex-1 rounded-xl border border-indigo-100 bg-transparent px-3 py-2 outline-none focus:border-indigo-500 dark:border-indigo-900"
          />
          <button onClick={addManual} className="rounded-xl bg-indigo-600 px-4 font-semibold text-white active:scale-95">Add</button>
        </div>
      </section>
    </div>
  )
}
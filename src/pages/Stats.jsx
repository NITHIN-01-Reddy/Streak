import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useStore } from '../store'
import { completionFor, dateKey, daysAgo } from '../utils'

export default function Stats() {
  const { habits, logs } = useStore()

  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = daysAgo(13 - i)
    return { day: d.getDate(), pct: completionFor(dateKey(d), habits, logs) }
  })

  const last28 = Array.from({ length: 28 }, (_, i) => {
    const key = dateKey(daysAgo(27 - i))
    return { key, pct: completionFor(key, habits, logs) }
  })

  const shade = (p) =>
    p === 0 ? 'bg-indigo-100 dark:bg-indigo-950'
    : p < 50 ? 'bg-indigo-300'
    : p < 100 ? 'bg-indigo-500'
    : 'bg-indigo-700'

  const moodDays = Object.values(logs).filter((l) => l.mood)
  const avgMood = moodDays.length ? (moodDays.reduce((a, l) => a + l.mood, 0) / moodDays.length).toFixed(1) : '–'

  const card = 'rounded-2xl bg-white p-4 shadow-sm dark:bg-[#1b1940]'

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Stats</h1>

      <section className={card}>
        <h2 className="mb-2 font-semibold">Last 14 days</h2>
        <div className="h-44">
          <ResponsiveContainer>
            <BarChart data={last14}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip formatter={(v) => `${v}%`} labelFormatter={(l) => `Day ${l}`} />
              <Bar dataKey="pct" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={card}>
        <h2 className="mb-3 font-semibold">Last 4 weeks</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {last28.map((d) => (
            <div key={d.key} title={`${d.key}: ${d.pct}%`} className={`aspect-square rounded-md ${shade(d.pct)}`} />
          ))}
        </div>
      </section>

      <section className={card}>
        <h2 className="font-semibold">Average mood</h2>
        <p className="text-3xl font-bold">{avgMood} <span className="text-base font-normal text-slate-500">/ 5</span></p>
      </section>
    </div>
  )
}

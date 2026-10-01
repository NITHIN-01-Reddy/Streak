import { useStore } from '../store'
import { dateKey, streakFor, completionFor } from '../utils'
import { Link } from 'react-router-dom'

const moods = ['😞', '😕', '😐', '🙂', '😄']
const card = 'rounded-2xl bg-white p-4 shadow-sm dark:bg-[#1b1940]'

export default function Today() {
  const { habits, logs, toggleHabit, setDay } = useStore()
  const key = dateKey()
  const day = logs[key] || { done: [], mood: null, note: '' }
  const pct = completionFor(key, habits, logs)

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-slate-500 dark:text-indigo-300">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-bold">{pct}% done today</h1>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-950">
          <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </header>

      {habits.length === 0 ? (
        <div className={card}>
          <p>No habits yet.</p>
          <Link to="/habits" className="mt-1 inline-block font-semibold text-indigo-600 dark:text-indigo-300">
            Add your first habit
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {habits.map((h) => {
            const done = day.done.includes(h.id)
            const streak = streakFor(h.id, logs)
            return (
              <li key={h.id}>
                <button
                  onClick={() => {
                    toggleHabit(key, h.id)
                    navigator.vibrate?.(15)
                  }}
                  className={`${card} flex w-full items-center gap-3 text-left transition active:scale-[0.98] ${
                    done ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  aria-pressed={done}
                >
                  <span className="text-2xl">{h.emoji}</span>
                  <span className={`flex-1 font-medium ${done ? 'line-through opacity-60' : ''}`}>{h.name}</span>
                  <span className="text-sm text-slate-500 dark:text-indigo-300">🔥 {streak}</span>
                  <span className={`grid h-7 w-7 place-items-center rounded-full border-2 text-sm ${
                    done ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                  }`}>
                    {done && '✓'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <section className={card}>
        <h2 className="mb-2 font-semibold">How are you feeling?</h2>
        <div className="flex justify-between">
          {moods.map((m, i) => (
            <button
              key={m}
              onClick={() => setDay(key, { mood: i + 1 })}
              className={`rounded-xl p-2 text-3xl transition ${day.mood === i + 1 ? 'bg-indigo-100 dark:bg-indigo-900' : 'opacity-50'}`}
              aria-label={`Mood ${i + 1} of 5`}
            >
              {m}
            </button>
          ))}
        </div>
        <input
          value={day.note}
          maxLength={140}
          onChange={(e) => setDay(key, { note: e.target.value })}
          placeholder="One line about today"
          className="mt-3 w-full rounded-xl border border-indigo-100 bg-transparent px-3 py-2 outline-none focus:border-indigo-500 dark:border-indigo-900"
        />
      </section>
    </div>
  )
}

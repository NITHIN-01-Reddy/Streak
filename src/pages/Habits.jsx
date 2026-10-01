import { useState } from 'react'
import { useStore } from '../store'

export default function Habits() {
  const { habits, addHabit, deleteHabit } = useStore()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('')
  const [autoSteps, setAutoSteps] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    addHabit(name.trim(), emoji.trim(), parseInt(autoSteps, 10) || 0)
    setName('')
    setEmoji('')
    setAutoSteps('')
  }

  const input = 'rounded-xl border border-indigo-100 bg-transparent px-3 py-2 outline-none focus:border-indigo-500 dark:border-indigo-900'

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Habits</h1>

      <form onSubmit={submit} className="space-y-2">
        <div className="flex gap-2">
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🙂" maxLength={2} className={`${input} w-14 text-center`} aria-label="Emoji" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New habit" className={`${input} min-w-0 flex-1`} />
          <button className="rounded-xl bg-indigo-600 px-4 font-semibold text-white active:scale-95">Add</button>
        </div>
        <input
          type="number" min="0" value={autoSteps} onChange={(e) => setAutoSteps(e.target.value)}
          placeholder="Optional: auto-complete at this many steps (e.g. 8000)"
          className={`${input} w-full text-sm`}
        />
      </form>

      <ul className="space-y-2">
        {habits.map((h) => (
          <li key={h.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-[#1b1940]">
            <span className="text-2xl">{h.emoji}</span>
            <div className="flex-1">
              <p className="font-medium">{h.name}</p>
              {h.autoSteps && <p className="text-xs text-slate-500">👟 Completes at {h.autoSteps.toLocaleString()} steps</p>}
            </div>
            <button onClick={() => confirm(`Delete "${h.name}"?`) && deleteHabit(h.id)} className="text-sm font-medium text-rose-500">
              Delete
            </button>
          </li>
        ))}
        {habits.length === 0 && <p className="text-slate-500">Add a habit above to get started.</p>}
      </ul>
    </div>
  )
}
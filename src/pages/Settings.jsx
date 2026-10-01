import { useRef } from 'react'
import { useStore } from '../store'
import { dateKey } from '../utils'

export default function Settings() {
  const { habits, logs, dark, toggleDark, importData } = useStore()
  const fileRef = useRef()

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ habits, logs }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `streak-backup-${dateKey()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importJson = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (!Array.isArray(data.habits) || typeof data.logs !== 'object') throw new Error()
      if (confirm('Replace current data with this backup?')) importData(data)
    } catch {
      alert('That file is not a valid Streak backup.')
    }
    e.target.value = ''
  }

  const row = 'flex w-full items-center justify-between rounded-2xl bg-white p-4 text-left shadow-sm dark:bg-[#1b1940]'

  return (
    <div className="space-y-3">
      <h1 className="mb-2 text-3xl font-bold">Settings</h1>
      <button onClick={toggleDark} className={row}>
        <span>Dark mode</span>
        <span>{dark ? 'On' : 'Off'}</span>
      </button>
      <button onClick={exportJson} className={row}>Export backup</button>
      <button onClick={() => fileRef.current.click()} className={row}>Import backup</button>
      <input ref={fileRef} type="file" accept="application/json" onChange={importJson} className="hidden" />
      <p className="pt-2 text-sm text-slate-500">
        Your data is stored only on this device. Export a backup regularly.
      </p>
    </div>
  )
}

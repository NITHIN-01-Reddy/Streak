import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const emptyDay = { done: [], mood: null, note: '', steps: 0 }

export const useStore = create(
  persist(
    (set) => ({
      habits: [], // { id, name, emoji, autoSteps? }
      logs: {}, // { 'YYYY-MM-DD': { done: [habitId], mood, note, steps } }
      dark: false,
      stepGoal: 8000,

      addHabit: (name, emoji, autoSteps) =>
        set((s) => ({
          habits: [
            ...s.habits,
            { id: crypto.randomUUID(), name, emoji: emoji || '✅', ...(autoSteps ? { autoSteps } : {}) }
          ]
        })),

      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

      toggleHabit: (key, id) =>
        set((s) => {
          const day = s.logs[key] || emptyDay
          const done = day.done.includes(id) ? day.done.filter((x) => x !== id) : [...day.done, id]
          return { logs: { ...s.logs, [key]: { ...day, done } } }
        }),

      setDay: (key, patch) =>
        set((s) => ({ logs: { ...s.logs, [key]: { ...(s.logs[key] || emptyDay), ...patch } } })),

      // Adds steps and auto-completes any habit whose step target has been reached
      addSteps: (key, n) =>
        set((s) => {
          const day = s.logs[key] || emptyDay
          const steps = (day.steps || 0) + n
          let done = day.done
          s.habits.forEach((h) => {
            if (h.autoSteps && steps >= h.autoSteps && !done.includes(h.id)) done = [...done, h.id]
          })
          return { logs: { ...s.logs, [key]: { ...day, steps, done } } }
        }),

      setStepGoal: (g) => set({ stepGoal: g }),
      toggleDark: () => set((s) => ({ dark: !s.dark })),
      importData: (data) => set({ habits: data.habits || [], logs: data.logs || {} })
    }),
    { name: 'streak-data' }
  )
)
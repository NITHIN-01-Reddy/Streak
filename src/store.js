import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      habits: [],
      logs: {}, // { 'YYYY-MM-DD': { done: [habitId], mood: 1-5, note: '' } }
      dark: false,

      addHabit: (name, emoji) =>
        set((s) => ({ habits: [...s.habits, { id: crypto.randomUUID(), name, emoji: emoji || '✅' }] })),

      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

      toggleHabit: (key, id) =>
        set((s) => {
          const day = s.logs[key] || { done: [], mood: null, note: '' }
          const done = day.done.includes(id) ? day.done.filter((x) => x !== id) : [...day.done, id]
          return { logs: { ...s.logs, [key]: { ...day, done } } }
        }),

      setDay: (key, patch) =>
        set((s) => {
          const day = s.logs[key] || { done: [], mood: null, note: '' }
          return { logs: { ...s.logs, [key]: { ...day, ...patch } } }
        }),

      toggleDark: () => set((s) => ({ dark: !s.dark })),
      importData: (data) => set({ habits: data.habits || [], logs: data.logs || {} })
    }),
    { name: 'streak-data' } // localStorage key
  )
)

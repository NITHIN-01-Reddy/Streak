export const dateKey = (d = new Date()) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

export const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

// Consecutive days a habit was completed. Today not yet done doesn't break the streak.
export function streakFor(habitId, logs) {
  let streak = 0
  for (let i = 0; i < 3650; i++) {
    const done = logs[dateKey(daysAgo(i))]?.done?.includes(habitId)
    if (done) streak++
    else if (i === 0) continue
    else break
  }
  return streak
}

export const completionFor = (key, habits, logs) => {
  if (!habits.length) return 0
  const done = logs[key]?.done?.filter((id) => habits.some((h) => h.id === id)).length || 0
  return Math.round((done / habits.length) * 100)
}

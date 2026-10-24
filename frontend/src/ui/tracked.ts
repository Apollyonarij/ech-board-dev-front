import { createSignal, type Accessor } from 'solid-js'

export interface TrackedThread {
  uid: string
  forumId: string
  slug: string
  number: number
  title: string
  count: number
  seen: number
  addedAt: number
}

const KEY = 'ech-board-tracked'
const MAX_ITEMS = 50

function read(): TrackedThread[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as TrackedThread[]) : []
  } catch {
    return []
  }
}

let store: TrackedThread[] = read()
const [signal, setSignal] = createSignal(0)

function persist(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store.slice(0, MAX_ITEMS)))
  } catch {
    return
  }
  setSignal((n) => n + 1)
}

export function trackedThreads(): Accessor<TrackedThread[]> {
  return () => {
    signal()
    return store
  }
}

export function trackThread(thread: {
  uid: string
  forumId: string
  slug: string
  number: number
  title: string
  count: number
}): void {
  const existing = store.find((item) => item.uid === thread.uid)
  if (existing) {
    existing.title = thread.title
    existing.count = thread.count
    existing.seen = thread.count
    persist()
    return
  }
  store = [{ ...thread, seen: thread.count, addedAt: Date.now() }, ...store].slice(0, MAX_ITEMS)
  persist()
}

export function untrackThread(uid: string): void {
  const next = store.filter((item) => item.uid !== uid)
  if (next.length === store.length) return
  store = next
  persist()
}

export function clearTracked(): void {
  if (store.length === 0) return
  store = []
  persist()
}

export function markThreadSeen(uid: string, count: number): void {
  const item = store.find((entry) => entry.uid === uid)
  if (!item || (item.seen === count && item.count === count)) return
  item.seen = count
  item.count = count
  persist()
}

export function syncTracked(entries: { uid: string; title: string; count: number }[]): void {
  let changed = false
  for (const entry of entries) {
    const item = store.find((tracked) => tracked.uid === entry.uid)
    if (!item) continue
    if (item.count !== entry.count) {
      item.count = entry.count
      changed = true
    }
    if (item.title !== entry.title) {
      item.title = entry.title
      changed = true
    }
  }
  if (changed) persist()
}

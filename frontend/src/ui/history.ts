import { createSignal, type Accessor } from 'solid-js'

export interface HistoryEntry {
  uid: string
  forumId: string
  slug: string
  number: number
  title: string
  at: number
}

const KEY = 'ech-board-history'
const MAX_ITEMS = 30

function read(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : []
  } catch {
    return []
  }
}

let store: HistoryEntry[] = read()
const [signal, setSignal] = createSignal(0)

function persist(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store.slice(0, MAX_ITEMS)))
  } catch {
    return
  }
  setSignal((n) => n + 1)
}

export function historyEntries(): Accessor<HistoryEntry[]> {
  return () => {
    signal()
    return store
  }
}

export function pushHistory(entry: Omit<HistoryEntry, 'at'>): void {
  const at = Date.now()
  const rest = store.filter((item) => item.uid !== entry.uid)
  store = [{ ...entry, at }, ...rest].slice(0, MAX_ITEMS)
  persist()
}

export function updateHistoryTitle(uid: string, title: string): void {
  const item = store.find((entry) => entry.uid === uid)
  if (!item || item.title === title) return
  item.title = title
  persist()
}

export function clearHistory(): void {
  if (store.length === 0) return
  store = []
  persist()
}

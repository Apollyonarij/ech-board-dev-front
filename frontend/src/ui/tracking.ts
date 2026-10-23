import { untrack } from 'solid-js'
import type { ForumStore } from '../store/store'
import { trackThread, markThreadSeen, syncTracked } from './tracked'
import { historyEntries, pushHistory, updateHistoryTitle } from './history'

export interface ThreadContext {
  forumId: string
  slug: string
  number: number
}

/**
 * Тред попадает в «Отслеживаемое», когда пользователь написал в него пост
 * (включая создание треда). Ищем наши посты среди загруженных записей.
 */
export function trackAuthoredThreads(store: ForumStore, ctx: ThreadContext): void {
  const threadUid = store.threadUid()
  if (threadUid) {
    const posts = store.postsOf(true)
    if (!posts.some((uid) => store.get(uid)?.mine)) return
    trackThread({
      uid: threadUid,
      forumId: ctx.forumId,
      slug: ctx.slug,
      number: ctx.number,
      title: store.threadTitle(),
      count: posts.length,
    })
    return
  }

  for (const row of store.rowsOf(true)) {
    const uids = [row.opUid, ...row.replyUids].filter((uid): uid is string => !!uid)
    if (!uids.some((uid) => store.get(uid)?.mine)) continue
    trackThread({
      uid: row.uid,
      forumId: ctx.forumId,
      slug: ctx.slug,
      number: row.number,
      title: row.topic || row.title,
      count: row.count,
    })
  }
}

/** Подтягиваем счётчики и заголовки отслеживаемых/посещённых тредов из ленты доски. */
export function syncThreadLists(store: ForumStore): void {
  const rows = store.rowsOf(true)
  if (rows.length === 0) return
  syncTracked(rows.map((row) => ({ uid: row.uid, title: row.topic || row.title, count: row.count })))
  const titles = new Map(rows.map((row) => [row.uid, row.topic || row.title] as const))
  for (const item of untrack(historyEntries())) {
    const title = titles.get(item.uid)
    if (title && title !== item.title) updateHistoryTitle(item.uid, title)
  }
}

/** Запись визита на страницу треда + отметка прочитанного. */
export function recordThreadVisit(store: ForumStore, ctx: ThreadContext): void {
  const uid = store.threadUid()
  if (!uid) return
  const count = store.postsOf(true).length
  pushHistory({ uid, forumId: ctx.forumId, slug: ctx.slug, number: ctx.number, title: store.threadTitle() })
  markThreadSeen(uid, count)
}

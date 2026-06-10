const hits = new Map<string, number[]>()

export function isRateLimited(
  key: string,
  limit = 10,
  windowMs = 5 * 60 * 1000
): boolean {
  const now = Date.now()
  const times = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  times.push(now)
  hits.set(key, times)
  return times.length > limit
}

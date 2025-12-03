// Simple in-memory cache
// For production, consider using Redis or Vercel KV

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cacheStore = new Map<string, CacheEntry<any>>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cacheStore.entries()) {
    if (entry.expiresAt < now) {
      cacheStore.delete(key);
    }
  }
}, 60 * 1000);

export function getCache<T>(key: string): T | null {
  const entry = cacheStore.get(key);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt < Date.now()) {
    cacheStore.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlSeconds: number = 60): void {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  cacheStore.set(key, {
    data,
    expiresAt,
  });
}

export function deleteCache(key: string): void {
  cacheStore.delete(key);
}

export function clearCache(pattern?: string): void {
  if (!pattern) {
    cacheStore.clear();
    return;
  }

  for (const key of cacheStore.keys()) {
    if (key.includes(pattern)) {
      cacheStore.delete(key);
    }
  }
}

// Helper to generate cache key from request
export function getCacheKey(pathname: string, searchParams?: URLSearchParams): string {
  const params = searchParams ? searchParams.toString() : '';
  return `cache:${pathname}${params ? `?${params}` : ''}`;
}


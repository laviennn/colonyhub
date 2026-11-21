type Bucket = { timestamps: number[] };

const globalStore = globalThis as unknown as {
  __colonyhubCcRateLimit?: Map<string, Bucket>;
};

function getStore(): Map<string, Bucket> {
  if (!globalStore.__colonyhubCcRateLimit) {
    globalStore.__colonyhubCcRateLimit = new Map();
  }
  return globalStore.__colonyhubCcRateLimit;
}

export function checkLoginRateLimit(
  key: string,
  options = { limit: 10, windowMs: 60_000 },
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const cutoff = now - options.windowMs;
  const store = getStore();
  const bucket = store.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => ts > cutoff);

  if (bucket.timestamps.length >= options.limit) {
    const oldest = bucket.timestamps[0] ?? now;
    store.set(key, bucket);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(Math.max(1000, oldest + options.windowMs - now) / 1000),
    };
  }

  bucket.timestamps.push(now);
  store.set(key, bucket);
  return { allowed: true, retryAfterSeconds: 0 };
}

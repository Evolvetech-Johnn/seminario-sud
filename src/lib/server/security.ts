type RateLimitConfig = {
  windowMs: number;
  max: number;
};

type Hit = { resetAt: number; count: number };

const buckets = new Map<string, Hit>();

function nowMs() {
  return Date.now();
}

function getClientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export function rateLimit(req: Request, scope: string, config: RateLimitConfig) {
  const ip = getClientIp(req);
  const key = `${scope}:${ip}`;
  const now = nowMs();
  const existing = buckets.get(key);
  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { resetAt: now + config.windowMs, count: 1 });
    return { ok: true as const };
  }
  if (existing.count >= config.max) {
    return { ok: false as const, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }
  existing.count += 1;
  buckets.set(key, existing);
  return { ok: true as const };
}

export function requireSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return { ok: true as const };
  const url = new URL(req.url);
  if (origin !== url.origin) {
    return { ok: false as const, error: "Origem inválida" };
  }
  return { ok: true as const };
}


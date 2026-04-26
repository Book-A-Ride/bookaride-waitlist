// This is a simple in-memory rate limiter for demo purposes.
// In production, use Upstash Redis or similar for serverless environments.

const cache = new Map<string, { count: number, expires: number }>();

export function rateLimit(ip: string) {
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');
    const max = parseInt(process.env.RATE_LIMIT_MAX || '10');

    const record = cache.get(ip);

    if (!record || now > record.expires) {
        cache.set(ip, { count: 1, expires: now + windowMs });
        return { success: true, remaining: max - 1 };
    }

    if (record.count >= max) {
        return { success: false, remaining: 0 };
    }

    record.count += 1;
    return { success: true, remaining: max - record.count };
}

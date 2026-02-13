import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a random fallback for development or when Redis is not configured
// This ensures the app doesn't crash, but rate limiting won't be stringent/shared.
// const ephemeralCache = new Map<string, number>();

export async function rateLimit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
        console.warn("Rate Limiting disabled: Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
        return { success: true, limit: 100, remaining: 99, reset: Date.now() + 10000 };
    }

    try {
        const redis = new Redis({
            url: redisUrl,
            token: redisToken,
        });

        // Create a new ratelimiter, that allows 10 requests per 10 seconds
        const ratelimit = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(10, "10 s"),
            analytics: true,
            prefix: "@upstash/ratelimit",
        });

        const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
        return { success, limit, reset, remaining };
    } catch (error) {
        console.error("Rate Limit Error:", error);
        // Fail open if Redis is down
        return { success: true, limit: 100, remaining: 99, reset: Date.now() + 10000 };
    }
}

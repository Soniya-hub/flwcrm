package com.flowcrm.service;

import com.flowcrm.exception.RateLimitException;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private static final int MAX_FAILURES = 5;
    private static final long BLOCK_DURATION_MS = 15 * 60 * 1000L;

    // key -> [failureCount, lastFailureTimestamp]
    private final ConcurrentHashMap<String, long[]> failedAttempts = new ConcurrentHashMap<>();

    public void checkLimit(String key) {
        long[] data = failedAttempts.get(key);
        if (data == null) return;

        long elapsed = System.currentTimeMillis() - data[1];
        if (elapsed >= BLOCK_DURATION_MS) {
            failedAttempts.remove(key);
            return;
        }
        if (data[0] >= MAX_FAILURES) {
            long remainingMinutes = (BLOCK_DURATION_MS - elapsed) / 60000 + 1;
            throw new RateLimitException(
                "Too many failed login attempts. Try again in " + remainingMinutes + " minute(s)."
            );
        }
    }

    public void recordFailure(String key) {
        failedAttempts.merge(key, new long[]{1, System.currentTimeMillis()}, (existing, ignored) -> {
            existing[0]++;
            existing[1] = System.currentTimeMillis();
            return existing;
        });
    }

    public void clearAttempts(String key) {
        failedAttempts.remove(key);
    }
}

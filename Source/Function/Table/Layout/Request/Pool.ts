/**
 * Process-level singleton token pool.
 *
 * Tokens are read once at module load from the TOKEN env var (comma-separated
 * GitHub PATs). The module is cached by Node's require/import machinery so the
 * same slots array is shared across every parallel build worker in the process.
 *
 * Rotation strategy: round-robin over the live (non-dead, non-exhausted) set.
 * Dead tokens (401) are skipped permanently for the lifetime of the build.
 * Exhausted tokens (403 / 429) are skipped until their x-ratelimit-reset time.
 * When the pool is empty next() returns undefined and the caller falls through
 * to unauthenticated mode (60 req/hr - sufficient for public repos).
 */

import { getSecret } from "astro:env/server";

type Slot = {
	/** Raw PAT string. */
	token: string;
	/** True after a 401 - token is invalid for the rest of this build. */
	dead: boolean;
	/** Unix-ms timestamp after which the token is usable again; 0 = ready. */
	exhaustedUntil: number;
	/** Number of HTTP requests we issued with this token this build. */
	requests: number;
	/** Last seen x-ratelimit-remaining (-1 = never seen). */
	lastRemaining: number;
	/** Last seen x-ratelimit-limit (-1 = never seen). */
	lastLimit: number;
	/** Last seen x-ratelimit-reset (Unix seconds, 0 = never seen). */
	lastReset: number;
};

/** Counter for unauthenticated requests (when pool is empty / exhausted). */
let anonymousRequests = 0;
let anonymousLastRemaining = -1;
let anonymousLastLimit = -1;
let anonymousLastReset = 0;

const slots: Slot[] = [];

let cursor = 0;

// Mirror live state onto globalThis so the astro:build:done hook (which
// runs after Vite's module runner has closed) can read it without a
// dynamic import of this module.
// biome-ignore lint/suspicious/noExplicitAny:
const Bag: any = globalThis as any;

const Sync = (): void => {
	Bag.__STATUS_POOL = { slots, anonymous: getAnonymous() };
};

const getAnonymous = () => ({
	requests: anonymousRequests,
	lastRemaining: anonymousLastRemaining,
	lastLimit: anonymousLastLimit,
	lastReset: anonymousLastReset,
});

// ---------------------------------------------------------------------------
// Initialise once
// ---------------------------------------------------------------------------

const raw: string = getSecret("TOKEN") ?? "";

for (const part of raw.split(",")) {
	const token = part.trim();

	// Reject empty strings and the schema placeholder default.
	if (token.length > 10 && !token.includes(" ")) {
		slots.push({
			token,
			dead: false,
			exhaustedUntil: 0,
			requests: 0,
			lastRemaining: -1,
			lastLimit: -1,
			lastReset: 0,
		});
	}
}

Sync();

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return the next available token, or undefined when every slot is
 * dead / exhausted.
 *
 * Safe to call concurrently - Node.js is single-threaded so the read-modify
 * on `cursor` is atomic with respect to the event loop.
 */
export const next = (): string | undefined => {
	const now = Date.now();

	const available = slots.filter((s) => !s.dead && s.exhaustedUntil <= now);

	if (available.length === 0) {
		return undefined;
	}

	const slot = available[cursor % available.length];

	cursor++;

	return slot.token;
};

/**
 * Permanently disable a token for this build (e.g. after a 401).
 */
export const markDead = (token: string): void => {
	const slot = slots.find((s) => s.token === token);

	if (slot) {
		slot.dead = true;
	}
};

/**
 * Temporarily disable a token until GitHub's rate-limit window resets.
 *
 * @param token     The PAT that was rate-limited.
 * @param resetAt   Value of the x-ratelimit-reset header (Unix **seconds**).
 *                  Pass Math.floor(Date.now()/1000) + retryAfter when only
 *                  the Retry-After header (seconds delta) is available.
 */
export const markExhausted = (token: string, resetAt: number): void => {
	const slot = slots.find((s) => s.token === token);

	if (slot) {
		// +5 000 ms buffer so we don't race the reset boundary.
		slot.exhaustedUntil = resetAt * 1_000 + 5_000;
	}
};

/** Total number of slots (including dead / exhausted) - used to cap retries. */
export const size = (): number => slots.length;

/**
 * Record a request issued with `token` and update its rate-limit snapshot
 * from the response headers. Pass `undefined` for the unauthenticated bucket.
 */
export const record = (
	token: string | undefined,

	// biome-ignore lint/suspicious/noExplicitAny:
	headers: Record<string, any> | undefined,
): void => {
	const remaining = Number(headers?.["x-ratelimit-remaining"] ?? -1);

	const limit = Number(headers?.["x-ratelimit-limit"] ?? -1);

	const reset = Number(headers?.["x-ratelimit-reset"] ?? 0);

	if (token === undefined) {
		anonymousRequests++;

		if (Number.isFinite(remaining) && remaining >= 0) {
			anonymousLastRemaining = remaining;
		}

		if (Number.isFinite(limit) && limit > 0) {
			anonymousLastLimit = limit;
		}

		if (Number.isFinite(reset) && reset > 0) {
			anonymousLastReset = reset;
		}

		Sync();

		return;
	}

	const slot = slots.find((s) => s.token === token);

	if (!slot) {
		return;
	}

	slot.requests++;

	if (Number.isFinite(remaining) && remaining >= 0) {
		slot.lastRemaining = remaining;
	}

	if (Number.isFinite(limit) && limit > 0) {
		slot.lastLimit = limit;
	}

	if (Number.isFinite(reset) && reset > 0) {
		slot.lastReset = reset;
	}

	Sync();
};

/**
 * Snapshot of the pool state for end-of-build reporting.
 */
export const report = (): {
	slots: {
		mask: string;
		dead: boolean;
		exhausted: boolean;
		requests: number;
		used: number;
		limit: number;
		remaining: number;
		resetInSeconds: number;
	}[];

	anonymous: {
		requests: number;
		used: number;
		limit: number;
		remaining: number;
		resetInSeconds: number;
	};
} => {
	const now = Date.now();

	const Mask = (token: string): string =>
		token.length <= 10
			? token
			: `${token.slice(0, 4)}...${token.slice(-4)}`;

	return {
		slots: slots.map((s) => ({
			mask: Mask(s.token),
			dead: s.dead,
			exhausted: !s.dead && s.exhaustedUntil > now,
			requests: s.requests,
			used:
				s.lastLimit > 0 && s.lastRemaining >= 0
					? s.lastLimit - s.lastRemaining
					: -1,
			limit: s.lastLimit,
			remaining: s.lastRemaining,
			resetInSeconds:
				s.lastReset > 0
					? Math.max(0, s.lastReset - Math.floor(now / 1_000))
					: -1,
		})),

		anonymous: {
			requests: anonymousRequests,
			used:
				anonymousLastLimit > 0 && anonymousLastRemaining >= 0
					? anonymousLastLimit - anonymousLastRemaining
					: -1,
			limit: anonymousLastLimit,
			remaining: anonymousLastRemaining,
			resetInSeconds:
				anonymousLastReset > 0
					? Math.max(0, anonymousLastReset - Math.floor(now / 1_000))
					: -1,
		},
	};
};

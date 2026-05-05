/**
 * Process-level singleton token pool.
 *
 * Tokens are read once at module load from the TOKENS env var (comma-separated
 * GitHub PATs). The module is cached by Node's require/import machinery so the
 * same slots array is shared across every parallel build worker in the process.
 *
 * Rotation strategy: round-robin over the live (non-dead, non-exhausted) set.
 * Dead tokens (401) are skipped permanently for the lifetime of the build.
 * Exhausted tokens (403 / 429) are skipped until their x-ratelimit-reset time.
 * When the pool is empty next() returns undefined and the caller falls through
 * to unauthenticated mode (60 req/hr — sufficient for public repos).
 */

import { getSecret } from "astro:env/server";

type Slot = {
	/** Raw PAT string. */
	token: string;
	/** True after a 401 — token is invalid for the rest of this build. */
	dead: boolean;
	/** Unix-ms timestamp after which the token is usable again; 0 = ready. */
	exhaustedUntil: number;
};

const slots: Slot[] = [];

let cursor = 0;

// ---------------------------------------------------------------------------
// Initialise once
// ---------------------------------------------------------------------------

const raw: string = getSecret("TOKENS") ?? "";

for (const part of raw.split(",")) {
	const token = part.trim();

	// Reject empty strings and the schema placeholder default.
	if (token.length > 10 && !token.includes(" ")) {
		slots.push({ token, dead: false, exhaustedUntil: 0 });
	}
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return the next available token, or undefined when every slot is
 * dead / exhausted.
 *
 * Safe to call concurrently — Node.js is single-threaded so the read-modify
 * on `cursor` is atomic with respect to the event loop.
 */
export const next = (): string | undefined => {
	const now = Date.now();

	const available = slots.filter(
		(s) => !s.dead && s.exhaustedUntil <= now,
	);

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

/** Total number of slots (including dead / exhausted) — used to cap retries. */
export const size = (): number => slots.length;

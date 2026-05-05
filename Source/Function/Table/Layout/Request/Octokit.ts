import type { Endpoints, RequestParameters, Route } from "@octokit/types";

import * as pool from "./Pool.js";

export type PARAMETER<R extends Route = Route> = [
	keyof Endpoints | R,
	R extends keyof Endpoints
		? Endpoints[R]["parameters"] & RequestParameters
		: RequestParameters,
];

// biome-ignore lint/suspicious/noExplicitAny:
export default async function OctokitRequest(
	...[REQUEST, OPTION, _retryCount]: [...PARAMETER, number?]
	// biome-ignore lint/suspicious/noExplicitAny:
): Promise<undefined | any> {
	const retryCount = _retryCount ?? 0;

	const token = pool.next(); // undefined → unauthenticated

	try {
		const { Octokit } = await import("@octokit/rest");

		return (
			await new Octokit({ auth: token }).request(REQUEST, OPTION)
		)?.data;
	} catch (_Error: any) {
		const status: number | undefined = _Error?.status;

		const headers = _Error?.response?.headers ?? {};

		// --- classify the failure and penalise the slot ---

		if (status === 401 && token) {
			// Invalid or revoked token — skip permanently this build.
			pool.markDead(token);
		} else if ((status === 403 || status === 429) && token) {
			const reset = Number(headers["x-ratelimit-reset"]);

			const retryAfter = Number(headers["retry-after"]);

			if (reset > 0) {
				// Primary rate limit — reset is an absolute Unix timestamp.
				pool.markExhausted(token, reset);
			} else if (retryAfter > 0) {
				// Secondary rate limit — reset is a relative seconds delta.
				pool.markExhausted(
					token,
					Math.floor(Date.now() / 1_000) + retryAfter,
				);
			}
			// Scope / access 403 (no rate-limit headers) — don't penalise.
		}

		// --- retry with the next available token if one exists ---

		const nextToken = pool.next();

		const shouldRetry =
			retryCount < pool.size() &&
			(status === 401 || status === 403 || status === 429) &&
			nextToken !== token; // a different token is available

		if (shouldRetry) {
			return OctokitRequest(REQUEST, OPTION, retryCount + 1);
		}

		console.log(_Error);
	}

	return undefined;
}

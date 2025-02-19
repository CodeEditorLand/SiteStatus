import type { Endpoints, RequestParameters, Route } from "@octokit/types";
import type { TOKEN_GITHUB_COMMIT } from "astro:env/server";

export default async <R extends Route>(
	...[REQUEST, OPTION]: [
		keyof Endpoints | R,
		R extends keyof Endpoints
			? Endpoints[R]["parameters"] & RequestParameters
			: RequestParameters,
	]
) => {
	try {
		return (
			await new (await import("@octokit/rest")).Octokit({
				auth: (await import("astro:env/server")).getSecret(
					"TOKEN_GITHUB_COMMIT",
				) as typeof TOKEN_GITHUB_COMMIT,
			}).request(REQUEST, OPTION)
		).data;
	} catch (_Error) {
		console.error(`Cannot ${REQUEST} with ${OPTION}`, _Error);

		throw _Error;
	}
};

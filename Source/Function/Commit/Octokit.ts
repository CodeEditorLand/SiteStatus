import type { Endpoints, RequestParameters, Route } from "@octokit/types";
import type { TOKEN_GITHUB_COMMIT_STATUS_EDITOR_LAND } from "astro:env/server";

export type Parameter<R extends Route = Route> = [
	keyof Endpoints | R,
	R extends keyof Endpoints
		? Endpoints[R]["parameters"] & RequestParameters
		: RequestParameters,
];

export default async (...[REQUEST, OPTION]: Parameter) => {
	try {
		return (
			await new (await import("@octokit/rest")).Octokit({
				auth: (await import("astro:env/server")).getSecret(
					"TOKEN_GITHUB_COMMIT_STATUS_EDITOR_LAND",
				) as typeof TOKEN_GITHUB_COMMIT_STATUS_EDITOR_LAND,
			}).request(REQUEST, OPTION)
		).data;
	} catch (_Error) {
		console.error(`Cannot ${REQUEST} with ${OPTION}`, _Error);

		throw _Error;
	}
};

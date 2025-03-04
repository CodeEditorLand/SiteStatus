import type { Endpoints, RequestParameters, Route } from "@octokit/types";
import type { TOKEN_GITHUB_TABLE_STATUS_CODE_EDITOR_LAND_WEBSITE } from "astro:env/server";

export type PARAMETER<R extends Route = Route> = [
	keyof Endpoints | R,
	R extends keyof Endpoints
		? Endpoints[R]["parameters"] & RequestParameters
		: RequestParameters,
];

export default async (
	...[REQUEST, OPTION]: PARAMETER
	// biome-ignore lint/suspicious/noExplicitAny:
): Promise<undefined | any> => {
	try {
		return (
			await new (await import("@octokit/rest")).Octokit({
				auth: (await import("astro:env/server")).getSecret(
					"TOKEN_GITHUB_TABLE_STATUS_CODE_EDITOR_LAND_WEBSITE",
				) as typeof TOKEN_GITHUB_TABLE_STATUS_CODE_EDITOR_LAND_WEBSITE,
			}).request(REQUEST, OPTION)
		)?.data;
	} catch (_Error) {
		console.log(_Error);
	}

	return undefined;
};

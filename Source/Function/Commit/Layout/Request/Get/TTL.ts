import type { Parameter } from "@Function/Commit/Layout/Request/Octokit.js";

export const MIN_30 = 30 * 60 * 1000;

export const HOUR_24 = 24 * 60 * 60 * 1000;

export default (...[Parameter]: [Parameter]) => {
	const Option = Parameter[1] || {};

	// If this is a commit list request:
	if (Parameter[0] === "GET /repos/{owner}/{repo}/commits") {
		// Use a shorter TTL for the first page and a longer one for other pages.
		return Option["page"] === 1 ? MIN_30 : HOUR_24;
	}

	if (Parameter[0] === "GET /repos/{owner}/{repo}/commits/{ref}") {
		// Assuming options.commitDate holds the commit's creation date:
		// if (
		// 	Option["commitDate"] &&
		// 	Date.now() - new Date(Option["commitDate"]).getTime() <
		// 		HOUR_24
		// ) {
		// 	return MIN_30;
		// }

		return HOUR_24;
	}

	if (Parameter[0] === "GET /repos/{owner}/{repo}/git/trees/{tree_sha}") {
		return HOUR_24;
	}

	return MIN_30;
};

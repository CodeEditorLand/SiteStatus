import type { PARAMETER } from "@Function/Table/Layout/Request/Octokit.js";

export const MIN_30 = 30 * 60 * 1000;

export const WEEK_1 = 7 * 24 * 60 * 60 * 1000;

export const HOUR_24 = 24 * 60 * 60 * 1000;

export default (...[Parameter]: [PARAMETER]): void => {
	const Option = Parameter[1] || {};

	if (Parameter[0] === "GET /repos/{owner}/{repo}/commits") {
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

		return WEEK_1;
	}

	if (Parameter[0] === "GET /repos/{owner}/{repo}/git/trees/{tree_sha}") {
		return WEEK_1;
	}

	return MIN_30;
};

import type { Parameter } from "@Function/Commit/Layout/Request/Octokit.js";

const { default: Get } = await import("@Function/Commit/Layout/Request/Get.js");

const { default: Set } = await import("@Function/Commit/Layout/Request/Set.js");

export default async (...Parameter: Parameter) => {
	const Hash = (await import("crypto"))
		.createHash("md5")
		.update(JSON.stringify(Parameter))
		.digest("hex");

	const TTL = await (
		await import("@Function/Commit/Layout/Request/Get/TTL.js")
	).default(Parameter);

	try {
		let Return =
			(await Get(`${Hash}`))?.Set ??
			// TODO: If request fails, force timestamp override and use cache
			(await (
				await import("@Function/Commit/Layout/Request/Octokit.js")
			).default(Parameter[0], Parameter[1]));

		await Set(`${Hash}`, Return);

		return Return;
	} catch (_Error) {
		console.log(_Error);

		return [];
	}
};

/*

import type { Parameter } from "@Function/Commit/Octokit.js";

const { default: Get } = await import("@Function/Commit/Cache/Set/Get/Fn.js");
const { default: Set } = await import("@Function/Commit/Cache/Set/Fn.js");
const { default: OctokitRequest } = await import("@Function/Commit/Octokit.js");
import { createHash } from "crypto";

export default async (...Parameter: Parameter) => {
  // Create a unique key based on the parameters
  const hash = createHash("md5")
    .update(JSON.stringify(Parameter))
    .digest("hex");

  // Determine the TTL based on the endpoint and data
  const TTL = determineTTL(Parameter);

  // Attempt to retrieve the cached object which includes a timestamp and data.
  let cached = await Get(hash);
  if (cached && (Date.now() - cached.timestamp < TTL)) {
    return cached.data;
  }

  // If no valid cache entry, perform the GitHub API request
  const data = await OctokitRequest(Parameter[0], Parameter[1]);

  // Cache the response along with a timestamp
  await Set(hash, { timestamp: Date.now(), data });

  return data;
};

*/

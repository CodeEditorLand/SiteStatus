import type { Parameter } from "@Function/Commit/Octokit.js";

const { default: Get } = await import("@Function/Commit/Cache/Set/Get/Fn.js");

const { default: Set } = await import("@Function/Commit/Cache/Set/Fn.js");


export default async (...Parameter: Parameter) => {
	const Hash = (await import("crypto"))
		.createHash("md5")
		.update(JSON.stringify(Parameter))
		.digest("hex");

	let Return =
		(await Get(`${Hash}`)) ??
		(await (
			await import("@Function/Commit/Octokit.js")
		).default(Parameter[0], Parameter[1]));

	await Set(`${Hash}`, Return);

	return Return;
};

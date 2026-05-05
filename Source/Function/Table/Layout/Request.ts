import type { PARAMETER } from "@Function/Table/Layout/Request/Octokit.js";

export const { default: Get } =
	await import("@Function/Table/Layout/Request/Get.js");

// biome-ignore lint/suspicious/noExplicitAny:
export type TRANSFORM = ((RESPONSE: any) => Promise<any>) & {
	/**
	 * Key should describe from what to what
	 *
	 */
	Key?: string;
};

export default async (
	...[REQUEST, OPTION, TRANSFORM]: [...PARAMETER, TRANSFORM?]
	// biome-ignore lint/suspicious/noExplicitAny:
): Promise<any> => {
	let RETURN = undefined;

	const Hash = (await import("node:crypto"))
		.createHash("md5")
		.update(
			JSON.stringify(
				[
					OPTION,
					TRANSFORM && typeof TRANSFORM.Key === "string"
						? TRANSFORM.Key
						: (TRANSFORM?.toString() ?? ""),
				],
				null,
				"\t",
			),
		)
		.digest("hex");

	// Build a human-readable label for the .jsonc cache file header so it is
	// self-documenting when opened in an editor.
	const optionParts = Object.entries(
		(OPTION ?? {}) as Record<string, unknown>,
	)
		.filter(([, v]) => v !== undefined)
		.map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`);

	const transformPart =
		TRANSFORM && typeof TRANSFORM.Key === "string"
			? ` \u2192 ${TRANSFORM.Key}`
			: TRANSFORM
				? ` \u2192 <anonymous transform>`
				: "";

	const Label = ([REQUEST, ...optionParts].join(" | ") + transformPart).replace(
		/\r?\n/g,
		" ",
	);

	try {
		const Cache = await Get(`${Hash}`);

		if (
			Cache?.Set &&
			Date.now() - Cache.TimeStamp <
				(
					await import("@Function/Table/Layout/Request/Get/TTL.js")
				).default([REQUEST, OPTION])
		) {
			return Cache.Set;
		} else {
			RETURN = await (
				await import("@Function/Table/Layout/Request/Octokit.js")
			).default(REQUEST, OPTION);

			if (TRANSFORM && typeof TRANSFORM === "function") {
				RETURN = await TRANSFORM(RETURN);
			}
		}

		// Only cache successful responses (RETURN is not undefined)
		if (RETURN !== undefined) {
			await (
				await import("@Function/Table/Layout/Request/Set.js")
			).default(`${Hash}`, RETURN, Label);
		}

		return RETURN;
	} catch (_Error) {
		console.log(_Error);
	}

	return RETURN;
};

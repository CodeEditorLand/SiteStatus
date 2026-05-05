import { createHash } from "node:crypto";

import type { PARAMETER } from "../Octokit.js";

/** Return the MD5 cache key for a given request without touching the filesystem. */
export const Key = (parameter: PARAMETER): string =>
	createHash("md5").update(JSON.stringify(parameter)).digest("hex");

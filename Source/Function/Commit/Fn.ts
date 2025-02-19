import { getSecret, type TOKEN_GITHUB_COMMIT_STATUS_EDITOR_LAND } from "astro:env/server";

const Octokit = new (await import("@octokit/rest")).Octokit({
	auth: getSecret("TOKEN_GITHUB_COMMIT_STATUS_EDITOR_LAND") as typeof TOKEN_GITHUB_COMMIT_STATUS_EDITOR_LAND,
});

export const Fn = async (_Owner, _Repository, _SHA) => {
	try {
		return [];
	} catch (_Error) {
		console.error("Cannot Commit:", _Error);

		return [];
	}

	// try {
	// 	// Check for submodule updates (.gitmodules changes)
	// 	const submoduleChanges = (
	// 		await Octokit.repos.getCommit({
	// 			owner,
	// 			repo,
	// 			ref: commitSha,
	// 		})
	// 	).data.files.filter((file) => file.filename === ".gitmodules");

	// 	if (submoduleChanges.length === 0) {
	// 		return [];
	// 	}

	// 	// Recursively fetch submodule commits
	// 	return await Promise.all(
	// 		submoduleChanges
	// 			.flatMap((change) => {
	// 				// ... (This is highly dependent on your .gitmodules structure)
	// 				// Parse the .gitmodules diff to find updated submodule SHAs
	// 				// Example:
	// 				// const submoduleSha = extractSubmoduleShaFromDiff(change.patch);
	// 				// return { submodulePath: change.filename, sha: submoduleSha };
	// 			})
	// 			.map(async (submodule) => {
	// 				const submoduleCommitData = await octokit.repos.getCommit({
	// 					// Assuming submodules are in separate repos, adjust as needed
	// 					owner: submodule.owner || owner,
	// 					repo: submodule.repo,
	// 					ref: submodule.sha,
	// 				});

	// 				// Recursive call to get submodule commits of this submodule
	// 				const nestedSubmoduleCommits = await getSubmoduleCommits(
	// 					submodule.owner || owner,
	// 					submodule.repo,
	// 					submodule.sha,
	// 				);

	// 				return {
	// 					...submoduleCommitData.data,
	// 					// ... any additional submodule context (e.g., path)
	// 					submoduleCommits: nestedSubmoduleCommits, // Include nested commits
	// 				};
	// 			}),
	// 	);
	// } catch (error) {
	// 	console.error("Error fetching submodule commit:", error);
	// 	// Handle error (e.g., return an empty array or a placeholder)
	// 	return [];
	// }
};

export default Fn;

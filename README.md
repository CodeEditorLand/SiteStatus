# [Status&#x2001;⌛&#x2001;Code&#x2001;💻&#x2001;Editor&#x2001;🔧&#x2001;Land&#x2001;🏞️&#x2001;WebSite](https://Status.Code.Editor.Land)&#x2001;🗾

<a href="https://github.com/CodeEditorLand/StatusWebSite"><img src="https://img.shields.io/static/v1?label=Framework&message=Astro%207&color=BC52EE" alt="Framework: Astro 7" /></a>
<a href="https://github.com/CodeEditorLand/StatusWebSite"><img src="https://img.shields.io/static/v1?label=Branch&message=Current&color=2A9D8F" alt="Branch: Current" /></a>
<a href="https://github.com/CodeEditorLand/StatusWebSite/tree/Current/LICENSE"><img src="https://img.shields.io/static/v1?label=License&message=CC0%201.0&color=0F9D58" alt="License: CC0 1.0" /></a>

The status dashboard for the Land code editor. It is a static
[Astro](https://astro.build) site that reads the GitHub API for every
`CodeEditorLand` repository and renders one activity table per repository, so
the whole organisation can be read at a glance from a single page.

Live at [Status.Code.Editor.Land](https://Status.Code.Editor.Land).

> [!NOTE]
>
> This repository builds the dashboard only. It does not build the editor - each
> Element it reports on is its own repository.

## Where This Sits&#x2001;🗺️

Land is split into Elements, and each Element is a separate repository. This
one is a reporter: it holds no editor code and consumes the others read-only
through the public GitHub API.

| Question | Answer |
| --- | --- |
| What is it | A static Astro dashboard of repository activity |
| What it reads | The GitHub REST API, one tree and commit list per repository |
| What it writes | Pre-rendered HTML plus a JSONC response cache |
| What it does not do | Ship editor code, or write to any repository it reports on |

The page at
[`Source/pages/index.astro`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/pages/index.astro)
mounts one table per Element, sixteen in total: Common, Echo, Vine, Mountain,
Rest, Output, Cocoon, Wind, Worker, Sky, Mist, Maintain, Grove, Land, Element
and Dependency.

**`Source/pages/index.astro`**

```astro
<div class="m-2 p-2">
	<Table User="CodeEditorLand" Repository="Common" />
</div>
```

> [!NOTE]
>
> One `Table` per Element - adding a repository to the dashboard is one more
> instance of this block.

## Getting Started&#x2001;🚀

The project uses pnpm, matching the `pnpm install` step in
[`.github/workflows/Node.yml`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/.github/workflows/Node.yml).

**`Terminal`**

```sh
pnpm install
pnpm run Run
```

> [!NOTE]
>
> `Run` maps to `astro dev --host`; the published build runs through
> `prepublishOnly`, which is `astro build`.

Copy
[`.env.example`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/.env.example)
to `.env` first. `TOKEN` is optional - without it the build falls back to
unauthenticated GitHub access at 60 requests per hour, which is enough for
public repositories but slow.

**`.env.example`**

```sh
TOKEN=""
CF_PAGES_COMMIT_SHA="1"
```

> [!NOTE]
>
> `TOKEN` accepts a comma-separated list of GitHub PATs, not just one.

## Architecture&#x2001;🏗️

Everything under
[`Source`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source)
is organised by role: `pages` and `Layout` for the shell, `Function` for the
components that do work, `Script` for third-party integrations, `Variable` for
shared state and `Stylesheet` for the global CSS.

### Table&#x2001;📊

[`Source/Function/Table/Layout.astro`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Table/Layout.astro)
is the component that turns one repository into one table. It takes `User` and
`Repository` props and asks the GitHub API for the recursive git tree, counting
the files it returns.

**`Source/Function/Table/Layout.astro`**

```astro
const Total = async (
	By: string,
	URL = "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
) =>
```

> [!NOTE]
>
> The `recursive: true` tree call is what produces each repository's file count.

The rendered table itself is driven client-side by
[DataTables](https://datatables.net), vendored under
[`Source/Script/DataTables`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Script/DataTables),
which supplies the sorting, search panes, column reordering and export buttons.

### Request&#x2001;📡

[`Source/Function/Table/Layout/Request.ts`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Table/Layout/Request.ts)
wraps Octokit and splits into
[`Request/Get.ts`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Table/Layout/Request/Get.ts)
for cache reads,
[`Request/Set.ts`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Table/Layout/Request/Set.ts)
for cache writes,
[`Request/Octokit.ts`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Table/Layout/Request/Octokit.ts)
for the typed client and
[`Request/Pool.ts`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Table/Layout/Request/Pool.ts)
for token rotation.

**`Source/Function/Table/Layout/Request/Pool.ts`**

```ts
/** True after a 401 - token is invalid for the rest of this build. */
dead: boolean;
/** Unix-ms timestamp after which the token is usable again; 0 = ready. */
exhaustedUntil: number;
```

> [!NOTE]
>
> The pool round-robins live tokens, retiring a 401 permanently and a 403 or 429
> only until its `x-ratelimit-reset`.

### Cache&#x2001;🗃️

A full build would exhaust any rate limit, so every API response is written to
disk as JSONC and replayed on the next build. `Get.ts` reads
`Cache/Table/<hash>.jsonc`, strips the comment header and parses what is left.

**`Source/Function/Table/Layout/Request/Get.ts`**

```ts
const raw = await readFile(`Cache/Table/${hash}.jsonc`, {
	encoding: "utf-8",
});
// Strip single-line // comments (JSONC header) before parsing.
```

> [!NOTE]
>
> The checked-in cache under `Cache/Table` holds roughly sixteen thousand of
> these response files.

Freshness is per endpoint.
[`Request/Get/TTL.ts`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Table/Layout/Request/Get/TTL.ts)
gives the first page of commits a thirty-minute life and older pages a day,
because only the newest page changes often. A second cache of release tags lives
in
[`Public/Cache/Tag`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Public/Cache/Tag).

**`Source/Function/Table/Layout/Request/Get/TTL.ts`**

```ts
export const MIN_30 = 30 * 60 * 1000;
export const WEEK_1 = 7 * 24 * 60 * 60 * 1000;
export const HOUR_24 = 24 * 60 * 60 * 1000;
```

> [!NOTE]
>
> Three tiers - half an hour for volatile data, a day for settled data, a week
> for data that effectively never moves.

[`.github/workflows/Cache.yml`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/.github/workflows/Cache.yml)
refreshes the cache on a schedule, deliberately offset from the other scheduled
workflow so the two never race for the branch tip.

**`.github/workflows/Cache.yml`**

```yml
schedule:
    # Daily at 12:00 UTC, offset from Auto.yml (00:00 UTC) so the two
    # never race for the branch tip.
    - cron: "0 12 * * *"
```

> [!NOTE]
>
> Cache refresh runs at midday UTC;
> [`Auto.yml`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/.github/workflows/Auto.yml)
> takes midnight.

### Dot&#x2001;⠿

[`Source/Function/Table/Layout/Dot.ts`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Table/Layout/Dot.ts)
draws each activity sparkline in Braille characters rather than an image, which
keeps the table sortable, selectable and free of extra requests.

**`Source/Function/Table/Layout/Dot.ts`**

```ts
private static readonly Default: Required<Interface> = {
	Total: 20,
	Column: 5,
};
```

> [!NOTE]
>
> Twenty units of activity spread across five Braille columns, so `Display`
> returns a five-character bar.

Colour and formatting for the cells come from the helpers under
[`Layout/Code`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Table/Layout/Code):
`HEX.ts` and `RGB.ts` for colour spaces, `Interpolate.ts` for gradients,
`Animation.ts`, `Cell.ts`, `Escape.ts`, `Format.ts`, `Input.ts` and `Segment.ts`
for the rest, alongside `Unwrap.ts` and `UUID.ts`.

### Scroll&#x2001;🌀

[`Source/Function/Scroll`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Scroll)
is the animated background, written in [SolidJS](https://solidjs.com) rather
than Astro because it updates every frame. It tracks pointer velocity and drives
per-pixel movement from it.

**`Source/Function/Scroll/Type.ts`**

```ts
export interface Mouse {
	X: number;
	Y: number;
	Velocity: number;
	Active: boolean;
}
```

> [!NOTE]
>
> Pointer state feeds `MovementDimensional`, which carries X, Y, rotation and
> scale into
> [`Scroll/Code/Pixel.tsx`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Scroll/Code/Pixel.tsx).

The motion field comes from `simplex-noise` seeded through
[`Source/Variable/Scroll/Matrix.ts`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Variable/Scroll/Matrix.ts).

### Configuration&#x2001;⚙️

[`astro.config.ts`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/astro.config.ts)
declares the environment schema and fills in the commit SHA from git when the
host has not provided one, so a local build produces the same shape of output as
a CI build.

**`astro.config.ts`**

```ts
if (!process.env["CF_PAGES_COMMIT_SHA"]) {
	const currentHeadSha = execSync("git rev-parse HEAD").toString().trim();
	process.env["CF_PAGES_COMMIT_SHA"] = currentHeadSha;
}
```

> [!NOTE]
>
> `CACHE_VERSION_SHA` is derived the same way from `HEAD~1`, and both fall back
> to a placeholder rather than failing the build.

Styling is Tailwind via
[`tailwind.config.js`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/tailwind.config.js)
and
[`postcss.config.js`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/postcss.config.js),
over the global rules in
[`Source/Stylesheet`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Stylesheet).
Path aliases such as `@Function` and `@Layout` are declared in
[`jsconfig.json`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/jsconfig.json)
and
[`tsconfig.json`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/tsconfig.json).

### Analytic and Firebase&#x2001;📈

[`Source/Function/Analytic/Layout.astro`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Function/Analytic/Layout.astro)
embeds a PostHog dashboard by key, and
[`Source/Script/Firebase.ts`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source/Script/Firebase.ts)
initialises Firebase only when credentials are present.

**`Source/Script/Firebase.ts`**

```ts
if (!apiKey || !projectId) {
	console.warn(
		"Firebase: skipping initialization - PUBLIC_FIREBASE_API_KEY and/or PUBLIC_FIREBASE_PROJECT_ID are not set.",
	);
	return null;
}
```

> [!NOTE]
>
> Both integrations are optional - the dashboard builds and renders without
> either configured.

## Repository Layout&#x2001;📁

| Path | Role |
| --- | --- |
| [`Source`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Source) | Pages, layouts, components and stylesheets |
| [`Public`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Public) | Static assets, `Manifest.json` and the tag cache |
| [`Cache`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Cache) | Checked-in JSONC responses from the GitHub API |
| [`Target`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/Target) | Build output |
| [`docs`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/docs) | Generated TypeDoc API reference |
| [`.github`](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/.github) | Workflows, Dependabot and funding metadata |

> [!IMPORTANT]
>
> `Cache` and `Public/Cache/Tag` are committed on purpose. They are what keeps a
> cold build inside the GitHub rate limit.

## Contributing&#x2001;🤝

See
[CONTRIBUTING.md](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/CONTRIBUTING.md)
and
[CODE_OF_CONDUCT.md](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/CODE_OF_CONDUCT.md).
Changes land on the `Current` branch. Release history is in
[CHANGELOG.md](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/CHANGELOG.md).

## License&#x2001;📄

[CC0 1.0 Universal](https://github.com/CodeEditorLand/StatusWebSite/tree/Current/LICENSE).

## Funding&#x2001;💶

This project is funded through
[NGI0 Commons Fund](https://NLnet.NL/commonsfund), a fund established by
[NLnet](https://NLnet.NL) with financial support from the European Commission's
[Next Generation Internet](https://ngi.eu) program. Learn more at the
[NLnet project page](https://NLnet.NL/project/Land).

| Land                                                                                                                                                  | PlayForm                                                                                                                                                | NLnet                                                                                        | NGI0 Commons Fund                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [<img src="https://raw.githubusercontent.com/CodeEditorLand/Asset/refs/heads/Current/Logo/Land.svg" height="80px" alt="Land" />](https://Editor.Land) | [<img src="https://raw.githubusercontent.com/PlayForm/Asset/refs/heads/Current/Logo/PlayForm.svg" height="80px" alt="PlayForm" />](https://Editor.Land) | [<img width="240px" src="https://NLnet.NL/logo/banner.svg" alt="NLnet" />](https://NLnet.NL) | [<img width="240px" src="https://NLnet.NL/image/logos/NGI0CommonsFund_tag_black_mono.svg" alt="NGI0 Commons Fund" />](https://NLnet.NL/commonsfund) |

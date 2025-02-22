import { Layer, Lerp } from "@Function/Commit/Animation.js";
import HEX from "@Function/Commit/HEX.js";
import Interpolate from "@Function/Commit/Interpolate.js";
import RGB from "@Function/Commit/RGB.js";
import DataTable from "datatables.net-dt";

// stone.50
const StoneLow = RGB("#faf9f8");

// stone.950
const StoneHigh = RGB("#9a9a79");

// neutral.50
const NeutralLow = RGB("#faf9f7");

// neutral.950
const NeutralHigh = RGB("#9a933f");

// zinc.50
const ZincLow = RGB("#f8f7f5");

// zinc.950
const ZincHigh = RGB("#7a7b37");

const TimeNoise = 0;

const NoiseInfluence = 0.5;

export const HighLight = (
	Container: HTMLElement,

	Search: string,

	HighLight = "HighLight",
) => {
	Container.querySelectorAll<HTMLSpanElement>(`span.${HighLight}`).forEach(
		(Span) => (Span.outerHTML = Span.textContent ?? ""),
	);

	if (!Container || !Search) {
		return;
	}

	Container.innerHTML = Container.innerHTML.replace(
		new RegExp(Search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),

		(Match: string) => `<span class="${HighLight}">${Match}</span>`,
	);
};

export const Segment = (Total: number, Element: HTMLDivElement) => {
	Element.innerHTML = "";

	Element.querySelectorAll(".Segment").forEach((Element) => Element.remove());

	for (let Index = 0; Index < Total; Index++) {
		let Low, High, SegmentGroup, IndexGroup, Seed;

		if (Index < 360) {
			Low = StoneLow;

			High = StoneHigh;

			SegmentGroup = Total < 360 ? Total : 360;

			IndexGroup = Index;

			Seed = 0;
		} else if (Index < 720) {
			Low = NeutralLow;

			High = NeutralHigh;

			SegmentGroup = Math.min(360, Total - 360);

			IndexGroup = Index - 360;

			Seed = 1;
		} else {
			Low = ZincLow;

			High = ZincHigh;

			SegmentGroup = Total - 720;

			IndexGroup = Index - 720;

			Seed = 2;
		}

		const Segment = document.createElement("div");

		Segment.classList.add("Segment");

		Segment.style.backgroundColor = HEX(
			...Interpolate(
				Low,

				High,

				Lerp(
					SegmentGroup > 1 ? IndexGroup / (SegmentGroup - 1) : 0,

					(Layer(TimeNoise + Seed, IndexGroup) + 1) / 2,

					NoiseInfluence,
				),
			),
		);

		Element.appendChild(Segment);
	}
};

export const Progress = (
	Current: number,

	_Total: number,

	Element: HTMLDivElement,
) =>
	Element.querySelectorAll(".Segment").forEach((Segment, Index) =>
		Index < Current + 1
			? Segment.classList.add("Completed")
			: Segment.classList.remove("Completed"),
	);

document.addEventListener("DOMContentLoaded", () => {
	const Theme = () =>
		document.querySelector("html")?.classList.toggle(
			"dark",

			window.matchMedia("(prefers-color-scheme: dark)").matches,
		);

	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", Theme);

	Theme();

	class Commit extends HTMLElement {
		connectedCallback() {
			const UUID = this.dataset["uuid"] ?? "";

			new DataTable(`[data-uuid="${UUID}"] table`, {
				columns: [
					{
						title: "DATE",

						render: (Text) =>
							`<span class="Text">${Text} 📅</span>`,

						data: (Row) => new Date(Row.Date).toLocaleDateString(),

						type: "date",
					},

					{
						title: "FILE",

						render: (_, __, Row) =>
							`<span class="Text File" title="File: ${Row.File[2]} / ${Row.File[1]}">${Row.File[0]}</span>`,

						data: (Row) => Row.File[1],
					},

					{
						title: "COMMIT MESSAGE",

						data: "Commit Message",

						render: (Text) =>
							`<span class="Text">${Text.trim() === "" || Text.trim().length === 0 ? "No Commit Message 😶" : `${Text.trim()} 🗣️`}</span>`,
					},

					{
						title: "HREF",

						render: (_, __, Row) => `<a class="Pulse" \
									href="${Row.HREF}" \
									rel="noopener noreferrer" \
									target="_blank"> \
										<span class="Text">@COMMIT_</span><span class="Text SHA">${Row.SHA} 🔗</span> \
									</a>`,

						data: (Row) => `@COMMIT_${Row.SHA}`,
					},

					{
						title: "AUTHOR",

						data: "Author",

						render: (Text) =>
							`<span class="Text">${Text} ✍️</span>`,
					},
				],

				// @ts-expect-error
				data: window[UUID],

				responsive: true,

				paging: true,

				scrollCollapse: true,

				scrollY: "1000px",

				processing: true,

				// order: [[1, "desc"]],

				pageLength: 5,

				pagingType: "full_numbers",

				lengthMenu: [5, 10, 20, 40, 80, 160, 320],

				drawCallback: (Setting) =>
					Setting["oPreviousSearch"]["search"]
						.split("_")
						.forEach((_Element: string) =>
							document
								.querySelectorAll<HTMLSpanElement>(
									`#${Setting["sInstance"]} .Text`,
								)
								.forEach((Element) =>
									HighLight(Element, _Element),
								),
						),

				initComplete(Setting) {
					const Touch = document.querySelector<HTMLDivElement>(
						`[data-uuid="${UUID}"] .Touch`,
					);

					const _Progress = Touch?.querySelector<HTMLDivElement>(
						`.Progress`,
					) as HTMLDivElement;

					const Api = () => Setting["oInstance"].api();

					const Info = () => Api().page.info();

					Segment(Info().pages, _Progress);

					Progress(Info().page, Info().pages, _Progress);

					Touch?.addEventListener("mousemove", (e) => {
						const Target = Math.floor(
							(e.offsetX / Touch.offsetWidth) * Info().pages,
						);

						if (Target !== Info().page) {
							Api().page(Target).draw(false);
						}
					});
				},

				infoCallback(Setting, _, __, ___, ____, _String) {
					const _Progress = document
						.querySelector<HTMLDivElement>(
							`[data-uuid="${UUID}"] .Touch`,
						)
						?.querySelector<HTMLDivElement>(
							`.Progress`,
						) as HTMLDivElement;

					const Api = () => Setting["oInstance"].api();

					const Info = () => Api().page.info();

					Segment(Info().pages, _Progress);

					Progress(Info().page, Info().pages, _Progress);

					return _String;
				},
			});
		}
	}

	customElements.define("commit-table", Commit);
});

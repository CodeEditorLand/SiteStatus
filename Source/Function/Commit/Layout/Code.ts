import Cell from "@Function/Commit/Layout/Code/Cell.js";
import Input from "@Function/Commit/Layout/Code/Input.js";
import Segment from "@Function/Commit/Layout/Code/Segment.js";
import DataTable from "datatables.net-dt";

import "@Function/Commit/Layout/Code/Stylesheet.scss";

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
			const Repository = this.dataset["repository"] ?? "";
			const User = this.dataset["user"] ?? "";
			const UUID = this.dataset["uuid"] ?? "";
			const AJAX = this.dataset["ajax"] ?? "";

			new DataTable(`[data-uuid="${UUID}"] table`, {
				ajax: {
					async: true,

					cache: true,

					contentType: "application/json",

					crossDomain: true,

					dataSrc: "",

					dataType: "json",

					url: AJAX,
				},

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
						title: "MESSAGE",

						data: "Message",

						render: (Text) =>
							`<span class="Text">${Text.trim() === "" || Text.trim().length === 0 ? "No Message 😶" : `${Text.trim()} 🗣️`}</span>`,
					},

					{
						title: "COMMIT",

						render: (_, __, Row) =>
							`<a class="Pulse" href="HTTPS://GitHub.Com/${User}/${Repository}/commit/${Row.SHA}" rel="noopener noreferrer" target="_blank"><span class="Text">@COMMIT_</span><span class="Text SHA">${Row.SHA} 🔗</span></a>`,

						data: (Row) => `@COMMIT_${Row.SHA}`,
					},

					{
						title: "AUTHOR",

						data: "Author",

						render: (Text) =>
							`<span class="Text">${Text} ✍️</span>`,
					},
				],

				deferRender: true,

				drawCallback: (Setting) => {
					document
						.querySelectorAll<HTMLElement>(`[data-uuid="${UUID}"] `)
						.forEach((Element) => Cell(Element) && Input(Element));

					Setting["oPreviousSearch"]["search"]
						.split("_")
						.forEach((_Element: string) =>
							document
								.querySelectorAll<HTMLSpanElement>(
									`#${Setting["sInstance"]} .Text`,
								)
								.forEach((Element) =>
									((
										Container: HTMLElement,

										Search: string,

										HighLight = "HighLight",
									) => {
										Container.querySelectorAll<HTMLSpanElement>(
											`span.${HighLight}`,
										).forEach(
											(Span) =>
												(Span.outerHTML =
													Span.textContent ?? ""),
										);

										if (!Container || !Search) {
											return;
										}

										Container.innerHTML =
											Container.innerHTML.replace(
												new RegExp(
													Search.replace(
														/[.*+?^${}()|[\]\\]/g,

														"\\$&",
													),

													"gi",
												),

												(Match: string) =>
													`<span class="${HighLight}">${Match}</span>`,
											);
									})(Element, _Element),
								),
						);
				},

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
					const Api = () => Setting["oInstance"].api();

					const Info = () => Api().page.info();

					const _Progress = document
						.querySelector<HTMLDivElement>(
							`[data-uuid="${UUID}"] .Touch`,
						)
						?.querySelector<HTMLDivElement>(
							`.Progress`,
						) as HTMLDivElement;

					Segment(Info().pages, _Progress);

					Progress(Info().page, Info().pages, _Progress);

					return _String;
				},

				layout: {
					top2: [
						{
							div: {
								html: `<h1 class="text-3xl font-bold text-stone-900 dark:text-white font-sans mb-4 mr-4">${User}/${Repository}</h1>`,

								className: "Title",
							},
						},

						{
							div: {
								html: `<div class="Progress"></div>`,

								className: "Touch",
							},
						},
					],

					top1: [
						{
							pageLength: {},
						},

						{
							paging: {
								type: "full_numbers",
							},
						},

						{
							search: {
								processing: false,
							},
						},
					],

					bottom: [
						{},
						{
							info: {
								text: `<h2 class="text-lg text-stone-700 dark:text-stone-400 mb-4">Showing _START_ to _END_ of _TOTAL_ entries<h2>`,
							},
						},
						{},
					],

					bottomEnd: null,

					bottomStart: null,

					topStart: null,

					topEnd: null,
				},

				lengthMenu: [5, 10, 20, 40, 80, 160, 320],

				pageLength: 5,

				paging: true,

				pagingType: "full_numbers",

				processing: false,

				// @ts-expect-error
				responsive: true,

				scrollCollapse: true,

				scrollY: "1000px",
			});
		}
	}

	customElements.define("commit-table", Commit);
});

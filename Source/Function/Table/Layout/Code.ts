import Cell from "@Function/Table/Layout/Code/Cell.js";
import Escape from "@Function/Table/Layout/Code/Escape.js";
import Format from "@Function/Table/Layout/Code/Format.js";
import Input from "@Function/Table/Layout/Code/Input.js";
import Segment from "@Function/Table/Layout/Code/Segment.js";
import type DataTablesButtons from "datatables.net-buttons-dt";
import type DataTables from "datatables.net-dt";
import type DataTablesFixedColumns from "datatables.net-fixedcolumns-dt";
import type DataTablesFixedHeader from "datatables.net-fixedheader-dt";
import type DataTablesResponsive from "datatables.net-responsive-dt";
import type DataTablesRowGroup from "datatables.net-rowgroup-dt";
import type DataTablesScroller from "datatables.net-scroller-dt";

import "@Function/Table/Layout/Code/Stylesheet.scss";
import "@Script/DataTables/datatables.min.js";

// biome-ignore lint/suspicious/noExplicitAny:
declare const DataTable: DataTables<any> &
	// biome-ignore lint/suspicious/noExplicitAny:
	DataTablesButtons<any> &
	// biome-ignore lint/suspicious/noExplicitAny:
	DataTablesFixedColumns<any> &
	// biome-ignore lint/suspicious/noExplicitAny:
	DataTablesFixedHeader<any> &
	// biome-ignore lint/suspicious/noExplicitAny:
	DataTablesResponsive<any> &
	// biome-ignore lint/suspicious/noExplicitAny:
	DataTablesRowGroup<any> &
	// biome-ignore lint/suspicious/noExplicitAny:
	DataTablesScroller<any>;

export const Progress = (
	Current: number,

	_Total: number,

	Element: HTMLDivElement,
): void =>
	Element.querySelectorAll(".Segment").forEach((Segment, Index): void =>
		Index < Current + 1
			? Segment.classList.add("Completed")
			: Segment.classList.remove("Completed"),
	);

document.addEventListener("DOMContentLoaded", (): void => {
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
			const Tag = this.dataset["tag"] ?? "";
			const Commit = this.dataset["commit"] ?? "";

			new DataTable(`[data-uuid="${UUID}"] table`, {
				ajax: {
					async: true,

					cache: true,

					contentType: "application/json",

					crossDomain: true,

					dataSrc: "",

					dataType: "json",

					url: Tag,
				},

				columns: [
					{
						title: "DATE",

						render: (Text): string =>
							`<span class="Text">${Text} 📅</span>`,

						data: (Row): string =>
							new Date(Row.Date).toLocaleDateString(),

						type: "date",

						defaultContent: "",
					},

					{
						title: "FILE",

						render: (_, __, Row): string =>
							`<span class="Text File" title="File: ${Row.File[2]} / ${Row.File[1]}">${Row.File[0]}</span>`,

						data: (Row): void => Row.File[1],

						defaultContent: "",
					},

					{
						title: "MESSAGE",

						data: "Message",

						render: (Text): string =>
							`<span class="Text">${Text?.trim() === "" || Text?.trim().length === 0 ? "No Message 😶" : `${Format(Escape(Text))?.trim()} 🗣️`}</span>`,

						defaultContent: "",
					},

					{
						title: "NAME",

						render: (_, __, Row): string =>
							`<a class="Pulse" href="HTTPS://GitHub.Com/${User}/${Repository}/releases/tag/${Row.Name}" rel="noopener noreferrer" target="_blank"><span class="Text">@TAG_</span><span class="Text SHA">${Row.Name} 🔗</span></a>`,

						data: (Row): string => `@TAG_${Row.Name}`,

						defaultContent: "",
					},

					{
						title: "COMMIT",

						render: (_, __, Row): string =>
							`<a class="Pulse" href="HTTPS://GitHub.Com/${User}/${Repository}/commit/${Row.SHA}" rel="noopener noreferrer" target="_blank"><span class="Text">@COMMIT_</span><span class="Text SHA">${Row.SHA} 🔗</span></a>`,

						data: (Row): string => `@COMMIT_${Row.SHA}`,

						defaultContent: "",
					},

					{
						title: "AUTHOR",

						data: "Author",

						render: (Text): string =>
							`<span class="Text">${Format(Escape(Text))?.trim()} ✍️</span>`,

						defaultContent: "",
					},
				],

				deferRender: true,

				drawCallback: (Setting): void => {
					document
						.querySelectorAll<HTMLElement>(`[data-uuid="${UUID}"] `)
						.forEach(
							(Element): boolean =>
								Cell(Element, Setting) &&
								Input(Element, Setting),
						);

					Setting["oPreviousSearch"]["search"]
						.split("_")
						.forEach((_Element: string): void =>
							document
								.querySelectorAll<HTMLSpanElement>(
									`#${Setting["sInstance"]} .Text`,
								)
								.forEach((Element): void =>
									((
										Container: HTMLElement,

										Search: string,

										HighLight = "HighLight",
									): void => {
										Container.querySelectorAll<HTMLSpanElement>(
											`span.${HighLight}`,
										).forEach(
											(Span): string =>
												// biome-ignore lint/suspicious/noAssignInExpressions:
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

												(Match: string): string =>
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
						".Progress",
					) as HTMLDivElement;

					// biome-ignore lint/suspicious/noExplicitAny:
					const Api = (): any => Setting["oInstance"].api();

					// biome-ignore lint/suspicious/noExplicitAny:
					const Info = (): any => Api().page.info();

					Segment(Info().pages, _Progress);

					Progress(Info().page, Info().pages, _Progress);

					Touch?.addEventListener("mousemove", (e): void => {
						const Target = Math.floor(
							(e.offsetX / Touch.offsetWidth) * Info().pages,
						);

						if (Target !== Info().page) {
							Api().page(Target).draw(false);
						}
					});
				},

				infoCallback(Setting, _, __, ___, ____, _String) {
					// biome-ignore lint/suspicious/noExplicitAny:
					const Api = (): any => Setting["oInstance"].api();

					// biome-ignore lint/suspicious/noExplicitAny:
					const Info = (): any => Api().page.info();

					const _Progress = document
						.querySelector<HTMLDivElement>(
							`[data-uuid="${UUID}"] .Touch`,
						)
						?.querySelector<HTMLDivElement>(
							".Progress",
						) as HTMLDivElement;

					Segment(Info().pages, _Progress);

					Progress(Info().page, Info().pages, _Progress);

					return _String;
				},

				fixedColumns: true,

				fixedHeader: true,

				layout: {
					top2: [
						{
							div: {
								html: `<h1><a href="HTTPS://GitHub.Com/${User}/${Repository}" target="_blank" rel="noopener noreferrer" title="GitHub ${User}/${Repository}">${User}/${Repository}</a></h1>`,

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
							buttons: [
								{
									text: "TAG",

									action: (_, dt, __, ___) => {
										dt.ajax.url(Tag);
										dt.ajax.reload();
										dt.column("NAME:title").visible(true);
									},

									className: "Tag",
								},

								{
									text: "COMMIT",

									action: (_, dt, __, ___) => {
										dt.ajax.url(Commit);
										dt.ajax.reload();
										dt.column("NAME:title").visible(false);
									},

									className: "Commit",
								},
							],
						},

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
								text: `<h2 class="Information">Showing _START_ to _END_ of _TOTAL_ entries<h2>`,
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

				pageLength: 40,

				paging: true,

				pagingType: "full_numbers",

				processing: false,

				responsive: true,

				scrollCollapse: true,

				scrollY: "350px",

				rowGroup: {
					enable: true,
					// @ts-expect-error
					dataSrc: (Row) => new Date(Row.Date).toLocaleDateString(),
					startRender: (Row, Group, _) =>
						`<span class="Text">${Group} 📅 ${Row.count()} Commit${Row.count() > 1 ? "s" : ""}</span>`,
				},
			});
		}
	}

	customElements.define("status-table", Commit);
});

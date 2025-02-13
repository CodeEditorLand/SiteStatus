import { c as createAstro, a as createComponent, r as renderTemplate, b as renderScript, d as defineScriptVars, e as renderComponent, m as maybeRenderHead, F as Fragment, s as spreadAttributes, f as renderSlotToString, g as renderAllHeadContent, u as unescapeHTML, h as addAttribute, i as renderSlot } from '../chunks/astro/server_DQDXEfGx.mjs';
import 'kleur/colors';
/* empty css                                 */
import { renderSync, parse, walkSync, ELEMENT_NODE } from 'ultrahtml';
import 'clsx';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$3 = createAstro("HTTPS://Status.Editor.Land");
const $$Layout$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Layout$1;
  const { user, repo } = Astro2.props;
  const Cache = `https://api.github.com/repos/${user}/${repo}/commits?per_page=50`;
  let Last = await (await import('../chunks/Fn_DGHoIMgk.mjs')).default(Cache) ?? await (await fetch(Cache)).json();
  (await import('../chunks/Fn_DW_St3WL.mjs')).default(Cache, Last);
  Last = Last.map((Commit) => ({
    "Author": Commit["commit"]["author"]["name"] ?? "",
    "Commit Message": Commit["message"] ?? "No Commit Message",
    "Date": Commit["commit"]["author"]["date"] ?? "",
    "HREF": Commit["html_url"] ?? "",
    "SHA": Commit["sha"] ?? ""
  }));
  const UUID = (await import('../chunks/Fn_C8Y3wdgj.mjs')).default();
  return renderTemplate(_a || (_a = __template(["", "  <script crossorigin=\"anonymous\">(function(){", "\n	// @ts-ignore\n	window[UUID] = Last;\n})();<\/script> ", ""])), renderComponent($$result, "commit-table", "commit-table", { "data-uuid": UUID }, { "default": () => renderTemplate` ${maybeRenderHead()}<table class="cell-border compact"></table> ` }), defineScriptVars({ Last, UUID }), renderScript($$result, "D:/Developer/Application/CodeEditorLand/StatusWebSite/Source/Function/Commit/Layout.astro?astro&type=script&index=0&lang.ts"));
}, "D:/Developer/Application/CodeEditorLand/StatusWebSite/Source/Function/Commit/Layout.astro", void 0);

const $$Astro$2 = createAstro("HTTPS://Status.Editor.Land");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Code", null, { "client:only": "solid-js", "Text": Astro2.props.Text ?? "", "Font": 2, "client:component-hydration": "only", "client:component-path": "@Function/Scroll/Code", "client:component-export": "default" })}` })}`;
}, "D:/Developer/Application/CodeEditorLand/StatusWebSite/Source/Function/Scroll/Layout.astro", void 0);

function has(value) {
  return typeof value === "string";
}
function is(a, b) {
  return a === b;
}
function any(a, b) {
  return has(a) && b.includes(a.toLowerCase());
}
const ElementWeights = {
  META: 10,
  TITLE: 9,
  PRECONNECT: 8,
  ASYNC_SCRIPT: 7,
  IMPORT_STYLES: 6,
  SYNC_SCRIPT: 5,
  SYNC_STYLES: 4,
  PRELOAD: 3,
  DEFER_SCRIPT: 2,
  PREFETCH_PRERENDER: 1,
  OTHER: 0
};
const ElementDetectors = {
  META: isMeta,
  TITLE: isTitle,
  PRECONNECT: isPreconnect,
  DEFER_SCRIPT: isDeferScript,
  ASYNC_SCRIPT: isAsyncScript,
  IMPORT_STYLES: isImportStyles,
  SYNC_SCRIPT: isSyncScript,
  SYNC_STYLES: isSyncStyles,
  PRELOAD: isPreload,
  PREFETCH_PRERENDER: isPrefetchPrerender
};
const META_HTTP_EQUIV_KEYWORDS = [
  "accept-ch",
  "content-security-policy",
  "content-type",
  "default-style",
  "delegate-ch",
  "origin-trial",
  "x-dns-prefetch-control"
];
function isMeta(name, a) {
  if (name === "base") return true;
  if (name !== "meta") return false;
  return has(a.charset) || is(a.name, "viewport") || any(a["http-equiv"], META_HTTP_EQUIV_KEYWORDS);
}
function isTitle(name) {
  return name === "title";
}
function isPreconnect(name, { rel }) {
  return name === "link" && is(rel, "preconnect");
}
function isAsyncScript(name, { src, async }) {
  return name === "script" && has(src) && has(async);
}
function isImportStyles(name, a, children) {
  const importRe = /@import/;
  if (name === "style") {
    return importRe.test(children);
  }
  return false;
}
function isSyncScript(name, { src, defer, async, type = "" }) {
  if (name !== "script") return false;
  return !(has(src) && (has(defer) || has(async) || is(type, "module")) || type.includes("json"));
}
function isSyncStyles(name, { rel }) {
  if (name === "style") return true;
  return name === "link" && is(rel, "stylesheet");
}
function isPreload(name, { rel }) {
  return name === "link" && any(rel, ["preload", "modulepreload"]);
}
function isDeferScript(name, { src, defer, async, type }) {
  if (name !== "script") return false;
  return has(src) && has(defer) || has(src) && is(type, "module") && !has(async);
}
function isPrefetchPrerender(name, { rel }) {
  return name === "link" && any(rel, ["prefetch", "dns-prefetch", "prerender"]);
}
function getWeight(element) {
  for (const [id, detector] of Object.entries(ElementDetectors)) {
    const children = element.name === "style" && element.children.length > 0 ? renderSync(element) : "";
    if (detector(element.name, element.attributes, children)) {
      return ElementWeights[id];
    }
  }
  return ElementWeights.OTHER;
}

function capo(html) {
  const ast = parse(html);
  try {
    walkSync(ast, (node, parent, index) => {
      if (node.type === ELEMENT_NODE && node.name === "head") {
        if (parent) {
          parent.children.splice(index, 1, getSortedHead(node));
          throw "done";
        }
      }
    });
  } catch (e) {
    if (e !== "done") throw e;
  }
  return renderSync(ast);
}
function getSortedHead(head) {
  const weightedChildren = head.children.map((node) => {
    if (node.type === ELEMENT_NODE) {
      const weight = getWeight(node);
      return [weight, node];
    }
  }).filter(Boolean);
  const children = weightedChildren.sort((a, b) => b[0] - a[0]).map(([_, element]) => element);
  return { ...head, children };
}

const Head = createComponent({
  factory: async (result, props, slots) => {
    let head = "";
    head += `<head${spreadAttributes(props)} data-capo>`;
    head += await renderSlotToString(result, slots.default);
    head += renderAllHeadContent(result);
    head += "</head>";
    return unescapeHTML(capo(head));
  }
});

const $$Astro$1 = createAstro("HTTPS://Status.Editor.Land");
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "D:/Developer/Application/CodeEditorLand/StatusWebSite/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Developer/Application/CodeEditorLand/StatusWebSite/node_modules/astro/components/ClientRouter.astro", void 0);

const $$Astro = createAstro("HTTPS://Status.Editor.Land");
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const {
    Title = "Status\u2001\u231B\u2001WebSite\u2001\u{1F5FE}\u2001Land\u2001\u{1F3DE}\uFE0F",
    Description = "Status website for the Land repository."
  } = Astro2.props;
  const Index = Astro2.url.pathname === "/" ? "-1" : "";
  return renderTemplate`<html lang="en" class="no-js" dir="ltr"> ${renderComponent($$result, "Head", Head, {}, { "default": ($$result2) => renderTemplate`${renderScript($$result2, "D:/Developer/Application/CodeEditorLand/StatusWebSite/Source/Layout/Base.astro?astro&type=script&index=0&lang.ts")}<title>${Title}</title><meta charset="utf-8"><meta name="description"${addAttribute(Description, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#ffffff"><meta name="format-detection" content="telephone=no"><meta name="twitter:dnt" content="on"><link rel="preconnect" href="HTTPS://fonts.googleapis.com" crossorigin><link rel="preconnect" href="HTTPS://fonts.gstatic.com" crossorigin><link rel="manifest" href="/site.webmanifest" crossorigin="use-credentials">${renderSlot($$result2, $$slots["Head"])}${renderComponent($$result2, "ClientRouter", $$ClientRouter, {})}` })}${maybeRenderHead()}<body> <div class="grow"> ${renderSlot($$result, $$slots["default"])} <a href="/" title="Status ⌛ Land 🏞️"${addAttribute(Index, "tabindex")} class="float-right inline-block w-auto"> ${renderComponent($$result, "Scroll", $$Layout, { "Text": "Status" })} </a> </div> ${renderScript($$result, "D:/Developer/Application/CodeEditorLand/StatusWebSite/Source/Layout/Base.astro?astro&type=script&index=1&lang.ts")} </body> </html>`;
}, "D:/Developer/Application/CodeEditorLand/StatusWebSite/Source/Layout/Base.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, {}, { "Head": ($$result2) => renderTemplate`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack-subset.css" crossorigin=\"anonymous\">`, "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="m-2 p-2"> <h1 class="mb-2 text-2xl font-bold text-stone-900 dark:text-white">
Latest Commits
</h1> <h2 class="mb-4 text-lg text-stone-700 dark:text-stone-400">
CodeEditorLand/Land
</h2> ${renderComponent($$result2, "Commit", $$Layout$1, { "user": "CodeEditorLand", "repo": "Land" })} </div> ` })}`;
}, "D:/Developer/Application/CodeEditorLand/StatusWebSite/Source/pages/index.astro", void 0);

const $$file = "D:/Developer/Application/CodeEditorLand/StatusWebSite/Source/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

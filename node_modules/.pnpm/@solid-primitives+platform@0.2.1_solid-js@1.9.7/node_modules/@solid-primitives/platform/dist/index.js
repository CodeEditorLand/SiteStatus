import { isServer } from "solid-js/web";
const w = isServer ? { document: {}, navigator: { userAgent: "" } } : window;
const n = w.navigator;
const ua = n.userAgent;
//
// Devices
//
/** Is Android Device */
export const isAndroid = /*#__PURE__*/ /Android/.test(ua);
/** Is Windows Device */
export const isWindows = /*#__PURE__*/ /(win32|win64|windows|wince)/i.test(ua);
/** Is Mac Device */
export const isMac = /*#__PURE__*/ /(macintosh|macintel|macppc|mac68k|macos)/i.test(ua);
/** Is IPhone Device */
export const isIPhone = /*#__PURE__*/ /iphone/i.test(ua);
/** Is IPad Device */
export const isIPad = /*#__PURE__*/ /ipad/i.test(ua) && n.maxTouchPoints > 1;
/** Is IPod Device */
export const isIPod = /*#__PURE__*/ /ipod/i.test(ua);
/** Is IOS Device */
export const isIOS = isIPhone || isIPad || isIPod;
/** Is Apple Device */
export const isAppleDevice = isIOS || isMac;
/** is a Mobile Browser */
export const isMobile = /*#__PURE__*/ /Mobi/.test(ua);
//
// Browsers
//
/** Browser is Mozilla Firefox */
export const isFirefox = /*#__PURE__*/ /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(ua);
/** Browser is Opera */
export const isOpera = (!!w.opr && !!w.opr.addons) || !!w.opera || /*#__PURE__*/ / OPR\//.test(ua);
/** Browser is Safari */
export const isSafari = !!n.vendor && n.vendor.includes("Apple") && ua && !ua.includes("CriOS") && !ua.includes("FxiOS");
/** Browser is Internet Explorer 6-11 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const isIE = /*@cc_on!@*/ false || !!w.document.documentMode;
/** is Chromium-based browser */
export const isChromium = !!w.chrome;
/** Browser is Edge */
export const isEdge = /*#__PURE__*/ /Edg/.test(ua) && isChromium;
/** Browser is Chrome */
export const isChrome = isChromium && n.vendor === "Google Inc." && !isOpera && !isEdge;
/** Browser is Brave */
export const isBrave = !!n.brave && n.brave.isBrave && n.brave.isBrave.name === "isBrave";
//
// Rendering Engines
//
/** Browser using Gecko Rendering Engine */
export const isGecko = /*#__PURE__*/ /Gecko\/[0-9.]+/.test(ua);
/** Browser using Blink Rendering Engine */
export const isBlink = /*#__PURE__*/ /Chrome\/[0-9.]+/.test(ua);
/** Browser using WebKit Rendering Engine */
export const isWebKit = /*#__PURE__*/ /AppleWebKit\/[0-9.]+/.test(ua) && !isBlink;
/** Browser using Presto Rendering Engine */
export const isPresto = /*#__PURE__*/ /Opera\/[0-9.]+/.test(ua);
/** Browser using Trident Rendering Engine */
export const isTrident = /*#__PURE__*/ /Trident\/[0-9.]+/.test(ua);
/** Browser using EdgeHTML Rendering Engine */
export const isEdgeHTML = /*#__PURE__*/ /Edge\/[0-9.]+/.test(ua);

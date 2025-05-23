import { FalsyValue } from "@solid-primitives/utils";
import { Accessor } from "solid-js";
export type Bounds = {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
};
export type NullableBounds = Record<keyof Bounds, number | null>;
export type UpdateGuard = <Args extends unknown[]>(update: (...args: Args) => void) => (...args: Args) => void;
export type Options = {
    trackScroll?: boolean | UpdateGuard;
    trackMutation?: boolean | UpdateGuard;
    trackResize?: boolean | UpdateGuard;
};
/**
 * @returns object of element's boundingClientRect with enumerable properties
 */
export declare function getElementBounds(element: Element): Bounds;
export declare function getElementBounds(element: Element | FalsyValue): NullableBounds;
/**
 * Creates a reactive store-like object of current element bounds — position on the screen, and size dimensions. Bounds will be automatically updated on scroll, resize events and updates to the dom.
 *
 * @param target Element for calculating bounds. Can be a reactive signal. Set to falsy value to disable tracking.
 * @param options Choose which events should be tracked *(All are enabled by default)*
 * - `options.trackScroll` — listen to window scroll events
 * - `options.trackMutation` — listen to changes to the dom structure/styles
 * - `options.trackResize` — listen to element's resize events
 * @returns reactive object of {@link target} bounds
 * @example
 * ```ts
 * const target = document.querySelector("#my_elem")!;
 * const bounds = createElementBounds(target);
 *
 * createEffect(() => {
 *    console.log(
 *      bounds.width, // => number
 *      bounds.height, // => number
 *      bounds.top, // => number
 *      bounds.left, // => number
 *      bounds.right, // => number
 *      bounds.bottom, // => number
 *    );
 * });
 * ```
 */
export declare function createElementBounds(target: Accessor<Element | FalsyValue> | Element, { trackMutation, trackResize, trackScroll }?: Options): Readonly<NullableBounds>;

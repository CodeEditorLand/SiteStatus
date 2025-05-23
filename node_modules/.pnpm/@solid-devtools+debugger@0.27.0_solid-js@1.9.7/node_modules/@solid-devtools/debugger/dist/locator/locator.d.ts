import type { KbdKey } from '@solid-primitives/keyboard';
import type { ToDyscriminatedUnion } from '@solid-devtools/shared/utils';
import { type NodeID, type SourceLocation } from '../main/types.ts';
export type LocatorOptions = {
    /** Choose in which IDE the component source code should be revealed. */
    targetIDE?: false | TargetIDE | TargetURLFunction;
    /**
     * Holding which key should enable the locator overlay?
     * @default 'Alt'
     */
    key?: false | KbdKey;
};
export type HighlightElementPayload = ToDyscriminatedUnion<{
    node: {
        id: NodeID;
    };
    element: {
        id: NodeID;
    };
}> | null;
export declare const WINDOW_PROJECTPATH_PROPERTY = "$sdt_projectPath";
export declare const LOCATION_ATTRIBUTE_NAME = "data-source-loc";
export type LocationAttr = `${string}:${number}:${number}`;
export type TargetIDE = 'vscode' | 'webstorm' | 'atom' | 'vscode-insiders';
export type SourceCodeData = SourceLocation & {
    projectPath: string;
};
export type TargetURLFunction = (data: SourceCodeData) => string | void;
export declare const LOC_ATTR_REGEX: RegExp;
export declare function getLocationAttr(element: Element): LocationAttr | null;
export declare const getProjectPath: () => string | undefined;
export declare function getSourceCodeData(location: SourceLocation): SourceCodeData | undefined;
/**
 * Validates and parses a location string to a {@link SourceLocation} object
 */
export declare function parseLocationString(location: string): SourceLocation | undefined;
export declare function openSourceCode(target: TargetIDE | TargetURLFunction, data: SourceCodeData): void;
//# sourceMappingURL=locator.d.ts.map
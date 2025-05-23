import * as s from 'solid-js';
import * as walker from '../structure/walker.ts';
import { type NodeID, type OutputEmit, type SourceLocation } from '../main/types.ts';
import * as locator from './locator.ts';
export * from './locator.ts';
export type LocatorComponent<TEl extends object> = {
    id: NodeID;
    name: string | undefined;
    element: TEl;
    location?: SourceLocation | null;
};
export declare function createLocator<TEl extends object>(props: {
    locatorEnabled: s.Accessor<boolean>;
    setLocatorEnabledSignal(signal: s.Accessor<boolean>): void;
    onComponentClick(componentId: NodeID, next: VoidFunction): void;
    emit: OutputEmit;
    component_registry: walker.ComponentRegistry<TEl>;
}): {
    useLocator: (options: locator.LocatorOptions) => void;
    setDevtoolsHighlightTarget(target: locator.HighlightElementPayload): void;
    openElementSourceCode(location: SourceLocation): undefined;
};
//# sourceMappingURL=index.d.ts.map
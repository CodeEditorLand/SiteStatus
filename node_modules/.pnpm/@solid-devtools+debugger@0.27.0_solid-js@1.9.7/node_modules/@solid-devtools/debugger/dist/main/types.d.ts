import type { Union } from '@solid-devtools/shared/utils';
import type { EncodedValue, InspectorUpdate, PropGetterState, ToggleInspectedValueData } from '../inspector/types.ts';
import * as locator from '../locator/locator.ts';
import type { StructureUpdates, DGraphUpdate } from '../types.ts';
/**
 * Main modules and views of the devtools. Used for "routing".
 */
export declare enum DevtoolsMainView {
    Structure = "structure"
}
export declare const DEFAULT_MAIN_VIEW = DevtoolsMainView.Structure;
export declare enum DebuggerModule {
    Locator = "locator",
    Structure = "structure",
    Dgraph = "dgraph"
}
export declare enum TreeWalkerMode {
    Owners = "owners",
    Components = "components",
    DOM = "dom"
}
export declare const DEFAULT_WALKER_MODE = TreeWalkerMode.Components;
export declare enum NodeType {
    Root = "ROOT",
    Component = "COMPONENT",
    Element = "ELEMENT",
    Effect = "EFFECT",
    Render = "RENDER",
    Memo = "MEMO",
    Computation = "COMPUTATION",
    Refresh = "REFRESH",
    Context = "CONTEXT",
    CatchError = "CATCH_ERROR",
    Signal = "SIGNAL",
    Store = "STORE",
    CustomValue = "CUSTOM_VALUE"
}
export declare const NODE_TYPE_NAMES: Readonly<Record<NodeType, string>>;
export type NodeData = {
    [NodeType.Root]: Solid.Root;
    [NodeType.Component]: Solid.Component;
    [NodeType.Element]: Element;
    [NodeType.Effect]: Solid.Computation;
    [NodeType.Render]: Solid.Computation;
    [NodeType.Memo]: Solid.Memo;
    [NodeType.Computation]: Solid.Computation;
    [NodeType.Refresh]: Solid.Memo;
    [NodeType.Context]: Solid.Computation;
    [NodeType.CatchError]: Solid.Computation;
    [NodeType.Signal]: Solid.Signal;
    [NodeType.Store]: Solid.Store;
    [NodeType.CustomValue]: Solid.SourceMapValue;
};
export type Node = Union<NodeData>;
export declare enum ValueItemType {
    Signal = "signal",
    Prop = "prop",
    Value = "value"
}
export declare const UNKNOWN = "unknown";
export declare const OWNER_LOCATION_PROP = "sdtLocation";
export type InspectedState = {
    readonly ownerId: NodeID | null;
    readonly signalId: NodeID | null;
    /** closest note to inspected signal/owner on the owner structure */
    readonly treeWalkerOwnerId: NodeID | null;
};
export declare const INSPECTED_STATE_NULL: InspectedState;
export type OutputChannels = {
    DebuggerEnabled: boolean;
    ResetPanel: void;
    InspectedState: InspectedState;
    InspectedNodeDetails: Mapped.OwnerDetails;
    StructureUpdates: StructureUpdates;
    NodeUpdates: NodeID[];
    InspectorUpdate: InspectorUpdate[];
    LocatorModeChange: boolean;
    HoveredComponent: {
        nodeId: NodeID;
        state: boolean;
    };
    InspectedComponent: NodeID;
    DgraphUpdate: DGraphUpdate;
};
export type InputChannels = {
    ResetState: void;
    InspectNode: {
        ownerId: NodeID | null;
        signalId: NodeID | null;
    } | null;
    InspectValue: ToggleInspectedValueData;
    ConsoleInspectValue: ValueItemID;
    HighlightElementChange: locator.HighlightElementPayload;
    OpenLocation: void;
    TreeViewModeChange: TreeWalkerMode;
    ViewChange: DevtoolsMainView;
    ToggleModule: {
        module: DebuggerModule;
        enabled: boolean;
    };
};
export type InputMessage = Union<InputChannels>;
export type InputListener = (e: InputMessage) => void;
export type OutputMessage = Union<OutputChannels>;
export type OutputListener = (e: OutputMessage) => void;
export type OutputEmit = (e: OutputMessage) => void;
export type SourceLocation = {
    file: string;
    line: number;
    column: number;
};
export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * When using a custom solid renderer, you should provide a custom element interface.
 * By default the debugger assumes that rendered elements are DOM elements.
 */
export type ElementInterface<T extends object> = {
    isElement: (obj: object | T) => obj is T;
    getElementAt: (e: MouseEvent) => T | null;
    getName: (el: T) => string | null;
    getChildren: (el: T) => Iterable<T>;
    getParent: (el: T) => T | null;
    getLocation: (el: T) => SourceLocation | null;
    getRect: (el: T) => Rect | null;
};
/**
 * Implementation of {@link ElementInterface} for {@link Element}
 */
export declare const dom_element_interface: ElementInterface<Element>;
export type NodeID = `#${string}`;
export type ValueItemID = `${ValueItemType.Signal}:${NodeID}` | `${ValueItemType.Prop}:${string}` | ValueItemType.Value;
export declare const getValueItemId: <T extends ValueItemType>(type: T, id: T extends ValueItemType.Value ? undefined : NodeID | string) => ValueItemID;
export type ValueUpdateListener = (newValue: unknown, oldValue: unknown) => void;
export declare namespace Solid {
    type OwnerBase = import('solid-js').Owner;
    type SourceMapValue = import('solid-js/types/reactive/signal.d.ts').SourceMapValue;
    type Signal = import('solid-js/types/reactive/signal.d.ts').SignalState<unknown>;
    type Computation = import('solid-js/types/reactive/signal.d.ts').Computation<unknown>;
    type Memo = import('solid-js/types/reactive/signal.d.ts').Memo<unknown>;
    type RootFunction<T> = import('solid-js/types/reactive/signal.d.ts').RootFunction<T>;
    type EffectFunction = import('solid-js/types/reactive/signal.d.ts').EffectFunction<unknown>;
    type Component = import('solid-js/types/reactive/signal.d.ts').DevComponent<{
        [key: string]: unknown;
    }>;
    type CatchError = Omit<Computation, 'fn'> & {
        fn: undefined;
    };
    type Root = OwnerBase & {
        attachedTo?: Owner;
        isDisposed?: true;
        context: null;
        fn?: never;
        state?: never;
        updatedAt?: never;
        sources?: never;
        sourceSlots?: never;
        value?: never;
        pure?: never;
    };
    type Owner = Root | Computation | CatchError;
    type StoreNode = import('solid-js/store').StoreNode;
    type NotWrappable = import('solid-js/store').NotWrappable;
    type OnStoreNodeUpdate = import('solid-js/store/types/store.d.ts').OnStoreNodeUpdate;
    type Store = SourceMapValue & {
        value: StoreNode;
    };
}
declare module 'solid-js/types/reactive/signal.d.ts' {
    interface Owner {
        sdtType?: NodeType;
        sdtSubRoots?: Solid.Owner[] | null;
        [OWNER_LOCATION_PROP]?: string;
    }
}
export type OnStoreNodeUpdate = Solid.OnStoreNodeUpdate & {
    storePath: readonly (string | number)[];
    storeSymbol: symbol;
};
export declare namespace Mapped {
    interface Owner {
        id: NodeID;
        type: Exclude<NodeType, NodeType.Refresh | NodeType.Signal | NodeType.Store>;
        children: Owner[];
        name?: string;
        hmr?: true;
        frozen?: true;
    }
    interface SourceValue {
        type: NodeType.Signal | NodeType.Memo | NodeType.Store | NodeType.CustomValue;
        name?: string;
        id: NodeID;
        value: EncodedValue[];
    }
    type Props = {
        proxy: boolean;
        record: {
            [key: string]: {
                getter: false | PropGetterState;
                value: EncodedValue[] | null;
            };
        };
    };
    interface OwnerDetails {
        id: NodeID;
        name?: string;
        type: NodeType;
        props?: Props;
        signals: SourceValue[];
        /** for computations */
        value?: EncodedValue[];
        location?: SourceLocation;
        hmr?: true;
    }
}
//# sourceMappingURL=types.d.ts.map
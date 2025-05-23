import { type ElementInterface, type Mapped, type NodeID, type Solid, TreeWalkerMode } from '../main/types.ts';
export type ComponentData<TEl extends object> = {
    id: NodeID;
    owner: Solid.Component;
    name: string | undefined;
    elements: Set<TEl>;
    element_nodes: Set<NodeID>;
    cleanup: () => void;
};
export type ComponentRegistry<TEl extends object> = {
    eli: ElementInterface<TEl>;
    /** Map of component nodes */
    components: Map<NodeID, ComponentData<TEl>>;
    /** Map of element nodes to component nodes */
    element_nodes: Map<NodeID, {
        el: TEl;
        component: ComponentData<TEl>;
    }>;
};
export declare const makeComponentRegistry: <TEl extends object>(eli: ElementInterface<TEl>) => ComponentRegistry<TEl>;
export declare const clearComponentRegistry: <TEl extends object>(r: ComponentRegistry<TEl>) => void;
export declare const cleanupComponent: <TEl extends object>(r: ComponentRegistry<TEl>, nodeID: NodeID) => void;
export declare const registerComponent: <TEl extends object>(r: ComponentRegistry<TEl>, owner: Solid.Component, id: NodeID, name: string | undefined, elements: TEl[] | null) => void;
export declare const registerElement: <TEl extends object>(r: ComponentRegistry<TEl>, componentId: NodeID, elementId: NodeID, element: TEl) => void;
export declare const getComponent: <TEl extends object>(r: ComponentRegistry<TEl>, id: NodeID) => {
    name: string | undefined;
    id: NodeID;
    elements: TEl[];
} | null;
/**
 * Searches for an HTML element with the given id in the component with the given id.
 *
 * It is assumed that the element is a child of the component.
 *
 * Used only in the DOM walker mode.
 */
export declare const getComponentElement: <TEl extends object>(r: ComponentRegistry<TEl>, elementId: NodeID) => {
    name: string | undefined;
    id: NodeID;
    element: TEl;
} | undefined;
export declare const findComponent: <TEl extends object>(r: ComponentRegistry<TEl>, el: TEl) => ComponentData<TEl> | null;
export type ComputationUpdateHandler = (rootId: NodeID, owner: Solid.Owner, changedStructure: boolean) => void;
export type TreeWalkerConfig<TEl extends object> = {
    mode: TreeWalkerMode;
    rootId: NodeID;
    onUpdate: ComputationUpdateHandler;
    registry: ComponentRegistry<TEl>;
    eli: ElementInterface<TEl>;
};
export declare const walkSolidTree: <TEl extends object>(owner: Solid.Owner | Solid.Root, config: TreeWalkerConfig<TEl>) => Mapped.Owner;
//# sourceMappingURL=walker.d.ts.map
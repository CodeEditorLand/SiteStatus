import { type Mapped, type NodeID, type Solid, DevtoolsMainView, TreeWalkerMode } from '../main/types.ts';
import * as walker from './walker.ts';
export type StructureUpdates = {
    /** Partial means that the updates are based on the previous structure state */
    partial: boolean;
    /** Removed roots */
    removed: NodeID[];
    /** Record: `rootId` -- Record of updated nodes by `nodeId` */
    updated: Partial<Record<NodeID, Partial<Record<NodeID, Mapped.Owner>>>>;
};
export declare function createStructure<TEl extends object>(props: {
    onStructureUpdate: (updates: StructureUpdates) => void;
    onNodeUpdate: (nodeId: NodeID) => void;
    enabled: () => boolean;
    component_registry: walker.ComponentRegistry<TEl>;
}): {
    updateAllRoots: () => void;
    forceUpdateAllRoots: () => void;
    setTreeWalkerMode: (mode: TreeWalkerMode) => void;
    resetTreeWalkerMode: () => void;
    getClosestIncludedOwner(owner: Solid.Owner): Solid.Owner | null;
    onViewChange(view: DevtoolsMainView): void;
};
//# sourceMappingURL=index.d.ts.map
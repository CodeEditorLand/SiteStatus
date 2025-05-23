import { type FalsyValue } from '@solid-primitives/utils';
import { type ElementInterface, type EncodedValue, type NodeID, type Solid } from '../types.ts';
export type HandleStoreCallback = (node: Solid.StoreNode, nodeId: NodeID) => void;
export type HandleStore = HandleStoreCallback | FalsyValue;
/**
 * Encodes any value to a JSON-serializable object.
 * @param value
 * @param deep shallow, or deep encoding
 * @param nodeMap for HTML elements and store nodes, to assign a unique ID to each element
 * @param handleStore handle encountered store nodes
 * @returns encoded value
 */
export declare function encodeValue<TEl extends object>(value: unknown, deep: boolean, eli: ElementInterface<TEl>, handleStore?: HandleStore, inStore?: boolean): EncodedValue[];
//# sourceMappingURL=serialize.d.ts.map
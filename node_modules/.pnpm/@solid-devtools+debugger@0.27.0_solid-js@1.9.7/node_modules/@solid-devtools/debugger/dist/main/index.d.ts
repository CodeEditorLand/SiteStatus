import * as s from 'solid-js';
import { type InputMessage, type OutputListener } from './types.ts';
declare function createDebugger(): {
    versions: {
        client: string | null;
        solid: string | null;
        expected_solid: string | null;
        get_client: () => string | null;
        get_solid: () => string | null;
        get_expected_solid: () => string | null;
    };
    enabled: s.Accessor<boolean>;
    listen: (listener: OutputListener) => (() => void);
    emit: (e: InputMessage) => void;
    setLocatorOptions: (options: import("../locator/locator.ts").LocatorOptions) => void;
    toggleEnabled(enabled: boolean): void;
};
export type Debugger = ReturnType<typeof createDebugger>;
/**
 * Used for connecting debugger to devtools
 */
export declare function useDebugger(): Debugger;
export {};
//# sourceMappingURL=index.d.ts.map
import * as s from 'solid-js';
import * as store from 'solid-js/store';
import * as debug from './types.ts';
/** @deprecated use `setLocatorOptions` */
export declare function useLocator(options: debug.LocatorOptions): void;
export declare function setLocatorOptions(options: debug.LocatorOptions): void;
export declare function setElementInterface(eli: debug.ElementInterface<any>): void;
export declare function setClientVersion(version: string): void;
export declare function setSolidVersion(version: string, expected: string): void;
export type SetupApi = {
    solid: NonNullable<typeof s.DEV> & {
        getOwner: typeof s.getOwner;
        getListener: typeof s.getListener;
        untrack: typeof s.untrack;
        $PROXY: typeof s.$PROXY;
        $TRACK: typeof s.$TRACK;
        $DEVCOMP: typeof s.$DEVCOMP;
        sharedConfig: typeof s.sharedConfig;
    };
    store: NonNullable<typeof store.DEV> & {
        unwrap: typeof store.unwrap;
        $RAW: typeof store.$RAW;
    };
    eli: debug.ElementInterface<any>;
    locator_options: debug.LocatorOptions | null;
    get_created_owners: () => debug.Solid.Owner[];
    get_locator_options: () => debug.LocatorOptions | null;
    versions: {
        client: string | null;
        solid: string | null;
        expected_solid: string | null;
        get_client: () => string | null;
        get_solid: () => string | null;
        get_expected_solid: () => string | null;
    };
    unowned: {
        signals: WeakRef<debug.Solid.Signal>[];
        onSignalAdded: ((ref: WeakRef<debug.Solid.Signal>, idx: number) => void) | null;
        onSignalRemoved: ((ref: WeakRef<debug.Solid.Signal>, idx: number) => void) | null;
    };
};
declare global {
    /** Solid DEV APIs exposed to the debugger by the setup script */
    var SolidDevtools$$: undefined | SetupApi;
}
//# sourceMappingURL=setup.d.ts.map
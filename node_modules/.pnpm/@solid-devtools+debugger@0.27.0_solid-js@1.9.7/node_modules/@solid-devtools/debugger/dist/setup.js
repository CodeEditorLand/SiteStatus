// packages/debugger/src/setup.ts
import * as s from "solid-js";
import * as store from "solid-js/store";
import { assert, error } from "@solid-devtools/shared/utils";

// packages/debugger/src/locator/locator.ts
import { isWindows } from "@solid-primitives/platform";

// packages/debugger/src/main/types.ts
var dom_element_interface = {
  isElement: (obj) => obj instanceof Element,
  getElementAt: (e) => e.target,
  getName: (el) => el.localName,
  getChildren: (el) => el.children,
  getParent: (el) => el.parentElement,
  getRect: (el) => el.getBoundingClientRect(),
  getLocation: (el) => {
    let attr = getLocationAttr(el);
    return attr && parseLocationString(attr) || null;
  }
};

// packages/debugger/src/locator/locator.ts
var LOCATION_ATTRIBUTE_NAME = "data-source-loc";
var LOC_ATTR_REGEX_WIN = /^((?:\\?[^\s][^/\\:\"\?\*<>\|]+)+):([0-9]+):([0-9]+)$/;
var LOC_ATTR_REGEX_UNIX = /^((?:(?:\.\/|\.\.\/|\/)?(?:\.?\w+\/)*)(?:\.?\w+\.?\w+)):([0-9]+):([0-9]+)$/;
var LOC_ATTR_REGEX = isWindows ? LOC_ATTR_REGEX_WIN : LOC_ATTR_REGEX_UNIX;
function getLocationAttr(element) {
  let attr = element.getAttribute(LOCATION_ATTRIBUTE_NAME);
  if (!attr || !LOC_ATTR_REGEX.test(attr)) return null;
  return attr;
}
function parseLocationString(location) {
  let [file, line, column] = location.split(":");
  if (file && line && column && typeof file === "string" && !isNaN(line = +line) && !isNaN(column = +column)) {
    return { file, line, column };
  }
}

// packages/debugger/src/setup.ts
function useLocator(options) {
  setLocatorOptions(options);
}
function setLocatorOptions(options) {
  assert(globalThis.SolidDevtools$$, "solid-devtools is not setup");
  globalThis.SolidDevtools$$.locator_options = options;
}
function setElementInterface(eli) {
  assert(globalThis.SolidDevtools$$, "solid-devtools is not setup");
  globalThis.SolidDevtools$$.eli = eli;
}
function setClientVersion(version) {
  assert(globalThis.SolidDevtools$$, "solid-devtools is not setup");
  globalThis.SolidDevtools$$.versions.client = version;
}
function setSolidVersion(version, expected) {
  assert(globalThis.SolidDevtools$$, "solid-devtools is not setup");
  globalThis.SolidDevtools$$.versions.solid = version;
  globalThis.SolidDevtools$$.versions.expected_solid = expected;
}
if (globalThis.SolidDevtools$$) {
  error("Debugger is already setup");
}
if (!s.DEV || !store.DEV) {
  error("SolidJS in not in development mode!");
} else {
  let created_owners = [];
  let setup = {
    solid: {
      ...s.DEV,
      getOwner: s.getOwner,
      getListener: s.getListener,
      untrack: s.untrack,
      $PROXY: s.$PROXY,
      $TRACK: s.$TRACK,
      $DEVCOMP: s.$DEVCOMP,
      sharedConfig: s.sharedConfig
    },
    store: {
      ...store.DEV,
      unwrap: store.unwrap,
      $RAW: store.$RAW
    },
    get_created_owners() {
      const events = created_owners ?? [];
      created_owners = null;
      return events;
    },
    eli: dom_element_interface,
    locator_options: null,
    get_locator_options() {
      return this.locator_options;
    },
    versions: {
      client: null,
      solid: null,
      expected_solid: null,
      get_client() {
        return this.client;
      },
      get_solid() {
        return this.solid;
      },
      get_expected_solid() {
        return this.expected_solid;
      }
    },
    unowned: {
      signals: [],
      onSignalAdded: null,
      onSignalRemoved: null
    }
  };
  globalThis.SolidDevtools$$ = setup;
  s.DEV.hooks.afterCreateOwner = (owner) => {
    created_owners?.push(owner);
  };
  let signals_registry = new FinalizationRegistry((ref) => {
    let idx = setup.unowned.signals.indexOf(ref);
    setup.unowned.signals.splice(idx, 1);
    setup.unowned.onSignalRemoved?.(ref, idx);
  });
  s.DEV.hooks.afterCreateSignal = (signal) => {
    if (s.getOwner() == null) {
      let ref = new WeakRef(signal);
      let idx = setup.unowned.signals.push(ref) - 1;
      signals_registry.register(signal, ref);
      setup.unowned.onSignalAdded?.(ref, idx);
    }
  };
}
export {
  setClientVersion,
  setElementInterface,
  setLocatorOptions,
  setSolidVersion,
  useLocator
};

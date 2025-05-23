import {
  DEFAULT_MAIN_VIEW,
  DEFAULT_WALKER_MODE,
  GLOBAL_GET_VALUE,
  INFINITY,
  INSPECTED_STATE_NULL,
  NAN,
  NEGATIVE_INFINITY,
  UNDEFINED,
  UNKNOWN,
  getProjectPath,
  getSourceCodeData,
  openSourceCode,
  parseLocationString
} from "./chunk-E2CCR3M4.js";

// packages/debugger/src/main/index.ts
import * as s5 from "solid-js";
import { createStaticStore } from "@solid-primitives/static-store";
import { defer as defer3 } from "@solid-primitives/utils";
import { assert, msg as msg4, mutate_remove } from "@solid-devtools/shared/utils";

// packages/debugger/src/dependency/index.ts
import * as s from "solid-js";
import { throttle } from "@solid-primitives/scheduled";
import { defer } from "@solid-primitives/utils";
import { msg } from "@solid-devtools/shared/utils";

// packages/debugger/src/main/id.ts
var WeakIdMap = /* @__PURE__ */ new WeakMap();
var RefMapMap = {
  ["OWNER" /* Owner */]: /* @__PURE__ */ new Map(),
  ["ELEMENT" /* Element */]: /* @__PURE__ */ new Map(),
  ["SIGNAL" /* Signal */]: /* @__PURE__ */ new Map(),
  ["STORE" /* Store */]: /* @__PURE__ */ new Map(),
  ["STORE_NODE" /* StoreNode */]: /* @__PURE__ */ new Map(),
  ["CUSTOM_VALUE" /* CustomValue */]: /* @__PURE__ */ new Map()
};
var CleanupRegistry = new FinalizationRegistry((data) => {
  RefMapMap[data.map].delete(data.id);
});
var LastId = 0;
var getNewSdtId = () => `#${(LastId++).toString(36)}`;
function getSdtId(obj, objType) {
  let id = WeakIdMap.get(obj);
  if (!id) {
    id = getNewSdtId();
    WeakIdMap.set(obj, id);
    RefMapMap[objType].set(id, new WeakRef(obj));
    CleanupRegistry.register(obj, { map: objType, id });
  }
  return id;
}
function getObjectById(id, objType) {
  const ref = RefMapMap[objType].get(id);
  return ref?.deref() ?? null;
}

// packages/debugger/src/main/utils.ts
import { trimString } from "@solid-devtools/shared/utils";

// packages/debugger/src/main/setup.ts
if (!globalThis.SolidDevtools$$) {
  throw new Error(
    `[solid-devtools]: Debugger hasn't found the exposed Solid Devtools API. Did you import the setup script?`
  );
}
var setup = globalThis.SolidDevtools$$;
var setup_default = setup;

// packages/debugger/src/main/utils.ts
function* unwrap_each(arr) {
  if (arr != null) {
    yield* arr.values();
  }
}
function unwrap_append(arr, item) {
  if (item != null) {
    arr.push(item);
  }
}
function* owner_each_child(o) {
  yield* unwrap_each(o.owned);
  yield* unwrap_each(o.sdtSubRoots);
}
var isSolidOwner = (o) => "owned" in o;
var isSolidComputation = (o) => !!o.fn;
var isSolidRoot = (o) => !("fn" in o);
var isSolidMemo = (o) => "fn" in o && "comparator" in o;
var isSolidComponent = (o) => "component" in o;
var isStoreNode = (o) => setup_default.store.$NODE in o;
var isSolidStore = (o) => !("observers" in o) && typeof o.value === "object" && o.value != null && setup_default.solid.$PROXY in o.value;
var isSolidSignal = (o) => "value" in o && "observers" in o && "observerSlots" in o && "comparator" in o;
function getNodeType(o) {
  if (isSolidOwner(o)) return getOwnerType(o);
  if (isSolidStore(o)) return "STORE" /* Store */;
  if (isSolidSignal(o)) return "SIGNAL" /* Signal */;
  else return "CUSTOM_VALUE" /* CustomValue */;
}
var SOLID_REFRESH_PREFIX = "[solid-refresh]";
var getOwnerType = (o) => {
  if (typeof o.sdtType !== "undefined") return o.sdtType;
  if (!isSolidComputation(o)) {
    if ("sources" in o) return "CATCH_ERROR" /* CatchError */;
    return "ROOT" /* Root */;
  }
  if (isSolidComponent(o)) return "COMPONENT" /* Component */;
  if ("comparator" in o) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      o.owner?.component?.name.startsWith(
        SOLID_REFRESH_PREFIX
      )
    ) {
      return "REFRESH" /* Refresh */;
    }
    return "MEMO" /* Memo */;
  }
  if (!o.pure) {
    if (o.user === true) return "EFFECT" /* Effect */;
    if (o.context !== null && (!o.owner || o.owner.context !== o.context))
      return "CONTEXT" /* Context */;
    return "RENDER" /* Render */;
  }
  return "COMPUTATION" /* Computation */;
};
function getNode(o) {
  return {
    kind: getNodeType(o),
    data: o
  };
}
var getNodeName = (o) => {
  let name;
  search: {
    if (typeof o.component === "function" && typeof o.component.displayName === "string" && o.component.displayName.length > 0) {
      name = o.component.displayName;
      break search;
    }
    if (o.name != null && o.name.length > 0) {
      name = o.name;
      break search;
    }
    return void 0;
  }
  if (name.startsWith(SOLID_REFRESH_PREFIX)) {
    name = name.slice(SOLID_REFRESH_PREFIX.length);
  }
  name = trimString(name, 36);
  return name;
};
function markOwnerType(o) {
  if (o.sdtType !== void 0) return o.sdtType;
  return o.sdtType = getOwnerType(o);
}
function isDisposed(o) {
  return !!(isSolidComputation(o) ? o.owner && (!o.owner.owned || !o.owner.owned.includes(o)) : o.isDisposed);
}
function onCleanup(fn) {
  let owner = setup_default.solid.getOwner();
  if (owner) {
    if (owner.cleanups === null) owner.cleanups = [fn];
    else owner.cleanups.push(fn);
  }
}
function getComponentRefreshNode(owner) {
  const { owned } = owner;
  let refresh;
  if (owned && owned.length === 1 && markOwnerType(refresh = owned[0]) === "REFRESH" /* Refresh */) {
    return refresh;
  }
  return null;
}
function lookupOwner(owner, predicate) {
  do {
    if (predicate(owner)) return owner;
    owner = owner.owner;
  } while (owner.owner);
  return null;
}
function onOwnerCleanup(owner, fn, prepend = false, symbol) {
  if (owner.cleanups === null) owner.cleanups = [fn];
  else {
    if (symbol) {
      if (owner.cleanups.some((c) => c[symbol])) {
        return () => owner.cleanups?.splice(
          owner.cleanups.findIndex((c) => c[symbol]),
          1
        );
      }
      ;
      fn[symbol] = true;
    }
    if (prepend) owner.cleanups.unshift(fn);
    else owner.cleanups.push(fn);
  }
  return () => owner.cleanups?.splice(owner.cleanups.indexOf(fn), 1);
}
function onParentCleanup(owner, fn, prepend = false, symbol) {
  if (owner.owner) return onOwnerCleanup(owner.owner, fn, prepend, symbol);
  return () => {
  };
}
function onOwnerDispose(owner, fn, prepend = false, symbol) {
  if (isSolidRoot(owner)) return onOwnerCleanup(owner, fn, prepend, symbol);
  return onParentCleanup(owner, fn, prepend, symbol);
}

// packages/debugger/src/main/observe.ts
import { chain, tryOnCleanup } from "@solid-primitives/utils";
var GraphUpdateListeners = /* @__PURE__ */ new Set();
setup_default.solid.hooks.afterUpdate = chain(GraphUpdateListeners);
function addSolidUpdateListener(onUpdate) {
  GraphUpdateListeners.add(onUpdate);
  return () => GraphUpdateListeners.delete(onUpdate);
}
function interceptComputationRerun(owner, onRun) {
  const _fn = owner.fn;
  let v;
  let prev;
  const fn = () => v = _fn(prev);
  owner.fn = !!owner.fn.length ? (p) => {
    onRun(fn, prev = p);
    return v;
  } : () => {
    onRun(fn, void 0);
    return v;
  };
}
var ComputationUpdateListeners = /* @__PURE__ */ new WeakMap();
function observeComputationUpdate(owner, onRun, symbol = Symbol()) {
  let map = ComputationUpdateListeners.get(owner);
  if (!map) ComputationUpdateListeners.set(owner, map = {});
  map[symbol] = onRun;
  interceptComputationRerun(owner, (fn) => {
    fn();
    for (const sym of Object.getOwnPropertySymbols(map)) map[sym]();
  });
}
function removeComputationUpdateObserver(owner, symbol) {
  const map = ComputationUpdateListeners.get(owner);
  if (map) delete map[symbol];
}
var SignalUpdateListeners = /* @__PURE__ */ new WeakMap();
function observeValueUpdate(node, onUpdate, symbol) {
  let map = SignalUpdateListeners.get(node);
  if (!map) {
    SignalUpdateListeners.set(node, map = /* @__PURE__ */ new Map());
    let value = node.value;
    Object.defineProperty(node, "value", {
      get: () => value,
      set: (newValue) => {
        for (const fn of map.values()) fn(newValue, value);
        value = newValue;
      }
    });
  }
  map.set(symbol, onUpdate);
}
function removeValueUpdateObserver(node, symbol) {
  SignalUpdateListeners.get(node)?.delete(symbol);
}
function makeValueUpdateListener(node, onUpdate, symbol) {
  observeValueUpdate(node, onUpdate, symbol);
  tryOnCleanup(() => removeValueUpdateObserver(node, symbol));
}

// packages/debugger/src/dependency/collect.ts
var $DGRAPH = Symbol("dependency-graph");
var Graph;
var VisitedSources;
var VisitedObservers;
var DepthMap;
var OnNodeUpdate;
function observeNodeUpdate(node, handler) {
  if (isSolidOwner(node)) observeComputationUpdate(node, handler, $DGRAPH);
  else observeValueUpdate(node, handler, $DGRAPH);
}
function unobserveNodeUpdate(node) {
  if (isSolidOwner(node)) removeComputationUpdateObserver(node, $DGRAPH);
  else removeValueUpdateObserver(node, $DGRAPH);
}
function addNodeToGraph(node) {
  const isOwner = isSolidOwner(node);
  const id = getSdtId(node, isOwner ? "OWNER" /* Owner */ : "SIGNAL" /* Signal */);
  if (Graph[id]) return;
  const onNodeUpdate = OnNodeUpdate;
  observeNodeUpdate(node, () => onNodeUpdate(id));
  Graph[id] = {
    name: getNodeName(node),
    type: getNodeType(node),
    depth: lookupDepth(node),
    sources: "sources" in node && node.sources ? node.sources.map(
      (n) => getSdtId(n, isSolidOwner(n) ? "OWNER" /* Owner */ : "SIGNAL" /* Signal */)
    ) : void 0,
    observers: "observers" in node && node.observers ? node.observers.map((n) => getSdtId(n, "OWNER" /* Owner */)) : void 0,
    graph: !isOwner && node.graph ? getSdtId(node.graph, "OWNER" /* Owner */) : void 0
  };
}
function visitSources(node) {
  let n = 0;
  if ("sources" in node && node.sources) {
    for (const source of node.sources) {
      const isOwner = isSolidOwner(source);
      if (isOwner && getOwnerType(source) === "REFRESH" /* Refresh */) continue;
      n++;
      if (VisitedSources.has(source)) continue;
      VisitedSources.add(source);
      if (isOwner && visitSources(source) === 0) {
        n--;
        continue;
      }
      addNodeToGraph(source);
    }
  }
  return n;
}
function visitObservers(node) {
  if ("observers" in node && node.observers) {
    for (const observer of node.observers) {
      if (VisitedObservers.has(observer) || getOwnerType(observer) === "REFRESH" /* Refresh */) {
        continue;
      }
      VisitedObservers.add(observer);
      addNodeToGraph(observer);
      visitObservers(observer);
    }
  }
}
function lookupDepth(node) {
  const id = getSdtId(node, isSolidOwner(node) ? "OWNER" /* Owner */ : "SIGNAL" /* Signal */);
  if (id in DepthMap) return DepthMap[id];
  let owner;
  if (!("owned" in node)) owner = node.graph;
  else if (!("fn" in node) && !node.owner) return 0;
  else owner = node.owner;
  return DepthMap[id] = owner ? lookupDepth(owner) + 1 : 0;
}
function collectDependencyGraph(node, config) {
  const graph = Graph = {};
  const visitedSources = VisitedSources = /* @__PURE__ */ new Set();
  const visitedObservers = VisitedObservers = /* @__PURE__ */ new Set();
  DepthMap = {};
  OnNodeUpdate = config.onNodeUpdate;
  addNodeToGraph(node);
  visitSources(node);
  visitObservers(node);
  const clearListeners = () => {
    visitedSources.forEach(unobserveNodeUpdate);
    visitedObservers.forEach(unobserveNodeUpdate);
    unobserveNodeUpdate(node);
  };
  Graph = VisitedObservers = VisitedSources = DepthMap = OnNodeUpdate = void 0;
  return { graph, clearListeners };
}

// packages/debugger/src/dependency/index.ts
function createDependencyGraph(props) {
  let clearListeners = null;
  const onNodeUpdate = (id) => {
    queueMicrotask(() => {
      if (!props.enabled()) return;
      props.onNodeUpdate(id);
      triggerInspect();
    });
  };
  const inspectedNode = s.createMemo(() => {
    const state = props.inspectedState();
    let node_raw = null;
    if (state.signalId) {
      node_raw = getObjectById(state.signalId, "SIGNAL" /* Signal */);
    } else if (state.ownerId) {
      node_raw = getObjectById(state.ownerId, "OWNER" /* Owner */);
    }
    if (node_raw != null) {
      return getNode(node_raw);
    }
    return null;
  });
  function inspectDGraph() {
    clearListeners?.();
    let node = inspectedNode();
    if (!props.enabled() || !node || node.kind === "ROOT" /* Root */ || node.kind === "COMPONENT" /* Component */ || node.kind === "CONTEXT" /* Context */) {
      clearListeners = null;
      props.emit(msg("DgraphUpdate", null));
      return;
    }
    const dgraph = collectDependencyGraph(node.data, {
      onNodeUpdate
    });
    clearListeners = dgraph.clearListeners;
    props.emit(msg("DgraphUpdate", dgraph.graph));
  }
  const triggerInspect = throttle(inspectDGraph, 200);
  s.createEffect(
    defer([props.enabled, inspectedNode], () => {
      queueMicrotask(inspectDGraph);
    })
  );
  return {
    onViewChange(_) {
      inspectDGraph();
    }
  };
}

// packages/debugger/src/inspector/index.ts
import * as s4 from "solid-js";
import { scheduleIdle as scheduleIdle2, throttle as throttle2 } from "@solid-primitives/scheduled";
import { msg as msg3, warn as warn3 } from "@solid-devtools/shared/utils";

// packages/debugger/src/main/roots.ts
import { warn } from "@solid-devtools/shared/utils";
var UNOWNED_ROOT = {
  cleanups: null,
  owned: null,
  context: null,
  owner: null,
  name: "UNOWNED",
  sdtType: "ROOT" /* Root */
};
var RootMap = /* @__PURE__ */ new Map();
var getCurrentRoots = () => RootMap.values();
var OnOwnerNeedsUpdate;
function setOnOwnerNeedsUpdate(fn) {
  OnOwnerNeedsUpdate = fn;
}
var OnRootRemoved;
function setOnRootRemoved(fn) {
  OnRootRemoved = fn;
}
function createTopRoot(owner) {
  const rootId = getSdtId(owner, "OWNER" /* Owner */);
  RootMap.set(rootId, owner);
  OnOwnerNeedsUpdate?.(owner, rootId);
}
function cleanupRoot(root) {
  const rootId = getSdtId(root, "OWNER" /* Owner */);
  root.isDisposed = true;
  changeRootAttachment(root, null);
  const wasTarcked = RootMap.delete(rootId);
  if (wasTarcked) OnRootRemoved?.(rootId);
}
function changeRootAttachment(root, newParent) {
  let topRoot;
  if (root.attachedTo) {
    root.attachedTo.sdtSubRoots.splice(root.attachedTo.sdtSubRoots.indexOf(root), 1);
    topRoot = getTopRoot(root.attachedTo);
    if (topRoot) OnOwnerNeedsUpdate?.(root.attachedTo, getSdtId(topRoot, "OWNER" /* Owner */));
  }
  if (newParent) {
    root.attachedTo = newParent;
    if (newParent.sdtSubRoots) newParent.sdtSubRoots.push(root);
    else newParent.sdtSubRoots = [root];
    if (topRoot === void 0) topRoot = getTopRoot(newParent);
    if (topRoot) OnOwnerNeedsUpdate?.(newParent, getSdtId(topRoot, "OWNER" /* Owner */));
  } else {
    delete root.attachedTo;
  }
}
function attachDebugger(owner = setup_default.solid.getOwner()) {
  if (!owner)
    return warn("reatachOwner helper should be called synchronously in a reactive owner.");
  const roots = [];
  let isFirstTopLevel = true;
  while (owner) {
    if (isSolidRoot(owner)) {
      if (owner.isDisposed) return;
      if (RootMap.has(getSdtId(owner, "OWNER" /* Owner */))) {
        isFirstTopLevel = false;
        break;
      }
      roots.push(owner);
    }
    owner = owner.owner;
  }
  for (let i = roots.length - 1; i >= 0; i--) {
    const root = roots[i];
    root.sdtType = "ROOT" /* Root */;
    onOwnerCleanup(root, () => cleanupRoot(root), true);
    const isTopLevel = isFirstTopLevel && i === 0;
    if (isTopLevel) {
      createTopRoot(root);
      return;
    }
    let parent = findClosestAliveParent(root);
    if (!parent.owner) return warn("Parent owner is missing.");
    changeRootAttachment(root, parent.owner);
    const onParentCleanup2 = () => {
      const newParent = findClosestAliveParent(root);
      changeRootAttachment(root, newParent.owner);
      if (newParent.owner) {
        parent = newParent;
        onOwnerCleanup(parent.root, onParentCleanup2);
      } else {
        removeOwnCleanup();
        createTopRoot(root);
      }
    };
    const removeParentCleanup = onOwnerCleanup(parent.root, onParentCleanup2);
    const removeOwnCleanup = onOwnerCleanup(root, removeParentCleanup);
  }
}
function initRoots() {
  attachDebugger(UNOWNED_ROOT);
  for (const e of setup_default.get_created_owners()) {
    attachDebugger(e);
  }
  setup_default.solid.hooks.afterCreateOwner = function(owner) {
    if (isSolidRoot(owner)) {
      attachDebugger(owner);
    }
  };
}
function getTopRoot(owner) {
  let root = null;
  do {
    if (isSolidRoot(owner) && !owner.isDisposed) root = owner;
    owner = owner.owner;
  } while (owner);
  return root;
}
function findClosestAliveParent(owner) {
  let disposed = null;
  let closestAliveRoot = null;
  let current = owner;
  while (current.owner && !closestAliveRoot) {
    current = current.owner;
    if (isSolidRoot(current)) {
      if (current.isDisposed) disposed = current;
      else closestAliveRoot = current;
    }
  }
  if (!closestAliveRoot) return { owner: null, root: null };
  return { owner: (disposed ?? owner).owner, root: closestAliveRoot };
}

// packages/debugger/src/inspector/inspector.ts
import { misc } from "@nothing-but/utils";

// packages/debugger/src/locator/index.ts
import * as s3 from "solid-js";
import { defer as defer2 } from "@solid-primitives/utils";
import { makeEventListener } from "@solid-primitives/event-listener";
import { createKeyHold } from "@solid-primitives/keyboard";
import { scheduleIdle } from "@solid-primitives/scheduled";
import { msg as msg2, warn as warn2 } from "@solid-devtools/shared/utils";

// packages/debugger/src/structure/walker.ts
import { untrackedCallback } from "@solid-devtools/shared/primitives";
var makeComponentRegistry = (eli) => {
  return {
    eli,
    components: /* @__PURE__ */ new Map(),
    element_nodes: /* @__PURE__ */ new Map()
  };
};
var clearComponentRegistry = (r) => {
  for (let component of r.components.values()) component.cleanup();
  r.components.clear();
  r.element_nodes.clear();
};
var cleanupComponent = (r, nodeID) => {
  let component = r.components.get(nodeID);
  if (component != null) {
    component.cleanup();
    r.components.delete(nodeID);
    for (let element of component.element_nodes) {
      r.element_nodes.delete(element);
    }
  }
};
var $CLEANUP = Symbol("component-registry-cleanup");
var registerComponent = (r, owner, id, name, elements) => {
  if (elements == null) {
    cleanupComponent(r, id);
    return;
  }
  let set = new Set(elements);
  let existing = r.components.get(id);
  if (existing != null) {
    existing.elements = set;
    return;
  }
  let cleanup = onOwnerCleanup(owner, () => cleanupComponent(r, id), false, $CLEANUP);
  r.components.set(id, {
    id,
    owner,
    name,
    elements: set,
    element_nodes: /* @__PURE__ */ new Set(),
    cleanup
  });
};
var registerElement = (r, componentId, elementId, element) => {
  let component = r.components.get(componentId);
  if (!component) return;
  component.element_nodes.add(elementId);
  r.element_nodes.set(elementId, { el: element, component });
};
var getComponent = (r, id) => {
  let component = r.components.get(id);
  if (component) return {
    name: component.name,
    elements: [...component.elements].map((el) => el),
    id
  };
  let elData = r.element_nodes.get(id);
  return elData ? { name: elData.component.name, id: elData.component.id, elements: [elData.el] } : null;
};
var findComponent = (r, el) => {
  let including = /* @__PURE__ */ new Map();
  for (let curr = el; curr != null && including.size === 0; ) {
    for (let comp of r.components.values()) {
      for (let comp_el of comp.elements) {
        if (comp_el === curr) {
          including.set(comp.owner, comp);
        }
      }
    }
    curr = r.eli.getParent(curr);
  }
  if (including.size > 1) {
    for (let owner of including.keys()) {
      if (including.has(owner)) {
        for (let curr = owner.owner; curr != null; ) {
          if (including.delete(curr)) break;
          curr = curr.owner;
        }
      }
    }
  }
  return including.values().next().value ?? null;
};
var ElementsMap = /* @__PURE__ */ new Map();
var $WALKER = Symbol("tree-walker");
function observeComputation(comp, owner_to_update, config) {
  let was_leaf = !comp.owned || comp.owned.length === 0;
  let { rootId, onUpdate: onComputationUpdate, mode } = config;
  const handler = () => {
    let is_leaf = !comp.owned || comp.owned.length === 0;
    let changed_structure = was_leaf !== is_leaf || !is_leaf || mode === "dom" /* DOM */;
    was_leaf = is_leaf;
    onComputationUpdate(rootId, owner_to_update, changed_structure);
  };
  observeComputationUpdate(comp, handler, $WALKER);
}
function resolveElements(value, eli, list = []) {
  pushResolvedElements(list, value, eli);
  return list;
}
function pushResolvedElements(list, value, eli) {
  if (value != null) {
    switch (typeof value) {
      case "function":
        if (value.length === 0 && value.name === "bound readSignal") {
          pushResolvedElements(list, value(), eli);
        }
        break;
      case "object":
        if (Array.isArray(value)) {
          for (let item of value) {
            pushResolvedElements(list, item, eli);
          }
        } else if (eli.isElement(value)) {
          list.push(value);
        }
        break;
    }
  }
}
var MappedOwnerNode;
var AddedToParentElements = false;
function mapElements(els, parent_children, eli, out = []) {
  els: for (let el of els) {
    if (!eli.isElement(el)) continue;
    if (parent_children) {
      let to_check = [parent_children];
      let index = 0;
      let el_nodes = to_check[index++];
      while (el_nodes) {
        for (let i = 0; i < el_nodes.length; i++) {
          let el_node = el_nodes[i];
          let el_node_data = ElementsMap.get(el_node);
          if (el_node_data && el_node_data.el === el) {
            if (AddedToParentElements) {
              el_nodes.splice(i, 1);
            } else {
              el_nodes[i] = MappedOwnerNode;
              AddedToParentElements = true;
            }
            out.push(el_node);
            el_node_data.component = MappedOwnerNode;
            continue els;
          }
          if (el_node.children.length) to_check.push(el_node.children);
        }
        el_nodes = to_check[index++];
      }
    }
    let el_json = {
      id: getSdtId(el, "ELEMENT" /* Element */),
      type: "ELEMENT" /* Element */,
      name: eli.getName(el) ?? UNKNOWN,
      children: []
    };
    out.push(el_json);
    ElementsMap.set(el_json, { el, component: MappedOwnerNode });
    mapElements(eli.getChildren(el), parent_children, eli, el_json.children);
  }
  return out;
}
function mapChildren(owner, owner_map, config, children = []) {
  for (let child of owner_each_child(owner)) {
    if (config.mode === "owners" /* Owners */ || markOwnerType(child) === "COMPONENT" /* Component */) {
      unwrap_append(children, mapOwner(child, owner_map, config));
    } else {
      if (isSolidComputation(child)) {
        observeComputation(child, owner, config);
      }
      mapChildren(child, owner_map, config, children);
    }
  }
  return children;
}
function mapOwner(owner, parent, config) {
  let id = getSdtId(owner, "OWNER" /* Owner */);
  let type = markOwnerType(owner);
  let name = getNodeName(owner);
  let mapped = { id, type, name, children: [] };
  let resolved_els;
  if (type === "COMPONENT" /* Component */) {
    let first_owned;
    if (name === "provider" && owner.owned && owner.owned.length === 1 && markOwnerType(first_owned = owner.owned[0]) === "CONTEXT" /* Context */) {
      return mapOwner(first_owned, parent, config);
    }
    resolved_els = resolveElements(owner.value, config.eli);
    registerComponent(config.registry, owner, id, name, resolved_els);
    let refresh = getComponentRefreshNode(owner);
    if (refresh) {
      mapped.hmr = true;
      owner = refresh;
    }
  } else if (isSolidComputation(owner)) {
    observeComputation(owner, owner, config);
    if (type != "CONTEXT" /* Context */ && (!owner.sources || owner.sources.length === 0)) {
      mapped.frozen = true;
    }
  }
  AddedToParentElements = false;
  MappedOwnerNode = mapped;
  if (config.mode === "dom" /* DOM */) {
    resolved_els ??= resolveElements(owner.value, config.eli);
    mapElements(resolved_els, parent?.children, config.eli, mapped.children);
  }
  let addedToParent = AddedToParentElements;
  mapChildren(owner, mapped, config, mapped.children);
  return addedToParent ? void 0 : mapped;
}
var walkSolidTree = /* @__PURE__ */ untrackedCallback(function(owner, config) {
  const r = mapOwner(owner, null, config);
  if (config.mode === "dom" /* DOM */) {
    for (let [elNode, { el, component }] of ElementsMap) {
      registerElement(config.registry, component.id, elNode.id, el);
    }
    ElementsMap.clear();
  }
  return r;
});

// packages/debugger/src/locator/element-overlay.tsx
import { template as _$template } from "solid-js/web";
import { createComponent as _$createComponent } from "solid-js/web";
import { className as _$className } from "solid-js/web";
import { effect as _$effect } from "solid-js/web";
import { insert as _$insert } from "solid-js/web";
import * as s2 from "solid-js";
import * as sweb from "solid-js/web";
import { createRootPool } from "@solid-primitives/rootless";
var _tmpl$ = /* @__PURE__ */ _$template(`<style>`);
var _tmpl$2 = /* @__PURE__ */ _$template(`<div><div class=name-animated-container><div class=name-background></div><div class=name-text>: <span></span></div><div class=name-invisible>: `);
var _tmpl$3 = /* @__PURE__ */ _$template(`<div class=element-overlay><div class=border>`);
var _tmpl$4 = /* @__PURE__ */ _$template(`<div data-darkreader-ignore>`);
function createElementsOverlay(selected, eli) {
  const useElementOverlay = createRootPool((componentRaw, active) => {
    const component = () => active() ? componentRaw() : null;
    const name = () => component()?.name;
    const rect = s2.createMemo((prev) => {
      let comp = component();
      if (comp === null) return prev;
      let rect2 = eli.getRect(comp.element);
      if (rect2 === null) return prev;
      return rect2;
    }, {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
    const transform = () => `translate(${Math.round(rect().x)}px, ${Math.round(rect().y)}px)`;
    const placeOnTop = () => rect().y > window.innerHeight / 2;
    const tag = () => {
      let comp = component();
      if (comp === null) return UNKNOWN;
      return eli.getName(comp.element) ?? UNKNOWN;
    };
    return [(() => {
      var _el$ = _tmpl$();
      _$insert(_el$, styles);
      return _el$;
    })(), (() => {
      var _el$2 = _tmpl$3(), _el$3 = _el$2.firstChild;
      _$insert(_el$2, _$createComponent(s2.Show, {
        get when() {
          return name();
        },
        get children() {
          var _el$4 = _tmpl$2(), _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, _el$8 = _el$7.firstChild, _el$9 = _el$8.nextSibling, _el$10 = _el$7.nextSibling, _el$11 = _el$10.firstChild;
          _$insert(_el$7, name, _el$8);
          _$insert(_el$9, tag);
          _$insert(_el$10, name, _el$11);
          _$insert(_el$10, tag, null);
          _$effect(() => _$className(_el$4, `name-container ${placeOnTop() ? "top" : "bottom"}`));
          return _el$4;
        }
      }), null);
      _$effect((_p$) => {
        var _v$ = transform(), _v$2 = rect().width + "px", _v$3 = rect().height + "px";
        _v$ !== _p$.e && ((_p$.e = _v$) != null ? _el$2.style.setProperty("transform", _v$) : _el$2.style.removeProperty("transform"));
        _v$2 !== _p$.t && ((_p$.t = _v$2) != null ? _el$2.style.setProperty("width", _v$2) : _el$2.style.removeProperty("width"));
        _v$3 !== _p$.a && ((_p$.a = _v$3) != null ? _el$2.style.setProperty("height", _v$3) : _el$2.style.removeProperty("height"));
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      });
      return _el$2;
    })()];
  });
  const owner = s2.getOwner();
  setTimeout(() => {
    s2.runWithOwner(owner, () => _$createComponent(sweb.Portal, {
      useShadow: true,
      get mount() {
        return document.documentElement;
      },
      get children() {
        var _el$12 = _tmpl$4();
        _$insert(_el$12, () => selected().map(useElementOverlay));
        return _el$12;
      }
    }));
  }, 1e3);
}
var styles = (
  /*css*/
  `
.element-overlay {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  pointer-events: none;
  transition-duration: 100ms;
  transition-property: transform, width, height;
  --color: 14 116 144;
}
.border {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid rgb(var(--color) / 0.8);
  background-color: rgb(var(--color) / 0.3);
  border-radius: 0.25rem;
}
.name-container {
  position: absolute;
  z-index: 10000;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  color: white;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1rem;
}
.name-container.bottom {
  top: 100%;
}
.name-container.top {
  bottom: 100%;
}
.name-animated-container {
  position: relative;
  margin: 0.5rem auto;
  padding: 0.25rem 0.5rem;
}
.name-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(var(--color) / 0.8);
  border-radius: 0.25rem;
}
.name-text {
  position: absolute;
}
.name-text span {
  color: #a5f3fc;
}
.name-invisible {
  visibility: hidden;
  width: max-content;
}
`
);

// packages/debugger/src/locator/index.ts
function makeHoverElementListener(eli, onHover) {
  let last = null;
  makeEventListener(window, "mouseover", (e) => {
    let el = eli.getElementAt(e);
    if (el !== last) {
      onHover(last = el);
    }
  });
  makeEventListener(document, "mouseleave", () => {
    if (null !== last) {
      onHover(last = null);
    }
  });
}
function createLocator(props) {
  const [enabledByPressingSignal, setEnabledByPressingSignal] = s3.createSignal(() => false);
  props.setLocatorEnabledSignal(s3.createMemo(() => enabledByPressingSignal()()));
  const [hoverTarget, setHoverTarget] = s3.createSignal(null);
  const [devtoolsTarget, setDevtoolsTarget] = s3.createSignal(null);
  const [highlightedComponents, setHighlightedComponents] = s3.createSignal([]);
  function getLocatorComponentFromElement(el) {
    let comp = findComponent(props.component_registry, el);
    return comp && {
      location: props.component_registry.eli.getLocation(el),
      element: el,
      id: comp.id,
      name: comp.name
    };
  }
  const target = s3.createMemo(() => {
    let hover = hoverTarget();
    return hover != null ? {
      type: "hover",
      element: hover
    } : devtoolsTarget();
  }, void 0, {
    equals: (a, b) => {
      if (a === b) return true;
      if (a == null && b == null) return true;
      if (a == null || b == null) return false;
      if (a.type !== b.type) return false;
      switch (a.type) {
        case "hover":
          return a.element === b.element;
        case "node":
          return a.id === b.id;
        case "element":
          return a.id === b.id;
      }
    }
  });
  s3.createEffect(defer2(target, scheduleIdle((target2) => {
    let locator_components = [];
    if (target2 != null) {
      switch (target2.type) {
        case "hover": {
          unwrap_append(locator_components, getLocatorComponentFromElement(target2.element));
          break;
        }
        case "element": {
          let element = getObjectById(target2.id, "ELEMENT" /* Element */);
          if (element != null) {
            unwrap_append(locator_components, getLocatorComponentFromElement(element));
          }
          break;
        }
        case "node": {
          let comp = getComponent(props.component_registry, target2.id);
          if (comp != null) {
            for (let el of comp.elements) {
              locator_components.push({
                element: el,
                id: comp.id,
                name: comp.name
              });
            }
          }
        }
      }
    }
    setHighlightedComponents(locator_components);
  })));
  createElementsOverlay(highlightedComponents, props.component_registry.eli);
  s3.createEffect((prev) => {
    const target2 = hoverTarget();
    const comp = target2 && findComponent(props.component_registry, target2);
    if (prev) {
      props.emit(msg2("HoveredComponent", { nodeId: prev, state: false }));
    }
    if (comp) {
      const { id } = comp;
      props.emit(msg2("HoveredComponent", { nodeId: id, state: true }));
      return id;
    }
  });
  let target_ide;
  s3.createEffect(() => {
    if (!props.locatorEnabled()) return;
    makeHoverElementListener(props.component_registry.eli, (el) => setHoverTarget(() => el));
    s3.onCleanup(() => setHoverTarget(null));
    makeEventListener(window, "click", (e) => {
      let el = props.component_registry.eli.getElementAt(e);
      if (el == null) {
        return;
      }
      let comp = getLocatorComponentFromElement(el);
      if (comp == null) {
        return;
      }
      let source_code_data = comp.location ? getSourceCodeData(comp.location) : null;
      props.onComponentClick(comp.id, () => {
        if (target_ide == null || source_code_data == null) return;
        e.preventDefault();
        e.stopPropagation();
        openSourceCode(target_ide, source_code_data);
      });
    }, true);
  });
  let locatorUsed = false;
  const owner = s3.getOwner();
  function useLocator(options) {
    s3.runWithOwner(owner, () => {
      if (locatorUsed) return warn2("useLocator can be called only once.");
      locatorUsed = true;
      if (options.targetIDE) target_ide = options.targetIDE;
      if (options.key !== false) {
        const isHoldingKey = createKeyHold(options.key ?? "Alt", { preventDefault: true });
        setEnabledByPressingSignal(() => isHoldingKey);
      }
    });
  }
  let locator_options = setup_default.get_locator_options();
  if (locator_options) {
    useLocator(locator_options);
  }
  return {
    useLocator,
    setDevtoolsHighlightTarget(target2) {
      setDevtoolsTarget(target2);
    },
    openElementSourceCode(location) {
      if (!target_ide) return warn2("Please set `targetIDE` it in useLocator options.");
      const projectPath = getProjectPath();
      if (!projectPath) return warn2("projectPath is not set.");
      openSourceCode(target_ide, {
        ...location,
        projectPath
      });
    }
  };
}

// packages/debugger/src/inspector/serialize.ts
import "@solid-primitives/utils";
var Deep;
var List;
var Seen;
var InStore;
var HandleStore;
var IgnoreNextSeen;
var encodeNonObject = (value) => {
  switch (typeof value) {
    case "number":
      if (value === Infinity) return ["number" /* Number */, INFINITY];
      if (value === -Infinity) return ["number" /* Number */, NEGATIVE_INFINITY];
      if (isNaN(value)) return ["number" /* Number */, NAN];
      return ["number" /* Number */, value];
    case "boolean":
      return ["boolean" /* Boolean */, value];
    case "string":
      return ["string" /* String */, value];
    case "symbol":
      return ["symbol" /* Symbol */, value.description || ""];
    case "function":
      return ["function" /* Function */, value.name];
    case "object":
      return ["null" /* Null */, null];
    case "bigint":
    case "undefined":
      return ["null" /* Null */, UNDEFINED];
  }
};
function encode(value, eli) {
  const ignoreNextStore = IgnoreNextSeen;
  if (ignoreNextStore) IgnoreNextSeen = false;
  else {
    const seen = Seen.get(value);
    if (seen !== void 0) return seen;
  }
  if (!value || typeof value !== "object") {
    const index2 = List.push(encodeNonObject(value)) - 1;
    Seen.set(value, index2);
    return index2;
  }
  const encoded = [];
  const index = List.push(encoded) - 1;
  ignoreNextStore || Seen.set(value, index);
  if (eli.isElement(value)) {
    ;
    encoded[0] = "element" /* Element */;
    let id = getSdtId(value, "ELEMENT" /* Element */);
    let name = eli.getName(value);
    encoded[1] = `${id}:${name}`;
  } else if (!ignoreNextStore && isStoreNode(value)) {
    const node = setup_default.store.unwrap(value);
    if (node !== value) Seen.set(node, index);
    const id = getSdtId(node, "STORE_NODE" /* StoreNode */);
    !InStore && HandleStore && HandleStore(node, id);
    const wasInStore = InStore;
    InStore = IgnoreNextSeen = true;
    encoded[0] = "store" /* Store */;
    encoded[1] = `${id}:${encode(node, eli)}`;
    InStore = wasInStore;
  } else if (Array.isArray(value)) {
    ;
    encoded[0] = "array" /* Array */;
    if (Deep) {
      let data = Array(value.length);
      for (let i = 0; i < value.length; i++) {
        data[i] = encode(value[i], eli);
      }
      ;
      encoded[1] = data;
    } else {
      ;
      encoded[1] = value.length;
    }
  } else {
    const name = Object.prototype.toString.call(value).slice(8, -1);
    if (name === "Object") {
      ;
      encoded[0] = "object" /* Object */;
      if (Deep) {
        const data = encoded[1] = {};
        for (const [key, descriptor] of Object.entries(
          Object.getOwnPropertyDescriptors(value)
        )) {
          data[key] = descriptor.get ? -1 : encode(descriptor.value, eli);
        }
      } else {
        ;
        encoded[1] = Object.keys(value).length;
      }
    } else {
      ;
      encoded[0] = "instance" /* Instance */;
      encoded[1] = name;
    }
  }
  return index;
}
function encodeValue(value, deep, eli, handleStore, inStore = false) {
  Deep = deep;
  List = [];
  Seen = /* @__PURE__ */ new Map();
  InStore = inStore;
  HandleStore = handleStore;
  encode(value, eli);
  const result = List;
  Deep = List = Seen = HandleStore = InStore = void 0;
  return result;
}

// packages/debugger/src/inspector/inspector.ts
var ValueNode = class {
  constructor(getValue) {
    this.getValue = getValue;
  }
  trackedStores = [];
  selected = false;
  addStoreObserver(unsub) {
    this.trackedStores.push(unsub);
  }
  unsubscribe() {
    for (const unsub of this.trackedStores) unsub();
    this.trackedStores = [];
  }
  reset() {
    this.unsubscribe();
    this.selected = false;
  }
  isSelected() {
    return this.selected;
  }
  setSelected(selected) {
    this.selected = selected;
    if (!selected) this.unsubscribe();
  }
};
var ValueNodeMap = class {
  record = {};
  get(id) {
    return this.record[id];
  }
  add(id, getValue) {
    this.record[id] = new ValueNode(getValue);
  }
  reset() {
    for (const signal of Object.values(this.record)) signal.reset();
  }
};
var $NOT_SET = Symbol("not-set");
var ObservedProps = class {
  constructor(props) {
    this.props = props;
  }
  onPropStateChange;
  onValueUpdate;
  observedGetters = {};
  observe(onPropStateChange, onValueUpdate) {
    this.onPropStateChange = onPropStateChange;
    this.onValueUpdate = onValueUpdate;
  }
  unobserve() {
    this.onPropStateChange = void 0;
    this.onValueUpdate = void 0;
  }
  observeProp(key, id, get) {
    if (this.observedGetters[key]) {
      const o2 = this.observedGetters[key];
      return { getValue: () => o2.v, isStale: o2.n === 0 };
    }
    const self = this;
    const o = this.observedGetters[key] = {
      v: $NOT_SET,
      n: 0
    };
    Object.defineProperty(this.props, key, {
      get() {
        const value = get();
        if (setup_default.solid.getListener()) {
          onCleanup(
            () => --o.n === 0 && self.onPropStateChange?.(key, "stale" /* Stale */)
          );
        }
        ++o.n === 1 && self.onPropStateChange?.(key, "live" /* Live */);
        if (value !== o.v) self.onValueUpdate?.(id);
        return o.v = value;
      },
      enumerable: true
    });
    return { getValue: () => o.v, isStale: true };
  }
};
var compareProxyPropKeys = (oldKeys, newKeys) => {
  const added = new Set(newKeys);
  const removed = [];
  let changed = false;
  for (const key of oldKeys) {
    if (added.has(key)) added.delete(key);
    else {
      changed = true;
      removed.push(key);
    }
  }
  if (!changed && !added.size) return null;
  return { added: Array.from(added), removed };
};
function clearOwnerObservers(owner, observedPropsMap) {
  if (isSolidComputation(owner)) {
    removeValueUpdateObserver(owner, $INSPECTOR);
    if (isSolidComponent(owner)) {
      observedPropsMap.get(owner.props)?.unobserve();
    }
  }
  if (owner.sourceMap) {
    for (const node of Object.values(owner.sourceMap))
      removeValueUpdateObserver(node, $INSPECTOR);
  }
  if (owner.owned) {
    for (const node of owner.owned) removeValueUpdateObserver(node, $INSPECTOR);
  }
}
var ValueMap;
var OnValueUpdate;
var OnPropStateChange;
var PropsMap;
var $INSPECTOR = Symbol("inspector");
function mapSourceValue(node_raw, handler, eli) {
  let node = getNode(node_raw);
  let { value } = node_raw;
  let id;
  switch (node.kind) {
    case "MEMO" /* Memo */:
      id = getSdtId(node.data, "OWNER" /* Owner */);
      break;
    case "SIGNAL" /* Signal */:
      id = getSdtId(node.data, "SIGNAL" /* Signal */);
      break;
    case "STORE" /* Store */:
      id = getSdtId(node.data, "STORE" /* Store */);
      break;
    case "CUSTOM_VALUE" /* CustomValue */:
      id = getSdtId(node.data, "CUSTOM_VALUE" /* CustomValue */);
      break;
    default:
      return null;
  }
  ValueMap.add(`${"signal" /* Signal */}:${id}`, () => node_raw.value);
  if (node.kind === "MEMO" /* Memo */ || node.kind === "SIGNAL" /* Signal */) {
    observeValueUpdate(node.data, (v) => handler(id, v), $INSPECTOR);
  }
  return {
    type: node.kind,
    name: getNodeName(node.data),
    id,
    value: encodeValue(value, false, eli)
  };
}
function mapProps(props, eli) {
  const isProxy = !!props[setup_default.solid.$PROXY];
  const record = {};
  let checkProxyProps;
  if (isProxy) {
    let propsKeys = Object.keys(props);
    for (const key of propsKeys) record[key] = { getter: "stale" /* Stale */, value: null };
    checkProxyProps = () => {
      const _oldKeys = propsKeys;
      return compareProxyPropKeys(_oldKeys, propsKeys = Object.keys(props));
    };
  } else {
    let observed = PropsMap.get(props);
    if (!observed) PropsMap.set(props, observed = new ObservedProps(props));
    observed.observe(OnPropStateChange, OnValueUpdate);
    for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(props))) {
      const id = `prop:${key}`;
      if (desc.get) {
        const { getValue, isStale } = observed.observeProp(key, id, desc.get);
        ValueMap.add(id, getValue);
        const lastValue = getValue();
        record[key] = {
          getter: isStale ? "stale" /* Stale */ : "live" /* Live */,
          value: lastValue !== $NOT_SET ? encodeValue(getValue(), false, eli) : null
        };
      } else {
        record[key] = {
          getter: false,
          value: encodeValue(desc.value, false, eli)
        };
        if (Array.isArray(desc.value) || misc.is_plain_object(desc.value))
          ValueMap.add(id, () => desc.value);
      }
    }
  }
  return { props: { proxy: isProxy, record }, checkProxyProps };
}
function collectOwnerDetails(owner, config) {
  const { onValueUpdate, eli } = config;
  ValueMap = new ValueNodeMap();
  OnValueUpdate = onValueUpdate;
  OnPropStateChange = config.onPropStateChange;
  PropsMap = config.observedPropsMap;
  const id = getSdtId(owner, "OWNER" /* Owner */);
  const type = markOwnerType(owner);
  let { sourceMap, owned } = owner;
  let getValue = () => owner.value;
  const details = { id, name: getNodeName(owner), type, signals: [] };
  if (type === "CONTEXT" /* Context */) {
    sourceMap = void 0;
    owned = null;
    const symbols = Object.getOwnPropertySymbols(owner.context);
    const context_value = owner.context[symbols[symbols.length - 1]];
    getValue = () => context_value;
  }
  let checkProxyProps;
  if (isSolidComputation(owner)) {
    if (isSolidComponent(owner)) {
      const refresh = getComponentRefreshNode(owner);
      if (refresh) {
        sourceMap = refresh.sourceMap;
        owned = refresh.owned;
        getValue = () => refresh.value;
        details.hmr = true;
      }
      ;
      ({ checkProxyProps, props: details.props } = mapProps(owner.props, eli));
      let location;
      if ((location = owner.sdtLocation) && typeof location === "string" && (location = parseLocationString(location)) || (location = owner.component.location) && typeof location === "string" && (location = parseLocationString(location))) {
        details.location = location;
      }
    } else {
      observeValueUpdate(owner, () => onValueUpdate("value" /* Value */), $INSPECTOR);
    }
    details.value = encodeValue(getValue(), false, eli);
  }
  const onSignalUpdate = (signalId) => onValueUpdate(`${"signal" /* Signal */}:${signalId}`);
  if (sourceMap) for (let signal of sourceMap) {
    let mapped = mapSourceValue(signal, onSignalUpdate, eli);
    if (mapped) details.signals.push(mapped);
  }
  if (owned) for (let node of owned) {
    let mapped = mapSourceValue(node, onSignalUpdate, eli);
    if (mapped) details.signals.push(mapped);
  }
  if (owner === UNOWNED_ROOT) {
    for (let signal_ref of setup_default.unowned.signals) {
      let signal = signal_ref.deref();
      if (signal == null) continue;
      let mapped = mapSourceValue(signal, onSignalUpdate, eli);
      if (mapped == null) continue;
      details.signals.push(mapped);
    }
  }
  ValueMap.add("value" /* Value */, getValue);
  const result = {
    details,
    valueMap: ValueMap,
    checkProxyProps
  };
  ValueMap = OnValueUpdate = OnPropStateChange = PropsMap = void 0;
  return result;
}

// packages/debugger/src/inspector/store.ts
var Nodes = /* @__PURE__ */ new WeakMap();
var OnNodeUpdate2 = null;
function setOnStoreNodeUpdate(fn) {
  OnNodeUpdate2 = fn;
}
setup_default.store.hooks.onStoreNodeUpdate = (node, property, value, prev) => {
  if (!OnNodeUpdate2 || !Nodes.has(node) || typeof property === "symbol") return;
  property = property.toString();
  const storeProperty = `${getSdtId(
    node,
    "STORE_NODE" /* StoreNode */
  )}:${property}`;
  if (property === "length" && typeof value === "number" && Array.isArray(node)) {
    return OnNodeUpdate2(storeProperty, value);
  }
  setup_default.store.isWrappable(prev) && untrackStore(prev, storeProperty);
  if (value === void 0) {
    OnNodeUpdate2(storeProperty, void 0);
  } else {
    OnNodeUpdate2(storeProperty, { value });
    setup_default.store.isWrappable(value) && trackStore(value, storeProperty);
  }
};
function observeStoreNode(rootNode) {
  rootNode = setup_default.store.unwrap(rootNode);
  const symbol = Symbol("inspect-store");
  trackStore(rootNode, symbol);
  return () => untrackStore(rootNode, symbol);
}
function trackStore(node, parent) {
  const data = Nodes.get(node);
  if (data) data.add(parent);
  else {
    Nodes.set(node, /* @__PURE__ */ new Set([parent]));
    const id = getSdtId(node, "STORE_NODE" /* StoreNode */);
    forEachStoreProp(node, (key, child) => trackStore(child, `${id}:${key}`));
  }
}
function untrackStore(node, parent) {
  const data = Nodes.get(node);
  if (data && data.delete(parent)) {
    data.size === 0 && Nodes.delete(node);
    const id = getSdtId(node, "STORE_NODE" /* StoreNode */);
    forEachStoreProp(node, (key, child) => untrackStore(child, `${id}:${key}`));
  }
}
function forEachStoreProp(node, fn) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const child = node[i];
      setup_default.store.isWrappable(child) && fn(i.toString(), child);
    }
  } else {
    for (const key in node) {
      const { value, get } = Object.getOwnPropertyDescriptor(node, key);
      if (!get && setup_default.store.isWrappable(value)) fn(key, value);
    }
  }
}

// packages/debugger/src/inspector/index.ts
function createInspector(props) {
  let lastDetails;
  let inspectedOwner;
  let valueMap = new ValueNodeMap();
  const propsMap = /* @__PURE__ */ new WeakMap();
  let checkProxyProps;
  function getValue(id) {
    return valueMap.get(id)?.getValue?.();
  }
  window[GLOBAL_GET_VALUE] = getValue;
  const { pushPropState, pushValueUpdate, pushInspectToggle, triggerPropsCheck, clearUpdates } = (() => {
    const valueUpdates = /* @__PURE__ */ new Map();
    let storeUpdates = [];
    let checkProps = false;
    let propStates = {};
    const flush = scheduleIdle2(() => {
      const batchedUpdates = [];
      for (const [id, toggleChange] of valueUpdates) {
        const node = valueMap.get(id);
        if (!node || !node.getValue) continue;
        const selected = node.isSelected();
        const encoded = encodeValue(
          node.getValue(),
          selected,
          setup_default.eli,
          selected && ((storeNode) => node.addStoreObserver(observeStoreNode(storeNode)))
        );
        batchedUpdates.push([
          toggleChange === null ? "value" : "inspectToggle",
          [id, encoded]
        ]);
      }
      valueUpdates.clear();
      for (const [storeProperty, data] of storeUpdates)
        batchedUpdates.push([
          "store",
          [
            storeProperty,
            typeof data === "object" ? encodeValue(data.value, true, setup_default.eli, void 0, true) : data ?? null
          ]
        ]);
      storeUpdates = [];
      if (checkProps && checkProxyProps) {
        const keys = checkProxyProps();
        if (keys) batchedUpdates.push(["propKeys", keys]);
        checkProps = false;
      }
      if (Object.keys(propStates).length) {
        batchedUpdates.push(["propState", propStates]);
        propStates = {};
      }
      if (batchedUpdates.length) {
        props.emit(msg3("InspectorUpdate", batchedUpdates));
      }
    });
    const flushPropsCheck = throttle2(flush, 200);
    setOnStoreNodeUpdate((...payload) => {
      storeUpdates.push(payload);
      flush();
    });
    return {
      pushValueUpdate(id) {
        valueUpdates.set(id, null);
        flush();
      },
      pushInspectToggle(id, selected) {
        const current = valueUpdates.get(id);
        if (current === selected || current === null) return;
        else if (current === !selected) valueUpdates.delete(id);
        else valueUpdates.set(id, selected);
        flush();
      },
      triggerPropsCheck() {
        checkProps = true;
        flushPropsCheck();
      },
      pushPropState(key, state) {
        propStates[key] = state;
        flush();
      },
      // since the updates are emitten on timeout, we need to make sure that
      // switching off the debugger or unselecting the owner will clear the updates
      clearUpdates() {
        valueUpdates.clear();
        storeUpdates = [];
        checkProps = false;
        flush.clear();
        flushPropsCheck.clear();
      }
    };
  })();
  let clearPrevDisposeListener;
  function inspectOwnerId(id) {
    const owner = id && getObjectById(id, "OWNER" /* Owner */);
    if (inspectedOwner) clearOwnerObservers(inspectedOwner, propsMap);
    inspectedOwner = owner;
    valueMap.reset();
    clearUpdates();
    if (owner) {
      const result = collectOwnerDetails(owner, {
        onValueUpdate: pushValueUpdate,
        onPropStateChange: pushPropState,
        observedPropsMap: propsMap,
        eli: setup_default.eli
      });
      props.emit(msg3("InspectedNodeDetails", result.details));
      valueMap = result.valueMap;
      lastDetails = result.details;
      checkProxyProps = result.checkProxyProps || null;
    } else {
      lastDetails = void 0;
      checkProxyProps = null;
    }
    clearPrevDisposeListener?.();
    clearPrevDisposeListener = owner ? onOwnerDispose(owner, props.resetInspectedNode) : void 0;
  }
  const inspectedOwnerId = s4.createMemo(
    () => props.enabled() ? props.inspectedState().ownerId : null
  );
  s4.createEffect(() => {
    let id = inspectedOwnerId();
    s4.untrack(() => inspectOwnerId(id));
  });
  function onUnownedRootChange() {
    if (inspectedOwner === UNOWNED_ROOT) {
      inspectOwnerId(inspectedOwnerId());
    }
  }
  setup_default.unowned.onSignalAdded = onUnownedRootChange;
  setup_default.unowned.onSignalRemoved = onUnownedRootChange;
  s4.createEffect(() => {
    if (!props.enabled()) return;
    s4.onCleanup(addSolidUpdateListener(() => checkProxyProps && triggerPropsCheck()));
  });
  return {
    getLastDetails: () => lastDetails,
    toggleValueNode({ id, selected }) {
      const node = valueMap.get(id);
      if (!node) return warn3("Could not find value node:", id);
      node.setSelected(selected);
      pushInspectToggle(id, selected);
    },
    consoleLogValue(value_id) {
      console.log(getValue(value_id));
    }
  };
}

// packages/debugger/src/structure/index.ts
import { throttle as throttle3 } from "@solid-primitives/scheduled";
function getClosestIncludedOwner(owner, mode) {
  let closest = null;
  let current = owner;
  do {
    if (isDisposed(current)) closest = current.owner;
    current = current.owner;
  } while (current);
  owner = closest ?? owner;
  if (mode === "owners" /* Owners */) return owner;
  let root = null;
  do {
    const type = markOwnerType(owner);
    if (type === "COMPONENT" /* Component */ || type === "CONTEXT" /* Context */) return owner;
    if (type === "ROOT" /* Root */) root = owner;
    owner = owner.owner;
  } while (owner);
  return root;
}
function createStructure(props) {
  let treeWalkerMode = DEFAULT_WALKER_MODE;
  const updateQueue = /* @__PURE__ */ new Set();
  const ownerRoots = /* @__PURE__ */ new Map();
  const removedRoots = /* @__PURE__ */ new Set();
  let shouldUpdateAllRoots = true;
  const onComputationUpdate = (rootId, owner, changedStructure) => {
    queueMicrotask(() => {
      if (!props.enabled()) return;
      if (changedStructure) {
        updateOwner(owner, rootId);
      }
      let id = getSdtId(owner, "OWNER" /* Owner */);
      props.onNodeUpdate(id);
    });
  };
  function forceFlushRootUpdateQueue() {
    if (props.enabled()) {
      let partial = !shouldUpdateAllRoots;
      shouldUpdateAllRoots = false;
      let updated = {};
      let owners;
      let getRootId;
      if (partial) {
        owners = updateQueue;
        getRootId = (owner) => ownerRoots.get(owner);
      } else {
        owners = getCurrentRoots();
        getRootId = (owner) => getSdtId(owner, "OWNER" /* Owner */);
      }
      for (let owner of owners) {
        let root_id = getRootId(owner);
        let tree = walkSolidTree(owner, {
          rootId: root_id,
          mode: treeWalkerMode,
          onUpdate: onComputationUpdate,
          eli: props.component_registry.eli,
          registry: props.component_registry
        });
        let map = updated[root_id];
        if (map != null) map[tree.id] = tree;
        else updated[root_id] = { [tree.id]: tree };
      }
      props.onStructureUpdate({ partial, updated, removed: [...removedRoots] });
    }
    updateQueue.clear();
    flushRootUpdateQueue.clear();
    removedRoots.clear();
    ownerRoots.clear();
  }
  const flushRootUpdateQueue = throttle3(forceFlushRootUpdateQueue, 250);
  function updateOwner(node, topRootId) {
    updateQueue.add(node);
    ownerRoots.set(node, topRootId);
    flushRootUpdateQueue();
  }
  setOnOwnerNeedsUpdate((node, topRootId) => {
    const closestIncludedOwner = getClosestIncludedOwner(node, treeWalkerMode);
    closestIncludedOwner && updateOwner(closestIncludedOwner, topRootId);
  });
  setOnRootRemoved((rootId) => {
    removedRoots.add(rootId);
    flushRootUpdateQueue();
  });
  function updateAllRoots() {
    shouldUpdateAllRoots = true;
    flushRootUpdateQueue();
  }
  function forceUpdateAllRoots() {
    shouldUpdateAllRoots = true;
    queueMicrotask(forceFlushRootUpdateQueue);
  }
  function setTreeWalkerMode(mode) {
    treeWalkerMode = mode;
    updateAllRoots();
    clearComponentRegistry(props.component_registry);
  }
  return {
    updateAllRoots,
    forceUpdateAllRoots,
    setTreeWalkerMode,
    resetTreeWalkerMode: () => setTreeWalkerMode(DEFAULT_WALKER_MODE),
    getClosestIncludedOwner(owner) {
      return getClosestIncludedOwner(owner, treeWalkerMode);
    },
    onViewChange(view) {
      if (view === "structure" /* Structure */) {
        updateAllRoots();
      }
    }
  };
}

// packages/debugger/src/main/index.ts
function createDebugger() {
  assert(globalThis.SolidDevtools$$, "solid-devtools is not setup");
  initRoots();
  const _output_listeners = [];
  function listen(listener) {
    _output_listeners.push(listener);
    return () => mutate_remove(_output_listeners, listener);
  }
  function emitOutput(e) {
    for (let fn of _output_listeners) fn(e);
  }
  const [modules, toggleModules] = createStaticStore({
    debugger: false,
    locator: false,
    dgraph: false,
    locatorKeyPressSignal: () => false
  });
  const debuggerEnabled = s5.createMemo(
    () => modules.debugger || modules.locatorKeyPressSignal()
  );
  const dgraphEnabled = s5.createMemo(
    () => modules.dgraph && debuggerEnabled()
  );
  const locatorEnabled = s5.createMemo(
    () => (modules.locatorKeyPressSignal() || modules.locator) && debuggerEnabled()
  );
  s5.createEffect(defer3(debuggerEnabled, (enabled) => {
    emitOutput(msg4("DebuggerEnabled", enabled));
  }));
  let currentView = DEFAULT_MAIN_VIEW;
  function toggleModule(data) {
    switch (data.module) {
      case "structure" /* Structure */:
        break;
      case "dgraph" /* Dgraph */:
        toggleModules("dgraph", data.enabled);
        break;
      case "locator" /* Locator */:
        toggleModules("locator", data.enabled);
        break;
    }
  }
  const [inspectedState, setInspectedState] = s5.createSignal(
    INSPECTED_STATE_NULL,
    { equals: false }
  );
  s5.createEffect(() => {
    emitOutput(msg4("InspectedState", inspectedState()));
  });
  function getTreeWalkerOwnerId(ownerId) {
    const owner = ownerId && getObjectById(ownerId, "OWNER" /* Owner */);
    const treeWalkerOwner = owner && structure.getClosestIncludedOwner(owner);
    return treeWalkerOwner ? getSdtId(treeWalkerOwner, "OWNER" /* Owner */) : null;
  }
  function setInspectedNode(data) {
    if (data == null) {
      setInspectedState(INSPECTED_STATE_NULL);
    } else {
      let ownerId = data.ownerId && getObjectById(data.ownerId, "OWNER" /* Owner */) && data.ownerId;
      let signalId = data.signalId && getObjectById(data.signalId, "SIGNAL" /* Signal */) && data.signalId;
      let treeWalkerOwnerId = getTreeWalkerOwnerId(ownerId);
      setInspectedState({ ownerId, signalId, treeWalkerOwnerId });
    }
  }
  s5.createComputed(defer3(debuggerEnabled, (enabled) => {
    if (!enabled) setInspectedState(INSPECTED_STATE_NULL);
  }));
  let node_updates_ids = [];
  let node_updates_timeout = null;
  function pushNodeUpdate(id) {
    node_updates_ids.push(id);
    if (node_updates_timeout == null) {
      node_updates_timeout = setTimeout(() => {
        emitOutput(msg4("NodeUpdates", node_updates_ids));
        node_updates_ids = [];
        node_updates_timeout = null;
      });
    }
  }
  let component_registry = makeComponentRegistry(setup_default.eli);
  const structure = createStructure({
    onStructureUpdate(updates) {
      emitOutput(msg4("StructureUpdates", updates));
      setInspectedState((p) => ({
        ...p,
        treeWalkerOwnerId: getTreeWalkerOwnerId(p.treeWalkerOwnerId)
      }));
    },
    onNodeUpdate: pushNodeUpdate,
    enabled: debuggerEnabled,
    component_registry
  });
  const inspector = createInspector({
    enabled: debuggerEnabled,
    inspectedState,
    resetInspectedNode: () => setInspectedState(INSPECTED_STATE_NULL),
    emit: emitOutput
  });
  const dgraph = createDependencyGraph({
    enabled: dgraphEnabled,
    onNodeUpdate: pushNodeUpdate,
    inspectedState,
    emit: emitOutput
  });
  const locator = createLocator({
    locatorEnabled,
    setLocatorEnabledSignal(signal) {
      toggleModules("locatorKeyPressSignal", () => signal);
    },
    onComponentClick(componentId, next) {
      if (modules.debugger) {
        emitOutput(msg4("InspectedComponent", componentId));
      } else {
        next();
      }
    },
    emit: emitOutput,
    component_registry
  });
  function openInspectedNodeLocation() {
    const details = inspector.getLastDetails();
    details?.location && locator.openElementSourceCode(details.location);
  }
  s5.createEffect(defer3(modules.locatorKeyPressSignal, (state) => {
    emitOutput(msg4("LocatorModeChange", state));
  }));
  function emitInput(e) {
    switch (e.kind) {
      case "ResetState": {
        s5.batch(() => {
          setInspectedState(INSPECTED_STATE_NULL);
          currentView = DEFAULT_MAIN_VIEW;
          structure.resetTreeWalkerMode();
          locator.setDevtoolsHighlightTarget(null);
        });
        break;
      }
      case "HighlightElementChange":
        locator.setDevtoolsHighlightTarget(e.data);
        break;
      case "InspectNode":
        setInspectedNode(e.data);
        break;
      case "InspectValue":
        inspector.toggleValueNode(e.data);
        break;
      case "ConsoleInspectValue":
        inspector.consoleLogValue(e.data);
        break;
      case "OpenLocation":
        openInspectedNodeLocation();
        break;
      case "TreeViewModeChange":
        structure.setTreeWalkerMode(e.data);
        break;
      case "ViewChange":
        currentView = e.data;
        structure.onViewChange(currentView);
        dgraph.onViewChange(currentView);
        break;
      case "ToggleModule":
        toggleModule(e.data);
        break;
    }
  }
  return {
    versions: setup_default.versions,
    enabled: debuggerEnabled,
    listen,
    emit: emitInput,
    setLocatorOptions: locator.useLocator,
    toggleEnabled(enabled) {
      toggleModules("debugger", enabled);
    }
  };
}
var _debugger_instance;
function useDebugger() {
  _debugger_instance ??= createDebugger();
  return _debugger_instance;
}
export {
  addSolidUpdateListener,
  attachDebugger,
  getNodeName,
  getNodeType,
  getOwnerType,
  interceptComputationRerun,
  isSolidComputation,
  isSolidMemo,
  isSolidOwner,
  isSolidRoot,
  isSolidSignal,
  isSolidStore,
  lookupOwner,
  makeValueUpdateListener,
  observeValueUpdate,
  onOwnerCleanup,
  onParentCleanup,
  removeValueUpdateObserver,
  useDebugger
};

// packages/debugger/src/inspector/types.ts
var INFINITY = "Infinity";
var NEGATIVE_INFINITY = "NegativeInfinity";
var NAN = "NaN";
var UNDEFINED = "undefined";
var ValueType = /* @__PURE__ */ ((ValueType2) => {
  ValueType2["Number"] = "number";
  ValueType2["Boolean"] = "boolean";
  ValueType2["String"] = "string";
  ValueType2["Null"] = "null";
  ValueType2["Symbol"] = "symbol";
  ValueType2["Array"] = "array";
  ValueType2["Object"] = "object";
  ValueType2["Function"] = "function";
  ValueType2["Getter"] = "getter";
  ValueType2["Element"] = "element";
  ValueType2["Instance"] = "instance";
  ValueType2["Store"] = "store";
  ValueType2["Unknown"] = "unknown";
  return ValueType2;
})(ValueType || {});
var PropGetterState = /* @__PURE__ */ ((PropGetterState2) => {
  PropGetterState2["Live"] = "live";
  PropGetterState2["Stale"] = "stale";
  return PropGetterState2;
})(PropGetterState || {});
var GLOBAL_GET_VALUE = "$SdtGetValue";

// packages/debugger/src/locator/locator.ts
import { isWindows } from "@solid-primitives/platform";

// packages/debugger/src/main/types.ts
var DevtoolsMainView = /* @__PURE__ */ ((DevtoolsMainView2) => {
  DevtoolsMainView2["Structure"] = "structure";
  return DevtoolsMainView2;
})(DevtoolsMainView || {});
var DEFAULT_MAIN_VIEW = "structure" /* Structure */;
var DebuggerModule = /* @__PURE__ */ ((DebuggerModule2) => {
  DebuggerModule2["Locator"] = "locator";
  DebuggerModule2["Structure"] = "structure";
  DebuggerModule2["Dgraph"] = "dgraph";
  return DebuggerModule2;
})(DebuggerModule || {});
var TreeWalkerMode = /* @__PURE__ */ ((TreeWalkerMode2) => {
  TreeWalkerMode2["Owners"] = "owners";
  TreeWalkerMode2["Components"] = "components";
  TreeWalkerMode2["DOM"] = "dom";
  return TreeWalkerMode2;
})(TreeWalkerMode || {});
var DEFAULT_WALKER_MODE = "components" /* Components */;
var NodeType = /* @__PURE__ */ ((NodeType2) => {
  NodeType2["Root"] = "ROOT";
  NodeType2["Component"] = "COMPONENT";
  NodeType2["Element"] = "ELEMENT";
  NodeType2["Effect"] = "EFFECT";
  NodeType2["Render"] = "RENDER";
  NodeType2["Memo"] = "MEMO";
  NodeType2["Computation"] = "COMPUTATION";
  NodeType2["Refresh"] = "REFRESH";
  NodeType2["Context"] = "CONTEXT";
  NodeType2["CatchError"] = "CATCH_ERROR";
  NodeType2["Signal"] = "SIGNAL";
  NodeType2["Store"] = "STORE";
  NodeType2["CustomValue"] = "CUSTOM_VALUE";
  return NodeType2;
})(NodeType || {});
var NODE_TYPE_NAMES = {
  ["ROOT" /* Root */]: "Root",
  ["COMPONENT" /* Component */]: "Component",
  ["ELEMENT" /* Element */]: "Element",
  ["EFFECT" /* Effect */]: "Effect",
  ["RENDER" /* Render */]: "Render Effect",
  ["MEMO" /* Memo */]: "Memo",
  ["COMPUTATION" /* Computation */]: "Computation",
  ["REFRESH" /* Refresh */]: "Refresh",
  ["CONTEXT" /* Context */]: "Context",
  ["CATCH_ERROR" /* CatchError */]: "CatchError",
  ["SIGNAL" /* Signal */]: "Signal",
  ["STORE" /* Store */]: "Store",
  ["CUSTOM_VALUE" /* CustomValue */]: "Custom Value"
};
var ValueItemType = /* @__PURE__ */ ((ValueItemType2) => {
  ValueItemType2["Signal"] = "signal";
  ValueItemType2["Prop"] = "prop";
  ValueItemType2["Value"] = "value";
  return ValueItemType2;
})(ValueItemType || {});
var UNKNOWN = "unknown";
var OWNER_LOCATION_PROP = "sdtLocation";
var INSPECTED_STATE_NULL = {
  ownerId: null,
  signalId: null,
  treeWalkerOwnerId: null
};
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
var getValueItemId = (type, id) => {
  if (type === "value" /* Value */) return "value" /* Value */;
  return `${type}:${id}`;
};

// packages/debugger/src/locator/locator.ts
var WINDOW_PROJECTPATH_PROPERTY = "$sdt_projectPath";
var LOCATION_ATTRIBUTE_NAME = "data-source-loc";
var LOC_ATTR_REGEX_WIN = /^((?:\\?[^\s][^/\\:\"\?\*<>\|]+)+):([0-9]+):([0-9]+)$/;
var LOC_ATTR_REGEX_UNIX = /^((?:(?:\.\/|\.\.\/|\/)?(?:\.?\w+\/)*)(?:\.?\w+\.?\w+)):([0-9]+):([0-9]+)$/;
var LOC_ATTR_REGEX = isWindows ? LOC_ATTR_REGEX_WIN : LOC_ATTR_REGEX_UNIX;
function getLocationAttr(element) {
  let attr = element.getAttribute(LOCATION_ATTRIBUTE_NAME);
  if (!attr || !LOC_ATTR_REGEX.test(attr)) return null;
  return attr;
}
var targetIDEMap = {
  vscode: ({ projectPath, file, line, column }) => `vscode://file/${projectPath}/${file}:${line}:${column}`,
  "vscode-insiders": ({ projectPath, file: filePath, line, column }) => `vscode-insiders://file/${projectPath}/${filePath}:${line}:${column}`,
  atom: ({ projectPath, file: filePath, line, column }) => `atom://core/open/file?filename=${projectPath}/${filePath}&line=${line}&column=${column}`,
  webstorm: ({ projectPath, file: filePath, line, column }) => `webstorm://open?file=${projectPath}/${filePath}&line=${line}&column=${column}`
};
function getTargetURL(target, data) {
  if (typeof target === "function") return target(data);
  return targetIDEMap[target](data);
}
var getProjectPath = () => window[WINDOW_PROJECTPATH_PROPERTY];
function getSourceCodeData(location) {
  let projectPath = getProjectPath();
  if (projectPath == null) return;
  return { ...location, projectPath };
}
function parseLocationString(location) {
  let [file, line, column] = location.split(":");
  if (file && line && column && typeof file === "string" && !isNaN(line = +line) && !isNaN(column = +column)) {
    return { file, line, column };
  }
}
function openSourceCode(target, data) {
  const url = getTargetURL(target, data);
  if (typeof url === "string") window.open(url, "_blank");
}

export {
  WINDOW_PROJECTPATH_PROPERTY,
  LOCATION_ATTRIBUTE_NAME,
  LOC_ATTR_REGEX,
  getLocationAttr,
  getProjectPath,
  getSourceCodeData,
  parseLocationString,
  openSourceCode,
  DevtoolsMainView,
  DEFAULT_MAIN_VIEW,
  DebuggerModule,
  TreeWalkerMode,
  DEFAULT_WALKER_MODE,
  NodeType,
  NODE_TYPE_NAMES,
  ValueItemType,
  UNKNOWN,
  OWNER_LOCATION_PROP,
  INSPECTED_STATE_NULL,
  dom_element_interface,
  getValueItemId,
  INFINITY,
  NEGATIVE_INFINITY,
  NAN,
  UNDEFINED,
  ValueType,
  PropGetterState,
  GLOBAL_GET_VALUE
};

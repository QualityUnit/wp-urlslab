import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-mwi7nr1gli.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-mwi7nr1gli.js";
import "./api-exclamation-mwi7nr1gli.js";
/* empty css                              */function CssOptimizerOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The use of inline CSS instead of external CSS files is a great way to improve page performance and reduce content-blocker requests. Inline CSS is a way to add styling directly to an HTML element, eliminating the need to make additional requests to external CSS files, thus improving page speed."), /* @__PURE__ */ React.createElement("p", null, "The content-blockers are requests that block other requests for some time during page load, and they are rapidly slowing down page performance and the grade in Core Web Vitals."));
}
function CssOptimizer({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["css-cache", __("Cached CSS Files")]
  ]);
  const CSSCacheTable = reactExports.lazy(() => __vitePreload(() => import("./CSSCacheTable-mwi7nr1gli.js"), true ? ["./CSSCacheTable-mwi7nr1gli.js","../main-mwi7nr1gli.js","./main.css","./useTableUpdater-mwi7nr1gli.js","./datepicker-mwi7nr1gli.js","./datepicker-mwi7nr1gli.css","./useMutation-mwi7nr1gli.js","./useTableUpdater-mwi7nr1gli.css"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-mwi7nr1gli.js"), true ? ["./Settings-mwi7nr1gli.js","../main-mwi7nr1gli.js","./main.css","./datepicker-mwi7nr1gli.js","./datepicker-mwi7nr1gli.css","./Switch-mwi7nr1gli.js","./Switch-mwi7nr1gli.css","./useMutation-mwi7nr1gli.js","./Settings-mwi7nr1gli.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(CssOptimizerOverview, null)), /* @__PURE__ */ React.createElement(reactExports.Suspense, null, activeSection === "css-cache" && /* @__PURE__ */ React.createElement(CSSCacheTable, { slug: "css-cache" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  CssOptimizer as default
};

import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-epctp16cwh.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-epctp16cwh.js";
import "./api-exclamation-epctp16cwh.js";
/* empty css                              */function CssOptimizerOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The use of inline CSS instead of external CSS files is a great way to improve page performance and reduce content-blocker requests. Inline CSS is a way to add styling directly to an HTML element, eliminating the need to make additional requests to external CSS files, thus improving page speed."), /* @__PURE__ */ React.createElement("p", null, "The content-blockers are requests that block other requests for some time during page load, and they are rapidly slowing down page performance and the grade in Core Web Vitals."));
}
function CssOptimizer({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["css-cache", __("Cached CSS Files")]
  ]);
  const CSSCacheTable = reactExports.lazy(() => __vitePreload(() => import("./CSSCacheTable-epctp16cwh.js"), true ? ["./CSSCacheTable-epctp16cwh.js","../main-epctp16cwh.js","./main.css","./useTableUpdater-epctp16cwh.js","./_ColumnsMenu-epctp16cwh.js","./_ColumnsMenu-epctp16cwh.css","./InputField-epctp16cwh.js","./datepicker-epctp16cwh.css","./useMutation-epctp16cwh.js","./Tooltip_SortingFiltering-epctp16cwh.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-epctp16cwh.js"), true ? ["./Settings-epctp16cwh.js","../main-epctp16cwh.js","./main.css","./InputField-epctp16cwh.js","./datepicker-epctp16cwh.css","./Switch-epctp16cwh.js","./Switch-epctp16cwh.css","./useMutation-epctp16cwh.js","./Settings-epctp16cwh.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(CssOptimizerOverview, null)), /* @__PURE__ */ React.createElement(reactExports.Suspense, null, activeSection === "css-cache" && /* @__PURE__ */ React.createElement(CSSCacheTable, { slug: "css-cache" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  CssOptimizer as default
};

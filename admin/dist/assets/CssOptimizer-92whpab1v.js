import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-92whpab1v.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-92whpab1v.js";
import "./api-exclamation-92whpab1v.js";
/* empty css                             */function CssOptimizerOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The use of inline CSS instead of external CSS files is a great way to improve page performance and reduce content-blocker requests. Inline CSS is a way to add styling directly to an HTML element, eliminating the need to make additional requests to external CSS files, thus improving page speed."), /* @__PURE__ */ React.createElement("p", null, "The content-blockers are requests that block other requests for some time during page load, and they are rapidly slowing down page performance and the grade in Core Web Vitals."));
}
function CssOptimizer({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["css-cache", __("Cached CSS Files")]
  ]);
  const CSSCacheTable = reactExports.lazy(() => __vitePreload(() => import("./CSSCacheTable-92whpab1v.js"), true ? ["./CSSCacheTable-92whpab1v.js","../main-92whpab1v.js","./main.css","./useTableUpdater-92whpab1v.js","./_ColumnsMenu-92whpab1v.js","./_ColumnsMenu-92whpab1v.css","./InputField-92whpab1v.js","./datepicker-92whpab1v.css","./useMutation-92whpab1v.js","./DateTimeFormat-92whpab1v.js","./Tooltip_SortingFiltering-92whpab1v.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-92whpab1v.js"), true ? ["./Settings-92whpab1v.js","../main-92whpab1v.js","./main.css","./InputField-92whpab1v.js","./datepicker-92whpab1v.css","./Switch-92whpab1v.js","./Switch-92whpab1v.css","./useMutation-92whpab1v.js","./Settings-92whpab1v.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(CssOptimizerOverview, null)), /* @__PURE__ */ React.createElement(reactExports.Suspense, null, activeSection === "css-cache" && /* @__PURE__ */ React.createElement(CSSCacheTable, { slug: "css-cache" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  CssOptimizer as default
};

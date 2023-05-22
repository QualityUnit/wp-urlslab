import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-o7jxnz8jys.js";
import { O as Overview, M as ModuleViewHeader } from "./ModuleViewHeader-o7jxnz8jys.js";
import "./Checkbox-o7jxnz8jys.js";
/* empty css                              */function CssOptimizerOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val) }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("p", null, "The use of inline CSS instead of external CSS files is a great way to improve page performance and reduce content-blocker requests. Inline CSS is a way to add styling directly to an HTML element, eliminating the need to make additional requests to external CSS files, thus improving page speed."), /* @__PURE__ */ React.createElement("p", null, "The content-blockers are requests that block other requests for some time during page load, and they are rapidly slowing down page performance and the grade in Core Web Vitals.")));
}
function CssOptimizer({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["css-cache", __("Cached CSS Files")]
  ]);
  const CSSCacheTable = reactExports.lazy(() => __vitePreload(() => import("./CSSCacheTable-o7jxnz8jys.js"), true ? ["./CSSCacheTable-o7jxnz8jys.js","../main-o7jxnz8jys.js","./main-o7jxnz8jys.css","./ModuleViewHeaderBottom-o7jxnz8jys.js","./datepicker-o7jxnz8jys.js","./MultiSelectMenu-o7jxnz8jys.js","./Checkbox-o7jxnz8jys.js","./Checkbox-o7jxnz8jys.css","./MultiSelectMenu-o7jxnz8jys.css","./datepicker-o7jxnz8jys.css","./ModuleViewHeaderBottom-o7jxnz8jys.css","./Tooltip_SortingFiltering-o7jxnz8jys.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-o7jxnz8jys.js"), true ? ["./Settings-o7jxnz8jys.js","../main-o7jxnz8jys.js","./main-o7jxnz8jys.css","./datepicker-o7jxnz8jys.js","./MultiSelectMenu-o7jxnz8jys.js","./Checkbox-o7jxnz8jys.js","./Checkbox-o7jxnz8jys.css","./MultiSelectMenu-o7jxnz8jys.css","./datepicker-o7jxnz8jys.css","./Switch-o7jxnz8jys.js","./Switch-o7jxnz8jys.css","./Settings-o7jxnz8jys.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(CssOptimizerOverview, { moduleId }), /* @__PURE__ */ React.createElement(reactExports.Suspense, null, activeSection === "css-cache" && /* @__PURE__ */ React.createElement(CSSCacheTable, { slug: "css-cache" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  CssOptimizer as default
};

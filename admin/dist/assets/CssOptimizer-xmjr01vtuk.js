import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-xmjr01vtuk.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-xmjr01vtuk.js";
/* empty css                              */import "./Checkbox-xmjr01vtuk.js";
function CssOptimizerOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The use of inline CSS instead of external CSS files is a great way to improve page performance and reduce content-blocker requests. Inline CSS is a way to add styling directly to an HTML element, eliminating the need to make additional requests to external CSS files, thus improving page speed."), /* @__PURE__ */ React.createElement("p", null, "The content-blockers are requests that block other requests for some time during page load, and they are rapidly slowing down page performance and the grade in Core Web Vitals.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function CssOptimizer({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["css-cache", __("Cached CSS Files")]
  ]);
  const CSSCacheTable = reactExports.lazy(() => __vitePreload(() => import("./CSSCacheTable-xmjr01vtuk.js"), true ? ["./CSSCacheTable-xmjr01vtuk.js","../main-xmjr01vtuk.js","./main-xmjr01vtuk.css","./ModuleViewHeaderBottom-xmjr01vtuk.js","./datepicker-xmjr01vtuk.js","./MultiSelectMenu-xmjr01vtuk.js","./Checkbox-xmjr01vtuk.js","./Checkbox-xmjr01vtuk.css","./MultiSelectMenu-xmjr01vtuk.css","./datepicker-xmjr01vtuk.css","./ModuleViewHeaderBottom-xmjr01vtuk.css","./Tooltip_SortingFiltering-xmjr01vtuk.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-xmjr01vtuk.js"), true ? ["./Settings-xmjr01vtuk.js","../main-xmjr01vtuk.js","./main-xmjr01vtuk.css","./datepicker-xmjr01vtuk.js","./MultiSelectMenu-xmjr01vtuk.js","./Checkbox-xmjr01vtuk.js","./Checkbox-xmjr01vtuk.css","./MultiSelectMenu-xmjr01vtuk.css","./datepicker-xmjr01vtuk.css","./Textarea-xmjr01vtuk.js","./Switch-xmjr01vtuk.js","./Switch-xmjr01vtuk.css","./Settings-xmjr01vtuk.css"] : void 0, import.meta.url));
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

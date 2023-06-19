<<<<<<< HEAD:admin/dist/assets/CssOptimizer-vqw3w5p1iw.js
<<<<<<< HEAD:admin/dist/assets/CssOptimizer-vqw3w5p1iw.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-vqw3w5p1iw.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-vqw3w5p1iw.js";
=======
<<<<<<<< HEAD:admin/dist/assets/CssOptimizer-txs3jaim6w.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { u as useI18n, _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/CssOptimizer-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/CssOptimizer-txs3jaim6w.js
/* empty css                              */function CssOptimizerOverview({ moduleId }) {
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-o8x8qzqwuhk.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-o8x8qzqwuhk.js";
/* empty css                               */function CssOptimizerOverview({ moduleId }) {
>>>>>>> main:admin/dist/assets/CssOptimizer-o8x8qzqwuhk.js
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The use of inline CSS instead of external CSS files is a great way to improve page performance and reduce content-blocker requests. Inline CSS is a way to add styling directly to an HTML element, eliminating the need to make additional requests to external CSS files, thus improving page speed."), /* @__PURE__ */ React.createElement("p", null, "The content-blockers are requests that block other requests for some time during page load, and they are rapidly slowing down page performance and the grade in Core Web Vitals.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function CssOptimizer({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["css-cache", __("Cached CSS Files")]
  ]);
<<<<<<< HEAD:admin/dist/assets/CssOptimizer-vqw3w5p1iw.js
<<<<<<< HEAD:admin/dist/assets/CssOptimizer-vqw3w5p1iw.js
  const CSSCacheTable = reactExports.lazy(() => __vitePreload(() => import("./CSSCacheTable-vqw3w5p1iw.js"), true ? ["./CSSCacheTable-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.js","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.css","./Tooltip_SortingFiltering-vqw3w5p1iw.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-vqw3w5p1iw.js"), true ? ["./Settings-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./Textarea-vqw3w5p1iw.js","./Switch-vqw3w5p1iw.js","./Switch-vqw3w5p1iw.css","./Settings-vqw3w5p1iw.css"] : void 0, import.meta.url));
=======
<<<<<<<< HEAD:admin/dist/assets/CssOptimizer-txs3jaim6w.js
  const CSSCacheTable = reactExports.lazy(() => __vitePreload(() => import("./CSSCacheTable-txs3jaim6w.js"), true ? ["./CSSCacheTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./Tooltip_SortingFiltering-txs3jaim6w.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-txs3jaim6w.js"), true ? ["./Settings-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./Textarea-txs3jaim6w.js","./Switch-txs3jaim6w.js","./Switch-txs3jaim6w.css","./Settings-txs3jaim6w.css"] : void 0, import.meta.url));
========
  const CSSCacheTable = reactExports.lazy(() => __vitePreload(() => import("./CSSCacheTable-myg4akepfo.js"), true ? ["./CSSCacheTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./Tooltip_SortingFiltering-myg4akepfo.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-myg4akepfo.js"), true ? ["./Settings-myg4akepfo.js","./index-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./Textarea-myg4akepfo.js","./Switch-myg4akepfo.js","./Switch-myg4akepfo.css","./Settings-myg4akepfo.css"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/CssOptimizer-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/CssOptimizer-txs3jaim6w.js
=======
  const CSSCacheTable = reactExports.lazy(() => __vitePreload(() => import("./CSSCacheTable-o8x8qzqwuhk.js"), true ? ["./CSSCacheTable-o8x8qzqwuhk.js","../main-o8x8qzqwuhk.js","./main-o8x8qzqwuhk.css","./ModuleViewHeaderBottom-o8x8qzqwuhk.js","./datepicker-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.css","./ModuleViewHeaderBottom-o8x8qzqwuhk.css","./Tooltip_SortingFiltering-o8x8qzqwuhk.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-o8x8qzqwuhk.js"), true ? ["./Settings-o8x8qzqwuhk.js","../main-o8x8qzqwuhk.js","./main-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.css","./Textarea-o8x8qzqwuhk.js","./Switch-o8x8qzqwuhk.js","./Switch-o8x8qzqwuhk.css","./Settings-o8x8qzqwuhk.css"] : void 0, import.meta.url));
>>>>>>> main:admin/dist/assets/CssOptimizer-o8x8qzqwuhk.js
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

<<<<<<< HEAD:admin/dist/assets/LazyLoading-vqw3w5p1iw.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-vqw3w5p1iw.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-vqw3w5p1iw.js";
=======
<<<<<<<< HEAD:admin/dist/assets/LazyLoading-txs3jaim6w.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { u as useI18n, _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/LazyLoading-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/LazyLoading-txs3jaim6w.js
/* empty css                              */function LazyLoadingOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val) }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "Lazy loading is an essential technique for optimising page performance and reducing page load time. By deferring loading of images, videos, iframes, and large content chunks, you can drastically improve the speed at which pages load. This is especially important for those with slower internet connections, who are more likely to be affected by page loading times."), /* @__PURE__ */ React.createElement("p", null, "The main idea behind lazy loading is to delay loading assets until they are actually needed. This means that instead of loading all assets simultaneously, the browser will only load them when they are visible on the user’s screen. It decreases the amount of data that needs to be transferred and therefore increases page loading speed. It also reduces server load, as the server does not have to process every asset simultaneously.")), section === "integrate" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "Video data shortcode"), /* @__PURE__ */ React.createElement("code", null, '[urlslab-video videoid="YT-video-ID" attribute="atr_name"]'), /* @__PURE__ */ React.createElement("p", null, "Supported video attribute names: title, description, thumbnail_url, published_at, duration, captions, captions_text, channel_title")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function LazyLoading({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map(
    [
      ["youtube-cache", __("YouTube Videos")],
      ["content-cache", __("Content Lazy Loading")]
    ]
  );
<<<<<<< HEAD:admin/dist/assets/LazyLoading-vqw3w5p1iw.js
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-vqw3w5p1iw.js"), true ? ["./Settings-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./Textarea-vqw3w5p1iw.js","./Switch-vqw3w5p1iw.js","./Switch-vqw3w5p1iw.css","./Settings-vqw3w5p1iw.css"] : void 0, import.meta.url));
  const YouTubeCacheTable = reactExports.lazy(() => __vitePreload(() => import("./YouTubeCacheTable-vqw3w5p1iw.js"), true ? ["./YouTubeCacheTable-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.js","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.css","./Tooltip_SortingFiltering-vqw3w5p1iw.js","./icon-link-vqw3w5p1iw.js","./icon-disable-vqw3w5p1iw.js"] : void 0, import.meta.url));
  const ContentCacheTable = reactExports.lazy(() => __vitePreload(() => import("./ContentCacheTable-vqw3w5p1iw.js"), true ? ["./ContentCacheTable-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.js","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.css","./Tooltip_SortingFiltering-vqw3w5p1iw.js"] : void 0, import.meta.url));
=======
<<<<<<<< HEAD:admin/dist/assets/LazyLoading-txs3jaim6w.js
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-txs3jaim6w.js"), true ? ["./Settings-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./Textarea-txs3jaim6w.js","./Switch-txs3jaim6w.js","./Switch-txs3jaim6w.css","./Settings-txs3jaim6w.css"] : void 0, import.meta.url));
  const YouTubeCacheTable = reactExports.lazy(() => __vitePreload(() => import("./YouTubeCacheTable-txs3jaim6w.js"), true ? ["./YouTubeCacheTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./Tooltip_SortingFiltering-txs3jaim6w.js","./icon-link-txs3jaim6w.js","./icon-disable-txs3jaim6w.js"] : void 0, import.meta.url));
  const ContentCacheTable = reactExports.lazy(() => __vitePreload(() => import("./ContentCacheTable-txs3jaim6w.js"), true ? ["./ContentCacheTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./Tooltip_SortingFiltering-txs3jaim6w.js"] : void 0, import.meta.url));
========
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-myg4akepfo.js"), true ? ["./Settings-myg4akepfo.js","./index-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./Textarea-myg4akepfo.js","./Switch-myg4akepfo.js","./Switch-myg4akepfo.css","./Settings-myg4akepfo.css"] : void 0, import.meta.url));
  const YouTubeCacheTable = reactExports.lazy(() => __vitePreload(() => import("./YouTubeCacheTable-myg4akepfo.js"), true ? ["./YouTubeCacheTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./Tooltip_SortingFiltering-myg4akepfo.js","./icon-link-myg4akepfo.js","./icon-disable-myg4akepfo.js"] : void 0, import.meta.url));
  const ContentCacheTable = reactExports.lazy(() => __vitePreload(() => import("./ContentCacheTable-myg4akepfo.js"), true ? ["./ContentCacheTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./Tooltip_SortingFiltering-myg4akepfo.js"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/LazyLoading-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/LazyLoading-txs3jaim6w.js
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(LazyLoadingOverview, { moduleId }), /* @__PURE__ */ React.createElement(reactExports.Suspense, null, activeSection === "youtube-cache" && /* @__PURE__ */ React.createElement(YouTubeCacheTable, { slug: "youtube-cache" }), activeSection === "content-cache" && /* @__PURE__ */ React.createElement(ContentCacheTable, { slug: "content-cache" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  LazyLoading as default
};

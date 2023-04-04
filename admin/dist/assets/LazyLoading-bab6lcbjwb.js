import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-bab6lcbjwb.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-bab6lcbjwb.js";
import "./api-exclamation-bab6lcbjwb.js";
/* empty css                              */function LazyLoadingOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "Lazy loading is an essential technique for optimizing page performance and reducing page load time. By deferring loading of images, videos, iframes, and large content chunks, you can drastically improve the speed at which pages load. This is especially important for those with slower internet connections, who are more likely to be affected by page loading times."), /* @__PURE__ */ React.createElement("p", null, "The main idea behind lazy loading is to delay loading assets until they are actually needed. This means that instead of loading all assets simultaneously, the browser will only load them when they are visible on the user’s screen. It decreases the amount of data that needs to be transferred and therefore increases page loading speed. It also reduces server load, as the server does not have to process every asset simultaneously."));
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
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-bab6lcbjwb.js"), true ? ["./Settings-bab6lcbjwb.js","../main-bab6lcbjwb.js","./main.css","./datepicker-bab6lcbjwb.js","./datepicker-bab6lcbjwb.css","./Switch-bab6lcbjwb.js","./Switch-bab6lcbjwb.css","./useMutation-bab6lcbjwb.js","./Settings-bab6lcbjwb.css"] : void 0, import.meta.url));
  const YouTubeCacheTable = reactExports.lazy(() => __vitePreload(() => import("./YouTubeCacheTable-bab6lcbjwb.js"), true ? ["./YouTubeCacheTable-bab6lcbjwb.js","../main-bab6lcbjwb.js","./main.css","./useTableUpdater-bab6lcbjwb.js","./datepicker-bab6lcbjwb.js","./datepicker-bab6lcbjwb.css","./useMutation-bab6lcbjwb.js","./useTableUpdater-bab6lcbjwb.css"] : void 0, import.meta.url));
  const ContentCacheTable = reactExports.lazy(() => __vitePreload(() => import("./ContentCacheTable-bab6lcbjwb.js"), true ? ["./ContentCacheTable-bab6lcbjwb.js","../main-bab6lcbjwb.js","./main.css","./useTableUpdater-bab6lcbjwb.js","./datepicker-bab6lcbjwb.js","./datepicker-bab6lcbjwb.css","./useMutation-bab6lcbjwb.js","./useTableUpdater-bab6lcbjwb.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(LazyLoadingOverview, null)), /* @__PURE__ */ React.createElement(reactExports.Suspense, null, activeSection === "youtube-cache" && /* @__PURE__ */ React.createElement(YouTubeCacheTable, { slug: "youtube-cache" }), activeSection === "content-cache" && /* @__PURE__ */ React.createElement(ContentCacheTable, { slug: "content-cache" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  LazyLoading as default
};

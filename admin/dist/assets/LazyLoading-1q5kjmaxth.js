import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-1q5kjmaxth.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-1q5kjmaxth.js";
import "./api-exclamation-1q5kjmaxth.js";
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
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-1q5kjmaxth.js"), true ? ["./Settings-1q5kjmaxth.js","../main-1q5kjmaxth.js","./main.css","./InputField-1q5kjmaxth.js","./datepicker-1q5kjmaxth.css","./Switch-1q5kjmaxth.js","./Switch-1q5kjmaxth.css","./useMutation-1q5kjmaxth.js","./Settings-1q5kjmaxth.css"] : void 0, import.meta.url));
  const YouTubeCacheTable = reactExports.lazy(() => __vitePreload(() => import("./YouTubeCacheTable-1q5kjmaxth.js"), true ? ["./YouTubeCacheTable-1q5kjmaxth.js","../main-1q5kjmaxth.js","./main.css","./useTableUpdater-1q5kjmaxth.js","./_ColumnsMenu-1q5kjmaxth.js","./_ColumnsMenu-1q5kjmaxth.css","./InputField-1q5kjmaxth.js","./datepicker-1q5kjmaxth.css","./useMutation-1q5kjmaxth.js","./Tooltip_SortingFiltering-1q5kjmaxth.js","./icon-link-1q5kjmaxth.js"] : void 0, import.meta.url));
  const ContentCacheTable = reactExports.lazy(() => __vitePreload(() => import("./ContentCacheTable-1q5kjmaxth.js"), true ? ["./ContentCacheTable-1q5kjmaxth.js","../main-1q5kjmaxth.js","./main.css","./useTableUpdater-1q5kjmaxth.js","./_ColumnsMenu-1q5kjmaxth.js","./_ColumnsMenu-1q5kjmaxth.css","./InputField-1q5kjmaxth.js","./datepicker-1q5kjmaxth.css","./useMutation-1q5kjmaxth.js","./DateTimeFormat-1q5kjmaxth.js","./Tooltip_SortingFiltering-1q5kjmaxth.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(LazyLoadingOverview, null)), /* @__PURE__ */ React.createElement(reactExports.Suspense, null, activeSection === "youtube-cache" && /* @__PURE__ */ React.createElement(YouTubeCacheTable, { slug: "youtube-cache" }), activeSection === "content-cache" && /* @__PURE__ */ React.createElement(ContentCacheTable, { slug: "content-cache" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  LazyLoading as default
};

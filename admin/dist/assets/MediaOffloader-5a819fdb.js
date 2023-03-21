import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../settings.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-b24fa859.js";
import "./api-exclamation-64563f09.js";
/* empty css                            */function MediaOffloaderOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Media Manager module can be a great tool for improving the performance of any website. With its automatic image enhancement, it can make images smaller while also offloading them to the cloud or a database. This will help reduce the load time when a user accesses a website. In addition to this, it can also generate modern image formats such as WebP and Avif, which are more efficient and provide better compression ratios."), /* @__PURE__ */ React.createElement("p", null, "Moreover, it can also help with SEO by automatically removing broken images from the content, thus improving the overall experience for the users. It can be a great way to ensure your website is optimized and running at its best."));
}
function MediaOffloader({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const slug = "file";
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Media Files")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-f0f7bf20.js"), true ? ["./Settings-f0f7bf20.js","../settings.js","./main.css","./index-44952be2.js","./InputField-36e1e240.js","./datepicker-ff7dcd9b.js","./datepicker.css","./Switch-3776180b.js","./Switch.css","./useMutation-1e5291cb.js","./Settings.css"] : void 0, import.meta.url));
  const MediaFilesTable = reactExports.lazy(() => __vitePreload(() => import("./MediaFilesTable-98cad0c6.js"), true ? ["./MediaFilesTable-98cad0c6.js","../settings.js","./main.css","./useTableUpdater-afa37684.js","./datepicker-ff7dcd9b.js","./datepicker.css","./useMutation-1e5291cb.js","./useTableUpdater.css","./MenuInput-fef364f8.js","./InputField-36e1e240.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(MediaOffloaderOverview, null)), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(MediaFilesTable, { slug })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  MediaOffloader as default
};

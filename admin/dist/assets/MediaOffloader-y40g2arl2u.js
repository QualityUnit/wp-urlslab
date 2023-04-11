import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-y40g2arl2u.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-y40g2arl2u.js";
import "./api-exclamation-y40g2arl2u.js";
/* empty css                              */function MediaOffloaderOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Media Manager module can be a great tool for improving the performance of any website. With its automatic image enhancement, it can make images smaller while also offloading them to the cloud or a database. This will help reduce the load time when a user accesses a website. In addition to this, it can also generate modern image formats such as WebP and Avif, which are more efficient and provide better compression ratios."), /* @__PURE__ */ React.createElement("p", null, "Moreover, it can also help with SEO by automatically removing broken images from the content, thus improving the overall experience for the users. It can be a great way to ensure your website is optimized and running at its best."));
}
function MediaOffloader({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const slug = "file";
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Media Files")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-y40g2arl2u.js"), true ? ["./Settings-y40g2arl2u.js","../main-y40g2arl2u.js","./main.css","./datepicker-y40g2arl2u.js","./datepicker-y40g2arl2u.css","./Switch-y40g2arl2u.js","./Switch-y40g2arl2u.css","./useMutation-y40g2arl2u.js","./Settings-y40g2arl2u.css"] : void 0, import.meta.url));
  const MediaFilesTable = reactExports.lazy(() => __vitePreload(() => import("./MediaFilesTable-y40g2arl2u.js"), true ? ["./MediaFilesTable-y40g2arl2u.js","../main-y40g2arl2u.js","./main.css","./useTableUpdater-y40g2arl2u.js","./datepicker-y40g2arl2u.js","./datepicker-y40g2arl2u.css","./useMutation-y40g2arl2u.js","./useTableUpdater-y40g2arl2u.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(MediaOffloaderOverview, null)), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(MediaFilesTable, { slug })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  MediaOffloader as default
};

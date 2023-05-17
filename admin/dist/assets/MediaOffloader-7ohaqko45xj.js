import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-7ohaqko45xj.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-7ohaqko45xj.js";
import "./api-exclamation-7ohaqko45xj.js";
/* empty css                               */function MediaOffloaderOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Media Manager module can be a great tool for improving the performance of any website. With its automatic image enhancement, it can make images smaller while also offloading them to the cloud or a database. This will help reduce the load time when a user accesses a website. In addition to this, it can also generate modern image formats such as WebP and Avif, which are more efficient and provide better compression ratios."), /* @__PURE__ */ React.createElement("p", null, "Moreover, it can also help with SEO by automatically removing broken images from the content, thus improving the overall experience for the users. It can be a great way to ensure your website is optimized and running at its best."));
}
function MediaOffloader({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const slug = "file";
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Media Files")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-7ohaqko45xj.js"), true ? ["./Settings-7ohaqko45xj.js","../main-7ohaqko45xj.js","./main.css","./InputField-7ohaqko45xj.js","./datepicker-7ohaqko45xj.css","./Switch-7ohaqko45xj.js","./Switch-7ohaqko45xj.css","./useMutation-7ohaqko45xj.js","./Settings-7ohaqko45xj.css"] : void 0, import.meta.url));
  const MediaFilesTable = reactExports.lazy(() => __vitePreload(() => import("./MediaFilesTable-7ohaqko45xj.js"), true ? ["./MediaFilesTable-7ohaqko45xj.js","../main-7ohaqko45xj.js","./main.css","./useTableUpdater-7ohaqko45xj.js","./_ColumnsMenu-7ohaqko45xj.js","./_ColumnsMenu-7ohaqko45xj.css","./InputField-7ohaqko45xj.js","./datepicker-7ohaqko45xj.css","./useMutation-7ohaqko45xj.js","./TagsMenu-7ohaqko45xj.js","./Tooltip_SortingFiltering-7ohaqko45xj.js","./icon-link-7ohaqko45xj.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(MediaOffloaderOverview, null)), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(MediaFilesTable, { slug })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  MediaOffloader as default
};

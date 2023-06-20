import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-l0xckuglwsi.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-l0xckuglwsi.js";
/* empty css                               */function MediaOffloaderOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Media Manager module can be a great tool for improving the performance of any website. With its automatic image enhancement, it can make images smaller while also offloading them to the cloud or a database. This will help reduce the load time when a user accesses a website. In addition to this, it can also generate modern image formats such as WebP and Avif, which are more efficient and provide better compression ratios."), /* @__PURE__ */ React.createElement("p", null, "Moreover, it can also help with SEO by automatically removing broken images from the content, thus improving the overall experience for the users. It can be a great way to ensure your website is optimised and running at its best.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function MediaOffloader({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const slug = "file";
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Media Files")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-l0xckuglwsi.js"), true ? ["./Settings-l0xckuglwsi.js","../main-l0xckuglwsi.js","./main-l0xckuglwsi.css","./datepicker-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.css","./datepicker-l0xckuglwsi.css","./Textarea-l0xckuglwsi.js","./Switch-l0xckuglwsi.js","./Switch-l0xckuglwsi.css","./Settings-l0xckuglwsi.css"] : void 0, import.meta.url));
  const MediaFilesTable = reactExports.lazy(() => __vitePreload(() => import("./MediaFilesTable-l0xckuglwsi.js"), true ? ["./MediaFilesTable-l0xckuglwsi.js","../main-l0xckuglwsi.js","./main-l0xckuglwsi.css","./ModuleViewHeaderBottom-l0xckuglwsi.js","./datepicker-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.css","./datepicker-l0xckuglwsi.css","./ModuleViewHeaderBottom-l0xckuglwsi.css","./TagsMenu-l0xckuglwsi.js","./Tooltip_SortingFiltering-l0xckuglwsi.js","./icon-link-l0xckuglwsi.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(MediaOffloaderOverview, { moduleId }), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(MediaFilesTable, { slug })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  MediaOffloader as default
};

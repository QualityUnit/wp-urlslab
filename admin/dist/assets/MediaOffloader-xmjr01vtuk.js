import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-xmjr01vtuk.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-xmjr01vtuk.js";
/* empty css                              */import "./Checkbox-xmjr01vtuk.js";
function MediaOffloaderOverview({ moduleId }) {
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
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-xmjr01vtuk.js"), true ? ["./Settings-xmjr01vtuk.js","../main-xmjr01vtuk.js","./main-xmjr01vtuk.css","./datepicker-xmjr01vtuk.js","./MultiSelectMenu-xmjr01vtuk.js","./Checkbox-xmjr01vtuk.js","./Checkbox-xmjr01vtuk.css","./MultiSelectMenu-xmjr01vtuk.css","./datepicker-xmjr01vtuk.css","./Textarea-xmjr01vtuk.js","./Switch-xmjr01vtuk.js","./Switch-xmjr01vtuk.css","./Settings-xmjr01vtuk.css"] : void 0, import.meta.url));
  const MediaFilesTable = reactExports.lazy(() => __vitePreload(() => import("./MediaFilesTable-xmjr01vtuk.js"), true ? ["./MediaFilesTable-xmjr01vtuk.js","../main-xmjr01vtuk.js","./main-xmjr01vtuk.css","./ModuleViewHeaderBottom-xmjr01vtuk.js","./datepicker-xmjr01vtuk.js","./MultiSelectMenu-xmjr01vtuk.js","./Checkbox-xmjr01vtuk.js","./Checkbox-xmjr01vtuk.css","./MultiSelectMenu-xmjr01vtuk.css","./datepicker-xmjr01vtuk.css","./ModuleViewHeaderBottom-xmjr01vtuk.css","./TagsMenu-xmjr01vtuk.js","./Tooltip_SortingFiltering-xmjr01vtuk.js","./icon-link-xmjr01vtuk.js"] : void 0, import.meta.url));
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

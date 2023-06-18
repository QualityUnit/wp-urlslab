import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-kp480g2rhj.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-kp480g2rhj.js";
/* empty css                              */function MediaOffloaderOverview({ moduleId }) {
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
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-kp480g2rhj.js"), true ? ["./Settings-kp480g2rhj.js","..\\main-kp480g2rhj.js","./main-kp480g2rhj.css","./datepicker-kp480g2rhj.js","./MultiSelectMenu-kp480g2rhj.js","./MultiSelectMenu-kp480g2rhj.css","./datepicker-kp480g2rhj.css","./Textarea-kp480g2rhj.js","./Switch-kp480g2rhj.js","./Switch-kp480g2rhj.css","./Settings-kp480g2rhj.css"] : void 0, import.meta.url));
  const MediaFilesTable = reactExports.lazy(() => __vitePreload(() => import("./MediaFilesTable-kp480g2rhj.js"), true ? ["./MediaFilesTable-kp480g2rhj.js","..\\main-kp480g2rhj.js","./main-kp480g2rhj.css","./ModuleViewHeaderBottom-kp480g2rhj.js","./datepicker-kp480g2rhj.js","./MultiSelectMenu-kp480g2rhj.js","./MultiSelectMenu-kp480g2rhj.css","./datepicker-kp480g2rhj.css","./ModuleViewHeaderBottom-kp480g2rhj.css","./TagsMenu-kp480g2rhj.js","./Tooltip_SortingFiltering-kp480g2rhj.js","./icon-link-kp480g2rhj.js"] : void 0, import.meta.url));
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

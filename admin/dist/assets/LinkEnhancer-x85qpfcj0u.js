import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-x85qpfcj0u.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-x85qpfcj0u.js";
/* empty css                              */function LinkEnhancerOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Links Manager module is a must-have for any website owner. It is designed to help you monitor and maintain all your internal and external links."), /* @__PURE__ */ React.createElement("p", null, "The module can also hide all invalid and non-SEO-friendly links. This is a great feature as it can help to improve your website’s overall performance in search engine rankings. Plus, it eliminates any risks connected with having broken links. It is especially important as it can have a detrimental effect on your organic traffic."), /* @__PURE__ */ React.createElement("p", null, "Overall, it is a great tool that can help ensure that all your links are working properly and that your website runs optimally. As a result, it can improve the user experience and protect your website from any potential risks associated with broken links.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function LinkEnhancer({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["url", __("Links")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-x85qpfcj0u.js"), true ? ["./Settings-x85qpfcj0u.js","..\\main-x85qpfcj0u.js","./main-x85qpfcj0u.css","./datepicker-x85qpfcj0u.js","./MultiSelectMenu-x85qpfcj0u.js","./MultiSelectMenu-x85qpfcj0u.css","./datepicker-x85qpfcj0u.css","./Textarea-x85qpfcj0u.js","./Switch-x85qpfcj0u.js","./Switch-x85qpfcj0u.css","./Settings-x85qpfcj0u.css"] : void 0, import.meta.url));
  const LinkManagerTable = reactExports.lazy(() => __vitePreload(() => import("./LinkManagerTable-x85qpfcj0u.js"), true ? ["./LinkManagerTable-x85qpfcj0u.js","..\\main-x85qpfcj0u.js","./main-x85qpfcj0u.css","./ModuleViewHeaderBottom-x85qpfcj0u.js","./datepicker-x85qpfcj0u.js","./MultiSelectMenu-x85qpfcj0u.js","./MultiSelectMenu-x85qpfcj0u.css","./datepicker-x85qpfcj0u.css","./ModuleViewHeaderBottom-x85qpfcj0u.css","./TagsMenu-x85qpfcj0u.js","./Tooltip_SortingFiltering-x85qpfcj0u.js","./icon-link-x85qpfcj0u.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(LinkEnhancerOverview, { moduleId }), activeSection === "url" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(LinkManagerTable, { slug: "url" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  LinkEnhancer as default
};

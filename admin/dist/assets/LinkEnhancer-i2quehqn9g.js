import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-i2quehqn9g.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-i2quehqn9g.js";
import "./api-exclamation-i2quehqn9g.js";
/* empty css                              */function LinkEnhancerOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Links Manager module is a must-have for any website owner. It is designed to help you monitor and maintain all your internal and external links."), /* @__PURE__ */ React.createElement("p", null, "The module can also hide all invalid and non-SEO-friendly links. This is a great feature as it can help to improve your website’s overall performance in search engine rankings. Plus, it eliminates any risks connected with having broken links. It is especially important as it can have a detrimental effect on your organic traffic."), /* @__PURE__ */ React.createElement("p", null, "Overall, it is a great tool that can help ensure that all your links are working properly and that your website runs optimally. As a result, it can improve the user experience and protect your website from any potential risks associated with broken links."));
}
function LinkEnhancer({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["url", __("Links")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-i2quehqn9g.js"), true ? ["./Settings-i2quehqn9g.js","../main-i2quehqn9g.js","./main.css","./InputField-i2quehqn9g.js","./datepicker-i2quehqn9g.css","./Switch-i2quehqn9g.js","./Switch-i2quehqn9g.css","./useMutation-i2quehqn9g.js","./Settings-i2quehqn9g.css"] : void 0, import.meta.url));
  const LinkManagerTable = reactExports.lazy(() => __vitePreload(() => import("./LinkManagerTable-i2quehqn9g.js"), true ? ["./LinkManagerTable-i2quehqn9g.js","../main-i2quehqn9g.js","./main.css","./useTableUpdater-i2quehqn9g.js","./_ColumnsMenu-i2quehqn9g.js","./_ColumnsMenu-i2quehqn9g.css","./InputField-i2quehqn9g.js","./datepicker-i2quehqn9g.css","./useMutation-i2quehqn9g.js","./DateTimeFormat-i2quehqn9g.js","./TagsMenu-i2quehqn9g.js","./Tooltip_SortingFiltering-i2quehqn9g.js","./icon-link-i2quehqn9g.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(LinkEnhancerOverview, null)), activeSection === "url" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(LinkManagerTable, { slug: "url" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  LinkEnhancer as default
};

import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-4ubwwdp8j8i.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-4ubwwdp8j8i.js";
import "./api-exclamation-4ubwwdp8j8i.js";
/* empty css                               */function LinkEnhancerOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Links Manager module is a must-have for any website owner. It is designed to help you monitor and maintain all your internal and external links."), /* @__PURE__ */ React.createElement("p", null, "The module can also hide all invalid and non-SEO-friendly links. This is a great feature as it can help to improve your website’s overall performance in search engine rankings. Plus, it eliminates any risks connected with having broken links. It is especially important as it can have a detrimental effect on your organic traffic."), /* @__PURE__ */ React.createElement("p", null, "Overall, it is a great tool that can help ensure that all your links are working properly and that your website runs optimally. As a result, it can improve the user experience and protect your website from any potential risks associated with broken links."));
}
function LinkEnhancer({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["url", __("Links")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-4ubwwdp8j8i.js"), true ? ["./Settings-4ubwwdp8j8i.js","../main-4ubwwdp8j8i.js","./main.css","./Tooltip-4ubwwdp8j8i.js","./Tooltip-4ubwwdp8j8i.css","./Switch-4ubwwdp8j8i.js","./Switch-4ubwwdp8j8i.css","./useMutation-4ubwwdp8j8i.js","./Settings-4ubwwdp8j8i.css"] : void 0, import.meta.url));
  const LinkManagerTable = reactExports.lazy(() => __vitePreload(() => import("./LinkManagerTable-4ubwwdp8j8i.js"), true ? ["./LinkManagerTable-4ubwwdp8j8i.js","../main-4ubwwdp8j8i.js","./main.css","./useTableUpdater-4ubwwdp8j8i.js","./Tooltip-4ubwwdp8j8i.js","./Tooltip-4ubwwdp8j8i.css","./useMutation-4ubwwdp8j8i.js","./useTableUpdater-4ubwwdp8j8i.css","./DateTimeFormat-4ubwwdp8j8i.js","./icon-link-4ubwwdp8j8i.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(LinkEnhancerOverview, null)), activeSection === "url" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(LinkManagerTable, { slug: "url" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  LinkEnhancer as default
};

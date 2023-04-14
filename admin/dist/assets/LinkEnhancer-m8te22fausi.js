import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-m8te22fausi.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-m8te22fausi.js";
import "./api-exclamation-m8te22fausi.js";
/* empty css                               */function LinkEnhancerOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Links Manager module is a must-have for any website owner. It is designed to help you monitor and maintain all your internal and external links."), /* @__PURE__ */ React.createElement("p", null, "The module can also hide all invalid and non-SEO-friendly links. This is a great feature as it can help to improve your website’s overall performance in search engine rankings. Plus, it eliminates any risks connected with having broken links. It is especially important as it can have a detrimental effect on your organic traffic."), /* @__PURE__ */ React.createElement("p", null, "Overall, it is a great tool that can help ensure that all your links are working properly and that your website runs optimally. As a result, it can improve the user experience and protect your website from any potential risks associated with broken links."));
}
function LinkEnhancer({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["url", __("Links")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-m8te22fausi.js"), true ? ["./Settings-m8te22fausi.js","../main-m8te22fausi.js","./main.css","./datepicker-m8te22fausi.js","./datepicker-m8te22fausi.css","./Switch-m8te22fausi.js","./Switch-m8te22fausi.css","./useMutation-m8te22fausi.js","./Settings-m8te22fausi.css"] : void 0, import.meta.url));
  const LinkManagerTable = reactExports.lazy(() => __vitePreload(() => import("./LinkManagerTable-m8te22fausi.js"), true ? ["./LinkManagerTable-m8te22fausi.js","../main-m8te22fausi.js","./main.css","./useTableUpdater-m8te22fausi.js","./datepicker-m8te22fausi.js","./datepicker-m8te22fausi.css","./useMutation-m8te22fausi.js","./useTableUpdater-m8te22fausi.css","./icon-link-m8te22fausi.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(LinkEnhancerOverview, null)), activeSection === "url" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(LinkManagerTable, { slug: "url" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  LinkEnhancer as default
};

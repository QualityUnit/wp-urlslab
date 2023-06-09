<<<<<<< HEAD:admin/dist/assets/LinkEnhancer-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/LinkEnhancer-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/LinkEnhancer-txs3jaim6w.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { u as useI18n, _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/LinkEnhancer-myg4akepfo.js
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-6ohoyviu4u.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-6ohoyviu4u.js";
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/LinkEnhancer-6ohoyviu4u.js
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-wnppnrkdix.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-wnppnrkdix.js";
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/LinkEnhancer-wnppnrkdix.js
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
<<<<<<< HEAD:admin/dist/assets/LinkEnhancer-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/LinkEnhancer-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/LinkEnhancer-txs3jaim6w.js
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-txs3jaim6w.js"), true ? ["./Settings-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./Textarea-txs3jaim6w.js","./Switch-txs3jaim6w.js","./Switch-txs3jaim6w.css","./Settings-txs3jaim6w.css"] : void 0, import.meta.url));
  const LinkManagerTable = reactExports.lazy(() => __vitePreload(() => import("./LinkManagerTable-txs3jaim6w.js"), true ? ["./LinkManagerTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./TagsMenu-txs3jaim6w.js","./Tooltip_SortingFiltering-txs3jaim6w.js","./icon-link-txs3jaim6w.js"] : void 0, import.meta.url));
========
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-myg4akepfo.js"), true ? ["./Settings-myg4akepfo.js","./index-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./Textarea-myg4akepfo.js","./Switch-myg4akepfo.js","./Switch-myg4akepfo.css","./Settings-myg4akepfo.css"] : void 0, import.meta.url));
  const LinkManagerTable = reactExports.lazy(() => __vitePreload(() => import("./LinkManagerTable-myg4akepfo.js"), true ? ["./LinkManagerTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./TagsMenu-myg4akepfo.js","./Tooltip_SortingFiltering-myg4akepfo.js","./icon-link-myg4akepfo.js"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/LinkEnhancer-myg4akepfo.js
=======
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-6ohoyviu4u.js"), true ? ["./Settings-6ohoyviu4u.js","..\\main-6ohoyviu4u.js","./main-6ohoyviu4u.css","./datepicker-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.css","./datepicker-6ohoyviu4u.css","./Textarea-6ohoyviu4u.js","./Switch-6ohoyviu4u.js","./Switch-6ohoyviu4u.css","./Settings-6ohoyviu4u.css"] : void 0, import.meta.url));
  const LinkManagerTable = reactExports.lazy(() => __vitePreload(() => import("./LinkManagerTable-6ohoyviu4u.js"), true ? ["./LinkManagerTable-6ohoyviu4u.js","..\\main-6ohoyviu4u.js","./main-6ohoyviu4u.css","./ModuleViewHeaderBottom-6ohoyviu4u.js","./datepicker-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.css","./datepicker-6ohoyviu4u.css","./ModuleViewHeaderBottom-6ohoyviu4u.css","./TagsMenu-6ohoyviu4u.js","./Tooltip_SortingFiltering-6ohoyviu4u.js","./icon-link-6ohoyviu4u.js"] : void 0, import.meta.url));
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/LinkEnhancer-6ohoyviu4u.js
=======
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-wnppnrkdix.js"), true ? ["./Settings-wnppnrkdix.js","..\\main-wnppnrkdix.js","./main-wnppnrkdix.css","./datepicker-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.css","./datepicker-wnppnrkdix.css","./Textarea-wnppnrkdix.js","./Switch-wnppnrkdix.js","./Switch-wnppnrkdix.css","./Settings-wnppnrkdix.css"] : void 0, import.meta.url));
  const LinkManagerTable = reactExports.lazy(() => __vitePreload(() => import("./LinkManagerTable-wnppnrkdix.js"), true ? ["./LinkManagerTable-wnppnrkdix.js","..\\main-wnppnrkdix.js","./main-wnppnrkdix.css","./ModuleViewHeaderBottom-wnppnrkdix.js","./datepicker-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.css","./datepicker-wnppnrkdix.css","./ModuleViewHeaderBottom-wnppnrkdix.css","./TagsMenu-wnppnrkdix.js","./Tooltip_SortingFiltering-wnppnrkdix.js","./icon-link-wnppnrkdix.js"] : void 0, import.meta.url));
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/LinkEnhancer-wnppnrkdix.js
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

<<<<<<< HEAD:admin/dist/assets/Cache-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/Cache-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/Cache-txs3jaim6w.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { u as useI18n, _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/Cache-myg4akepfo.js
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-6ohoyviu4u.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-6ohoyviu4u.js";
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/Cache-6ohoyviu4u.js
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-wnppnrkdix.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-wnppnrkdix.js";
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/Cache-wnppnrkdix.js
/* empty css                              */function CacheOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "Our state-of-the-art caching module, meticulously engineered to dramatically boost your website's loading speed and overall performance. Our cutting-edge solution guarantees that your end-users will enjoy a seamless browsing experience, devoid of any delays. Harnessing sophisticated caching techniques, frequently accessed files, images, and pages on your website will be stored and instantly available, significantly reducing load times."), /* @__PURE__ */ React.createElement("p", null, "At the heart of our caching module lies an intelligent system that pinpoints the most commonly requested resources on your website and effectively stores them. This eradicates the need for redundant data retrieval from the server, ultimately decreasing server load and bandwidth usage."), /* @__PURE__ */ React.createElement("p", null, "Furthermore, our highly adaptable module empowers you to effortlessly configure and fine-tune caching rules in accordance with your website's unique needs. By allowing complete customization, our module ensures optimal performance while catering to individual requirements, making it an indispensable tool for enhancing your online presence.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function Cache({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["cache-rules", __("Cache Rules")]
  ]);
<<<<<<< HEAD:admin/dist/assets/Cache-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/Cache-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/Cache-txs3jaim6w.js
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-txs3jaim6w.js"), true ? ["./Settings-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./Textarea-txs3jaim6w.js","./Switch-txs3jaim6w.js","./Switch-txs3jaim6w.css","./Settings-txs3jaim6w.css"] : void 0, import.meta.url));
  const CacheRulesTable = reactExports.lazy(() => __vitePreload(() => import("./CacheRulesTable-txs3jaim6w.js"), true ? ["./CacheRulesTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./TagsMenu-txs3jaim6w.js","./Tooltip_SortingFiltering-txs3jaim6w.js","./icon-edit-txs3jaim6w.js"] : void 0, import.meta.url));
========
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-myg4akepfo.js"), true ? ["./Settings-myg4akepfo.js","./index-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./Textarea-myg4akepfo.js","./Switch-myg4akepfo.js","./Switch-myg4akepfo.css","./Settings-myg4akepfo.css"] : void 0, import.meta.url));
  const CacheRulesTable = reactExports.lazy(() => __vitePreload(() => import("./CacheRulesTable-myg4akepfo.js"), true ? ["./CacheRulesTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./TagsMenu-myg4akepfo.js","./Tooltip_SortingFiltering-myg4akepfo.js","./icon-edit-myg4akepfo.js"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/Cache-myg4akepfo.js
=======
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-6ohoyviu4u.js"), true ? ["./Settings-6ohoyviu4u.js","..\\main-6ohoyviu4u.js","./main-6ohoyviu4u.css","./datepicker-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.css","./datepicker-6ohoyviu4u.css","./Textarea-6ohoyviu4u.js","./Switch-6ohoyviu4u.js","./Switch-6ohoyviu4u.css","./Settings-6ohoyviu4u.css"] : void 0, import.meta.url));
  const CacheRulesTable = reactExports.lazy(() => __vitePreload(() => import("./CacheRulesTable-6ohoyviu4u.js"), true ? ["./CacheRulesTable-6ohoyviu4u.js","..\\main-6ohoyviu4u.js","./main-6ohoyviu4u.css","./ModuleViewHeaderBottom-6ohoyviu4u.js","./datepicker-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.css","./datepicker-6ohoyviu4u.css","./ModuleViewHeaderBottom-6ohoyviu4u.css","./TagsMenu-6ohoyviu4u.js","./Tooltip_SortingFiltering-6ohoyviu4u.js","./icon-edit-6ohoyviu4u.js"] : void 0, import.meta.url));
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/Cache-6ohoyviu4u.js
=======
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-wnppnrkdix.js"), true ? ["./Settings-wnppnrkdix.js","..\\main-wnppnrkdix.js","./main-wnppnrkdix.css","./datepicker-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.css","./datepicker-wnppnrkdix.css","./Textarea-wnppnrkdix.js","./Switch-wnppnrkdix.js","./Switch-wnppnrkdix.css","./Settings-wnppnrkdix.css"] : void 0, import.meta.url));
  const CacheRulesTable = reactExports.lazy(() => __vitePreload(() => import("./CacheRulesTable-wnppnrkdix.js"), true ? ["./CacheRulesTable-wnppnrkdix.js","..\\main-wnppnrkdix.js","./main-wnppnrkdix.css","./ModuleViewHeaderBottom-wnppnrkdix.js","./datepicker-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.css","./datepicker-wnppnrkdix.css","./ModuleViewHeaderBottom-wnppnrkdix.css","./TagsMenu-wnppnrkdix.js","./Tooltip_SortingFiltering-wnppnrkdix.js","./icon-edit-wnppnrkdix.js"] : void 0, import.meta.url));
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/Cache-wnppnrkdix.js
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(CacheOverview, { moduleId }), activeSection === "cache-rules" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(CacheRulesTable, { slug: "cache-rules" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Cache as default
};

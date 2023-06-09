<<<<<<< HEAD:admin/dist/assets/CustomHtml-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/CustomHtml-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/CustomHtml-txs3jaim6w.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { u as useI18n, _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/CustomHtml-myg4akepfo.js
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-6ohoyviu4u.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-6ohoyviu4u.js";
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/CustomHtml-6ohoyviu4u.js
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-wnppnrkdix.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-wnppnrkdix.js";
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/CustomHtml-wnppnrkdix.js
/* empty css                              */function CustomHtmlOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Custom HTML Injection module is a versatile and powerful solution designed to seamlessly integrate custom HTML code into any section of your web page. This invaluable tool is essential for implementing scripts such as Google Tag Manager and other third-party services."), /* @__PURE__ */ React.createElement("p", null, "One of the standout features of the module is its ability to define specific rules for loading your custom HTML code, providing you with ultimate control over the precise location where your code will be executed. This targeted approach ensures that your code has the desired impact on your site's user experience while eliminating any potential conflicts with other elements.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function CustomHtml({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["custom-html", __("Custom HTML")]
  ]);
<<<<<<< HEAD:admin/dist/assets/CustomHtml-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/CustomHtml-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/CustomHtml-txs3jaim6w.js
  const CustomHtmlTable = reactExports.lazy(() => __vitePreload(() => import("./CustomHtmlTable-txs3jaim6w.js"), true ? ["./CustomHtmlTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./TagsMenu-txs3jaim6w.js","./Tooltip_SortingFiltering-txs3jaim6w.js","./Textarea-txs3jaim6w.js","./icon-edit-txs3jaim6w.js","./transform-txs3jaim6w.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-txs3jaim6w.js"), true ? ["./Settings-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./Textarea-txs3jaim6w.js","./Switch-txs3jaim6w.js","./Switch-txs3jaim6w.css","./Settings-txs3jaim6w.css"] : void 0, import.meta.url));
========
  const CustomHtmlTable = reactExports.lazy(() => __vitePreload(() => import("./CustomHtmlTable-myg4akepfo.js"), true ? ["./CustomHtmlTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./TagsMenu-myg4akepfo.js","./Tooltip_SortingFiltering-myg4akepfo.js","./Textarea-myg4akepfo.js","./icon-edit-myg4akepfo.js","./transform-myg4akepfo.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-myg4akepfo.js"), true ? ["./Settings-myg4akepfo.js","./index-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./Textarea-myg4akepfo.js","./Switch-myg4akepfo.js","./Switch-myg4akepfo.css","./Settings-myg4akepfo.css"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/CustomHtml-myg4akepfo.js
=======
  const CustomHtmlTable = reactExports.lazy(() => __vitePreload(() => import("./CustomHtmlTable-6ohoyviu4u.js"), true ? ["./CustomHtmlTable-6ohoyviu4u.js","..\\main-6ohoyviu4u.js","./main-6ohoyviu4u.css","./ModuleViewHeaderBottom-6ohoyviu4u.js","./datepicker-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.css","./datepicker-6ohoyviu4u.css","./ModuleViewHeaderBottom-6ohoyviu4u.css","./TagsMenu-6ohoyviu4u.js","./Tooltip_SortingFiltering-6ohoyviu4u.js","./Textarea-6ohoyviu4u.js","./icon-edit-6ohoyviu4u.js","./transform-6ohoyviu4u.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-6ohoyviu4u.js"), true ? ["./Settings-6ohoyviu4u.js","..\\main-6ohoyviu4u.js","./main-6ohoyviu4u.css","./datepicker-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.css","./datepicker-6ohoyviu4u.css","./Textarea-6ohoyviu4u.js","./Switch-6ohoyviu4u.js","./Switch-6ohoyviu4u.css","./Settings-6ohoyviu4u.css"] : void 0, import.meta.url));
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/CustomHtml-6ohoyviu4u.js
=======
  const CustomHtmlTable = reactExports.lazy(() => __vitePreload(() => import("./CustomHtmlTable-wnppnrkdix.js"), true ? ["./CustomHtmlTable-wnppnrkdix.js","..\\main-wnppnrkdix.js","./main-wnppnrkdix.css","./ModuleViewHeaderBottom-wnppnrkdix.js","./datepicker-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.css","./datepicker-wnppnrkdix.css","./ModuleViewHeaderBottom-wnppnrkdix.css","./TagsMenu-wnppnrkdix.js","./Tooltip_SortingFiltering-wnppnrkdix.js","./Textarea-wnppnrkdix.js","./icon-edit-wnppnrkdix.js","./transform-wnppnrkdix.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-wnppnrkdix.js"), true ? ["./Settings-wnppnrkdix.js","..\\main-wnppnrkdix.js","./main-wnppnrkdix.css","./datepicker-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.css","./datepicker-wnppnrkdix.css","./Textarea-wnppnrkdix.js","./Switch-wnppnrkdix.js","./Switch-wnppnrkdix.css","./Settings-wnppnrkdix.css"] : void 0, import.meta.url));
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/CustomHtml-wnppnrkdix.js
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(CustomHtmlOverview, { moduleId }), activeSection === "custom-html" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(CustomHtmlTable, { slug: "custom-html" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  CustomHtml as default
};

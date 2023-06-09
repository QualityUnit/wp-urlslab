<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-txs3jaim6w.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { u as useI18n, _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/SearchAndReplace-myg4akepfo.js
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-6ohoyviu4u.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-6ohoyviu4u.js";
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/SearchAndReplace-6ohoyviu4u.js
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-wnppnrkdix.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-wnppnrkdix.js";
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/SearchAndReplace-wnppnrkdix.js
/* empty css                              */function SearchAndReplaceOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Search and Replace module is a potent and convenient tool that can save you time and frustration by automatically mass-replacing URLs and content on the fly. This is a great way to resolve any issues with the content quickly. Even better, all the changes that are made are completely reversible. No need to worry about making any permanent changes to the database or anything else; all the alterations can be undone with a single click."), /* @__PURE__ */ React.createElement("p", null, "Overall, the module is also incredibly versatile and can be used for various purposes. From replacing incorrect URLs in the content to correcting typos and other mistakes, the module can do it all. With such a wide range of capabilities, the Search and Replace module is an invaluable tool for anyone who needs to quickly and effectively make changes in the content.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function SearchAndReplace({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const slug = "search-replace";
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Replacements")]
  ]);
<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-txs3jaim6w.js
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-txs3jaim6w.js"), true ? ["./SearchReplaceTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./TagsMenu-txs3jaim6w.js","./Tooltip_SortingFiltering-txs3jaim6w.js","./icon-edit-txs3jaim6w.js","./transform-txs3jaim6w.js"] : void 0, import.meta.url));
========
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-myg4akepfo.js"), true ? ["./SearchReplaceTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./TagsMenu-myg4akepfo.js","./Tooltip_SortingFiltering-myg4akepfo.js","./icon-edit-myg4akepfo.js","./transform-myg4akepfo.js"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/SearchAndReplace-myg4akepfo.js
=======
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-6ohoyviu4u.js"), true ? ["./SearchReplaceTable-6ohoyviu4u.js","..\\main-6ohoyviu4u.js","./main-6ohoyviu4u.css","./ModuleViewHeaderBottom-6ohoyviu4u.js","./datepicker-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.css","./datepicker-6ohoyviu4u.css","./ModuleViewHeaderBottom-6ohoyviu4u.css","./TagsMenu-6ohoyviu4u.js","./Tooltip_SortingFiltering-6ohoyviu4u.js","./icon-edit-6ohoyviu4u.js","./transform-6ohoyviu4u.js"] : void 0, import.meta.url));
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/SearchAndReplace-6ohoyviu4u.js
=======
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-wnppnrkdix.js"), true ? ["./SearchReplaceTable-wnppnrkdix.js","..\\main-wnppnrkdix.js","./main-wnppnrkdix.css","./ModuleViewHeaderBottom-wnppnrkdix.js","./datepicker-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.css","./datepicker-wnppnrkdix.css","./ModuleViewHeaderBottom-wnppnrkdix.css","./TagsMenu-wnppnrkdix.js","./Tooltip_SortingFiltering-wnppnrkdix.js","./icon-edit-wnppnrkdix.js","./transform-wnppnrkdix.js"] : void 0, import.meta.url));
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/SearchAndReplace-wnppnrkdix.js
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      noSettings: true,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(SearchAndReplaceOverview, { moduleId }), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SearchReplaceTable, { slug })));
}
export {
  SearchAndReplace as default
};

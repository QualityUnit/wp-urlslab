<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-vqw3w5p1iw.js
<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-vqw3w5p1iw.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-vqw3w5p1iw.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-vqw3w5p1iw.js";
=======
<<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-txs3jaim6w.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { u as useI18n, _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/SearchAndReplace-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/SearchAndReplace-txs3jaim6w.js
/* empty css                              */function SearchAndReplaceOverview({ moduleId }) {
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-o8x8qzqwuhk.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-o8x8qzqwuhk.js";
/* empty css                               */function SearchAndReplaceOverview({ moduleId }) {
>>>>>>> main:admin/dist/assets/SearchAndReplace-o8x8qzqwuhk.js
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
<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-vqw3w5p1iw.js
<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-vqw3w5p1iw.js
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-vqw3w5p1iw.js"), true ? ["./SearchReplaceTable-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.js","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.css","./TagsMenu-vqw3w5p1iw.js","./Tooltip_SortingFiltering-vqw3w5p1iw.js","./icon-edit-vqw3w5p1iw.js","./transform-vqw3w5p1iw.js"] : void 0, import.meta.url));
=======
<<<<<<<< HEAD:admin/dist/assets/SearchAndReplace-txs3jaim6w.js
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-txs3jaim6w.js"), true ? ["./SearchReplaceTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./TagsMenu-txs3jaim6w.js","./Tooltip_SortingFiltering-txs3jaim6w.js","./icon-edit-txs3jaim6w.js","./transform-txs3jaim6w.js"] : void 0, import.meta.url));
========
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-myg4akepfo.js"), true ? ["./SearchReplaceTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./TagsMenu-myg4akepfo.js","./Tooltip_SortingFiltering-myg4akepfo.js","./icon-edit-myg4akepfo.js","./transform-myg4akepfo.js"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/SearchAndReplace-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/SearchAndReplace-txs3jaim6w.js
=======
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-o8x8qzqwuhk.js"), true ? ["./SearchReplaceTable-o8x8qzqwuhk.js","../main-o8x8qzqwuhk.js","./main-o8x8qzqwuhk.css","./ModuleViewHeaderBottom-o8x8qzqwuhk.js","./datepicker-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.css","./ModuleViewHeaderBottom-o8x8qzqwuhk.css","./TagsMenu-o8x8qzqwuhk.js","./Tooltip_SortingFiltering-o8x8qzqwuhk.js","./icon-edit-o8x8qzqwuhk.js","./transform-o8x8qzqwuhk.js"] : void 0, import.meta.url));
>>>>>>> main:admin/dist/assets/SearchAndReplace-o8x8qzqwuhk.js
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

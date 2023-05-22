import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-o7jxnz8jys.js";
import { O as Overview, M as ModuleViewHeader } from "./ModuleViewHeader-o7jxnz8jys.js";
import "./Checkbox-o7jxnz8jys.js";
/* empty css                              */function SearchAndReplaceOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val) }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("p", null, "The Search and Replace module is a potent and convenient tool that can save you time and frustration by automatically mass-replacing URLs and content on the fly. This is a great way to resolve any issues with the content quickly. Even better, all the changes that are made are completely reversible. No need to worry about making any permanent changes to the database or anything else; all the alterations can be undone with a single click."), /* @__PURE__ */ React.createElement("p", null, "Overall, the module is also incredibly versatile and can be used for various purposes. From replacing incorrect URLs in the content to correcting typos and other mistakes, the module can do it all. With such a wide range of capabilities, the Search and Replace module is an invaluable tool for anyone who needs to quickly and effectively make changes in the content.")));
}
function SearchAndReplace({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const slug = "search-replace";
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Replacements")]
  ]);
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-o7jxnz8jys.js"), true ? ["./SearchReplaceTable-o7jxnz8jys.js","../main-o7jxnz8jys.js","./main-o7jxnz8jys.css","./ModuleViewHeaderBottom-o7jxnz8jys.js","./datepicker-o7jxnz8jys.js","./MultiSelectMenu-o7jxnz8jys.js","./Checkbox-o7jxnz8jys.js","./Checkbox-o7jxnz8jys.css","./MultiSelectMenu-o7jxnz8jys.css","./datepicker-o7jxnz8jys.css","./ModuleViewHeaderBottom-o7jxnz8jys.css","./TagsMenu-o7jxnz8jys.js","./Tooltip_SortingFiltering-o7jxnz8jys.js","./icon-edit-o7jxnz8jys.js","./transform-o7jxnz8jys.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      noSettings: true,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(SearchAndReplaceOverview, { moduleId }), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SearchReplaceTable, { slug })));
}
export {
  SearchAndReplace as default
};

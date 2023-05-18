import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-cahlic561m.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-cahlic561m.js";
/* empty css                              */function SearchAndReplaceOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Search and Replace module is a potent and convenient tool that can save you time and frustration by automatically mass-replacing URLs and content on the fly. This is a great way to resolve any issues with the content quickly. Even better, all the changes that are made are completely reversible. No need to worry about making any permanent changes to the database or anything else; all the alterations can be undone with a single click."), /* @__PURE__ */ React.createElement("p", null, "Overall, the module is also incredibly versatile and can be used for various purposes. From replacing incorrect URLs in the content to correcting typos and other mistakes, the module can do it all. With such a wide range of capabilities, the Search and Replace module is an invaluable tool for anyone who needs to quickly and effectively make changes in the content."));
}
function SearchAndReplace({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const slug = "search-replace";
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Replacements")]
  ]);
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-cahlic561m.js"), true ? ["./SearchReplaceTable-cahlic561m.js","../main-cahlic561m.js","./main-cahlic561m.css","./useTableUpdater-cahlic561m.js","./_ColumnsMenu-cahlic561m.js","./_ColumnsMenu-cahlic561m.css","./InputField-cahlic561m.js","./MultiSelectMenu-cahlic561m.js","./_Inputs-cahlic561m.css","./TagsMenu-cahlic561m.js","./Tooltip_SortingFiltering-cahlic561m.js","./icon-edit-cahlic561m.js","./transform-cahlic561m.js","./datepicker-cahlic561m.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      noSettings: true,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(SearchAndReplaceOverview, null)), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SearchReplaceTable, { slug })));
}
export {
  SearchAndReplace as default
};

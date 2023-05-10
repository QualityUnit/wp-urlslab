import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-nfjp4fmo45.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-nfjp4fmo45.js";
import "./api-exclamation-nfjp4fmo45.js";
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
  const SearchReplaceTable = reactExports.lazy(() => __vitePreload(() => import("./SearchReplaceTable-nfjp4fmo45.js"), true ? ["./SearchReplaceTable-nfjp4fmo45.js","../main-nfjp4fmo45.js","./main.css","./useTableUpdater-nfjp4fmo45.js","./_ColumnsMenu-nfjp4fmo45.js","./_ColumnsMenu-nfjp4fmo45.css","./InputField-nfjp4fmo45.js","./datepicker-nfjp4fmo45.css","./useMutation-nfjp4fmo45.js","./TagsMenu-nfjp4fmo45.js","./Tooltip_SortingFiltering-nfjp4fmo45.js","./icon-edit-nfjp4fmo45.js"] : void 0, import.meta.url));
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

import { r as reactExports, _ as __vitePreload, R as React } from "../main-6jhv8y4rimg.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-6jhv8y4rimg.js"), true ? ["./SchedulesTable-6jhv8y4rimg.js","../main-6jhv8y4rimg.js","./main.css","./useTableUpdater-6jhv8y4rimg.js","./_ColumnsMenu-6jhv8y4rimg.js","./_ColumnsMenu-6jhv8y4rimg.css","./FilterMenu-6jhv8y4rimg.js","./datepicker-6jhv8y4rimg.css","./useMutation-6jhv8y4rimg.js","./Tooltip_SortingFiltering-6jhv8y4rimg.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

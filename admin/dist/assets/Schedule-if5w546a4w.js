import { r as reactExports, _ as __vitePreload, R as React } from "../main-if5w546a4w.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-if5w546a4w.js"), true ? ["./SchedulesTable-if5w546a4w.js","../main-if5w546a4w.js","./main-if5w546a4w.css","./useTableUpdater-if5w546a4w.js","./_ColumnsMenu-if5w546a4w.js","./_ColumnsMenu-if5w546a4w.css","./InputField-if5w546a4w.js","./datepicker-if5w546a4w.css","./useMutation-if5w546a4w.js","./Tooltip_SortingFiltering-if5w546a4w.js","./_ModuleViewHeader-if5w546a4w.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

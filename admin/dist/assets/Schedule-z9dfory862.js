import { r as reactExports, _ as __vitePreload, R as React } from "../main-z9dfory862.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-z9dfory862.js"), true ? ["./SchedulesTable-z9dfory862.js","../main-z9dfory862.js","./main.css","./useTableUpdater-z9dfory862.js","./_ColumnsMenu-z9dfory862.js","./_ColumnsMenu-z9dfory862.css","./InputField-z9dfory862.js","./datepicker-z9dfory862.css","./useMutation-z9dfory862.js","./Tooltip_SortingFiltering-z9dfory862.js","./_ModuleViewHeader-z9dfory862.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

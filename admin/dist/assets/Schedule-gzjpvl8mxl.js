import { r as reactExports, _ as __vitePreload, R as React } from "../main-gzjpvl8mxl.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-gzjpvl8mxl.js"), true ? ["./SchedulesTable-gzjpvl8mxl.js","../main-gzjpvl8mxl.js","./main.css","./useTableUpdater-gzjpvl8mxl.js","./_ColumnsMenu-gzjpvl8mxl.js","./_ColumnsMenu-gzjpvl8mxl.css","./FilterMenu-gzjpvl8mxl.js","./datepicker-gzjpvl8mxl.css","./useMutation-gzjpvl8mxl.js","./Tooltip_SortingFiltering-gzjpvl8mxl.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

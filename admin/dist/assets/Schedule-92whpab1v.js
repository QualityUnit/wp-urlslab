import { r as reactExports, _ as __vitePreload, R as React } from "../main-92whpab1v.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-92whpab1v.js"), true ? ["./SchedulesTable-92whpab1v.js","../main-92whpab1v.js","./main.css","./useTableUpdater-92whpab1v.js","./_ColumnsMenu-92whpab1v.js","./_ColumnsMenu-92whpab1v.css","./InputField-92whpab1v.js","./datepicker-92whpab1v.css","./useMutation-92whpab1v.js","./Tooltip_SortingFiltering-92whpab1v.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

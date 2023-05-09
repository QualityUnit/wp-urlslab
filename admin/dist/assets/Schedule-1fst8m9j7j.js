import { r as reactExports, _ as __vitePreload, R as React } from "../main-1fst8m9j7j.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-1fst8m9j7j.js"), true ? ["./SchedulesTable-1fst8m9j7j.js","../main-1fst8m9j7j.js","./main.css","./useTableUpdater-1fst8m9j7j.js","./_ColumnsMenu-1fst8m9j7j.js","./_ColumnsMenu-1fst8m9j7j.css","./InputField-1fst8m9j7j.js","./datepicker-1fst8m9j7j.css","./useMutation-1fst8m9j7j.js","./Tooltip_SortingFiltering-1fst8m9j7j.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

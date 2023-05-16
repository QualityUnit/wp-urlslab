import { r as reactExports, _ as __vitePreload, R as React } from "../main-f4qgngjv6p.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-f4qgngjv6p.js"), true ? ["./SchedulesTable-f4qgngjv6p.js","../main-f4qgngjv6p.js","./main.css","./useTableUpdater-f4qgngjv6p.js","./_ColumnsMenu-f4qgngjv6p.js","./_ColumnsMenu-f4qgngjv6p.css","./InputField-f4qgngjv6p.js","./datepicker-f4qgngjv6p.css","./useMutation-f4qgngjv6p.js","./Tooltip_SortingFiltering-f4qgngjv6p.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

import { r as reactExports, _ as __vitePreload, R as React } from "../main-cx5x2dq6gh.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-cx5x2dq6gh.js"), true ? ["./SchedulesTable-cx5x2dq6gh.js","../main-cx5x2dq6gh.js","./main.css","./useTableUpdater-cx5x2dq6gh.js","./_ColumnsMenu-cx5x2dq6gh.js","./_ColumnsMenu-cx5x2dq6gh.css","./InputField-cx5x2dq6gh.js","./datepicker-cx5x2dq6gh.css","./useMutation-cx5x2dq6gh.js","./Tooltip_SortingFiltering-cx5x2dq6gh.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

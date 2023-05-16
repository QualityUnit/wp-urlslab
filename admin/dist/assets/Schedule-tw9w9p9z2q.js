import { r as reactExports, _ as __vitePreload, R as React } from "../main-tw9w9p9z2q.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-tw9w9p9z2q.js"), true ? ["./SchedulesTable-tw9w9p9z2q.js","../main-tw9w9p9z2q.js","./main.css","./useTableUpdater-tw9w9p9z2q.js","./_ColumnsMenu-tw9w9p9z2q.js","./_ColumnsMenu-tw9w9p9z2q.css","./InputField-tw9w9p9z2q.js","./datepicker-tw9w9p9z2q.css","./useMutation-tw9w9p9z2q.js","./Tooltip_SortingFiltering-tw9w9p9z2q.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

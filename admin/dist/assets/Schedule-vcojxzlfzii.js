import { r as reactExports, _ as __vitePreload, R as React } from "../main-vcojxzlfzii.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-vcojxzlfzii.js"), true ? ["./SchedulesTable-vcojxzlfzii.js","../main-vcojxzlfzii.js","./main.css","./useTableUpdater-vcojxzlfzii.js","./_ColumnsMenu-vcojxzlfzii.js","./_ColumnsMenu-vcojxzlfzii.css","./InputField-vcojxzlfzii.js","./datepicker-vcojxzlfzii.css","./useMutation-vcojxzlfzii.js","./Tooltip_SortingFiltering-vcojxzlfzii.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

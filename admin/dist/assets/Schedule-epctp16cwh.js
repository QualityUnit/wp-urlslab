import { r as reactExports, _ as __vitePreload, R as React } from "../main-epctp16cwh.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-epctp16cwh.js"), true ? ["./SchedulesTable-epctp16cwh.js","../main-epctp16cwh.js","./main.css","./useTableUpdater-epctp16cwh.js","./_ColumnsMenu-epctp16cwh.js","./_ColumnsMenu-epctp16cwh.css","./InputField-epctp16cwh.js","./datepicker-epctp16cwh.css","./useMutation-epctp16cwh.js","./Tooltip_SortingFiltering-epctp16cwh.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

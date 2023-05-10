import { r as reactExports, _ as __vitePreload, R as React } from "../main-nfjp4fmo45.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-nfjp4fmo45.js"), true ? ["./SchedulesTable-nfjp4fmo45.js","../main-nfjp4fmo45.js","./main.css","./useTableUpdater-nfjp4fmo45.js","./_ColumnsMenu-nfjp4fmo45.js","./_ColumnsMenu-nfjp4fmo45.css","./InputField-nfjp4fmo45.js","./datepicker-nfjp4fmo45.css","./useMutation-nfjp4fmo45.js","./Tooltip_SortingFiltering-nfjp4fmo45.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

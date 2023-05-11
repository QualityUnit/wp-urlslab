import { r as reactExports, _ as __vitePreload, R as React } from "../main-tnwkksz65s.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-tnwkksz65s.js"), true ? ["./SchedulesTable-tnwkksz65s.js","../main-tnwkksz65s.js","./main.css","./useTableUpdater-tnwkksz65s.js","./_ColumnsMenu-tnwkksz65s.js","./_ColumnsMenu-tnwkksz65s.css","./InputField-tnwkksz65s.js","./datepicker-tnwkksz65s.css","./useMutation-tnwkksz65s.js","./Tooltip_SortingFiltering-tnwkksz65s.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

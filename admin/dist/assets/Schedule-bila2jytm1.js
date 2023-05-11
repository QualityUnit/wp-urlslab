import { r as reactExports, _ as __vitePreload, R as React } from "../main-bila2jytm1.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-bila2jytm1.js"), true ? ["./SchedulesTable-bila2jytm1.js","../main-bila2jytm1.js","./main.css","./useTableUpdater-bila2jytm1.js","./_ColumnsMenu-bila2jytm1.js","./_ColumnsMenu-bila2jytm1.css","./InputField-bila2jytm1.js","./datepicker-bila2jytm1.css","./useMutation-bila2jytm1.js","./Tooltip_SortingFiltering-bila2jytm1.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

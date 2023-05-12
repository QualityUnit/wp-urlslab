import { r as reactExports, _ as __vitePreload, R as React } from "../main-detblgjz19.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-detblgjz19.js"), true ? ["./SchedulesTable-detblgjz19.js","../main-detblgjz19.js","./main.css","./useTableUpdater-detblgjz19.js","./_ColumnsMenu-detblgjz19.js","./_ColumnsMenu-detblgjz19.css","./InputField-detblgjz19.js","./datepicker-detblgjz19.css","./useMutation-detblgjz19.js","./Tooltip_SortingFiltering-detblgjz19.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

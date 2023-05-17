import { r as reactExports, _ as __vitePreload, R as React } from "../main-2d7oui9iv4.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-2d7oui9iv4.js"), true ? ["./SchedulesTable-2d7oui9iv4.js","../main-2d7oui9iv4.js","./main-2d7oui9iv4.css","./useTableUpdater-2d7oui9iv4.js","./_ColumnsMenu-2d7oui9iv4.js","./_ColumnsMenu-2d7oui9iv4.css","./InputField-2d7oui9iv4.js","./datepicker-2d7oui9iv4.css","./useMutation-2d7oui9iv4.js","./Tooltip_SortingFiltering-2d7oui9iv4.js","./_ModuleViewHeader-2d7oui9iv4.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

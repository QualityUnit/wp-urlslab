import { r as reactExports, _ as __vitePreload, R as React } from "../main-4usqniuwgy.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-4usqniuwgy.js"), true ? ["./SchedulesTable-4usqniuwgy.js","../main-4usqniuwgy.js","./main-4usqniuwgy.css","./useTableUpdater-4usqniuwgy.js","./_ColumnsMenu-4usqniuwgy.js","./_ColumnsMenu-4usqniuwgy.css","./InputField-4usqniuwgy.js","./MultiSelectMenu-4usqniuwgy.js","./_Inputs-4usqniuwgy.css","./Tooltip_SortingFiltering-4usqniuwgy.js","./datepicker-4usqniuwgy.css","./_ModuleViewHeader-4usqniuwgy.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

import { r as reactExports, _ as __vitePreload, R as React } from "../main-7ohaqko45xj.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-7ohaqko45xj.js"), true ? ["./SchedulesTable-7ohaqko45xj.js","../main-7ohaqko45xj.js","./main.css","./useTableUpdater-7ohaqko45xj.js","./_ColumnsMenu-7ohaqko45xj.js","./_ColumnsMenu-7ohaqko45xj.css","./InputField-7ohaqko45xj.js","./datepicker-7ohaqko45xj.css","./useMutation-7ohaqko45xj.js","./Tooltip_SortingFiltering-7ohaqko45xj.js","./_ModuleViewHeader-7ohaqko45xj.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

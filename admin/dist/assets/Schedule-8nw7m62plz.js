import { r as reactExports, _ as __vitePreload, R as React } from "../main-8nw7m62plz.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-8nw7m62plz.js"), true ? ["./SchedulesTable-8nw7m62plz.js","../main-8nw7m62plz.js","./main-8nw7m62plz.css","./useTableUpdater-8nw7m62plz.js","./_ColumnsMenu-8nw7m62plz.js","./_ColumnsMenu-8nw7m62plz.css","./InputField-8nw7m62plz.js","./datepicker-8nw7m62plz.css","./useMutation-8nw7m62plz.js","./Tooltip_SortingFiltering-8nw7m62plz.js","./_ModuleViewHeader-8nw7m62plz.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

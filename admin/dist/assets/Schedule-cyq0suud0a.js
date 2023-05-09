import { r as reactExports, _ as __vitePreload, R as React } from "../main-cyq0suud0a.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-cyq0suud0a.js"), true ? ["./SchedulesTable-cyq0suud0a.js","../main-cyq0suud0a.js","./main.css","./useTableUpdater-cyq0suud0a.js","./_ColumnsMenu-cyq0suud0a.js","./_ColumnsMenu-cyq0suud0a.css","./FilterMenu-cyq0suud0a.js","./datepicker-cyq0suud0a.css","./useMutation-cyq0suud0a.js","./Tooltip_SortingFiltering-cyq0suud0a.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

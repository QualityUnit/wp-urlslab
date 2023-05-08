import { r as reactExports, _ as __vitePreload, R as React } from "../main-jo94qtow04.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-jo94qtow04.js"), true ? ["./SchedulesTable-jo94qtow04.js","../main-jo94qtow04.js","./main.css","./useTableUpdater-jo94qtow04.js","./_ColumnsMenu-jo94qtow04.js","./_ColumnsMenu-jo94qtow04.css","./FilterMenu-jo94qtow04.js","./datepicker-jo94qtow04.css","./useMutation-jo94qtow04.js","./Tooltip_SortingFiltering-jo94qtow04.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

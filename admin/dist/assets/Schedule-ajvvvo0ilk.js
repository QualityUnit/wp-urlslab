import { r as reactExports, _ as __vitePreload, R as React } from "../main-ajvvvo0ilk.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-ajvvvo0ilk.js"), true ? ["./SchedulesTable-ajvvvo0ilk.js","../main-ajvvvo0ilk.js","./main.css","./useTableUpdater-ajvvvo0ilk.js","./_ColumnsMenu-ajvvvo0ilk.js","./_ColumnsMenu-ajvvvo0ilk.css","./InputField-ajvvvo0ilk.js","./datepicker-ajvvvo0ilk.css","./useMutation-ajvvvo0ilk.js","./Tooltip_SortingFiltering-ajvvvo0ilk.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

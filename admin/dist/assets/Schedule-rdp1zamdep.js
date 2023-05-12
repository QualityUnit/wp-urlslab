import { r as reactExports, _ as __vitePreload, R as React } from "../main-rdp1zamdep.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-rdp1zamdep.js"), true ? ["./SchedulesTable-rdp1zamdep.js","../main-rdp1zamdep.js","./main.css","./useTableUpdater-rdp1zamdep.js","./_ColumnsMenu-rdp1zamdep.js","./_ColumnsMenu-rdp1zamdep.css","./InputField-rdp1zamdep.js","./datepicker-rdp1zamdep.css","./useMutation-rdp1zamdep.js","./Tooltip_SortingFiltering-rdp1zamdep.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

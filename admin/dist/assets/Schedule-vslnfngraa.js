import { r as reactExports, _ as __vitePreload, R as React } from "../main-vslnfngraa.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-vslnfngraa.js"), true ? ["./SchedulesTable-vslnfngraa.js","../main-vslnfngraa.js","./main.css","./useTableUpdater-vslnfngraa.js","./_ColumnsMenu-vslnfngraa.js","./_ColumnsMenu-vslnfngraa.css","./InputField-vslnfngraa.js","./datepicker-vslnfngraa.css","./useMutation-vslnfngraa.js","./Tooltip_SortingFiltering-vslnfngraa.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

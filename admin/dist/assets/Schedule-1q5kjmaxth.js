import { r as reactExports, _ as __vitePreload, R as React } from "../main-1q5kjmaxth.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-1q5kjmaxth.js"), true ? ["./SchedulesTable-1q5kjmaxth.js","../main-1q5kjmaxth.js","./main.css","./useTableUpdater-1q5kjmaxth.js","./_ColumnsMenu-1q5kjmaxth.js","./_ColumnsMenu-1q5kjmaxth.css","./InputField-1q5kjmaxth.js","./datepicker-1q5kjmaxth.css","./useMutation-1q5kjmaxth.js","./Tooltip_SortingFiltering-1q5kjmaxth.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

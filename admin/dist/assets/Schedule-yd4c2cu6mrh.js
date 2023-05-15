import { r as reactExports, _ as __vitePreload, R as React } from "../main-yd4c2cu6mrh.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-yd4c2cu6mrh.js"), true ? ["./SchedulesTable-yd4c2cu6mrh.js","../main-yd4c2cu6mrh.js","./main.css","./useTableUpdater-yd4c2cu6mrh.js","./_ColumnsMenu-yd4c2cu6mrh.js","./_ColumnsMenu-yd4c2cu6mrh.css","./InputField-yd4c2cu6mrh.js","./datepicker-yd4c2cu6mrh.css","./useMutation-yd4c2cu6mrh.js","./Tooltip_SortingFiltering-yd4c2cu6mrh.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

import { r as reactExports, _ as __vitePreload, R as React } from "../main-ik6i5renkb.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-ik6i5renkb.js"), true ? ["./SchedulesTable-ik6i5renkb.js","../main-ik6i5renkb.js","./main.css","./useTableUpdater-ik6i5renkb.js","./_ColumnsMenu-ik6i5renkb.js","./_ColumnsMenu-ik6i5renkb.css","./InputField-ik6i5renkb.js","./datepicker-ik6i5renkb.css","./useMutation-ik6i5renkb.js","./Tooltip_SortingFiltering-ik6i5renkb.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

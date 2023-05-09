import { r as reactExports, _ as __vitePreload, R as React } from "../main-i2quehqn9g.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-i2quehqn9g.js"), true ? ["./SchedulesTable-i2quehqn9g.js","../main-i2quehqn9g.js","./main.css","./useTableUpdater-i2quehqn9g.js","./_ColumnsMenu-i2quehqn9g.js","./_ColumnsMenu-i2quehqn9g.css","./InputField-i2quehqn9g.js","./datepicker-i2quehqn9g.css","./useMutation-i2quehqn9g.js","./Tooltip_SortingFiltering-i2quehqn9g.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

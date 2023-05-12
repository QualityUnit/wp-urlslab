import { r as reactExports, _ as __vitePreload, R as React } from "../main-4mq953iyali.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-4mq953iyali.js"), true ? ["./SchedulesTable-4mq953iyali.js","../main-4mq953iyali.js","./main.css","./useTableUpdater-4mq953iyali.js","./_ColumnsMenu-4mq953iyali.js","./_ColumnsMenu-4mq953iyali.css","./InputField-4mq953iyali.js","./datepicker-4mq953iyali.css","./useMutation-4mq953iyali.js","./Tooltip_SortingFiltering-4mq953iyali.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

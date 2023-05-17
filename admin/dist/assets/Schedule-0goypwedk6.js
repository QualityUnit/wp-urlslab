import { r as reactExports, _ as __vitePreload, R as React } from "../main-0goypwedk6.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-0goypwedk6.js"), true ? ["./SchedulesTable-0goypwedk6.js","../main-0goypwedk6.js","./main-0goypwedk6.css","./useTableUpdater-0goypwedk6.js","./_ColumnsMenu-0goypwedk6.js","./_ColumnsMenu-0goypwedk6.css","./InputField-0goypwedk6.js","./datepicker-0goypwedk6.css","./useMutation-0goypwedk6.js","./Tooltip_SortingFiltering-0goypwedk6.js","./_ModuleViewHeader-0goypwedk6.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

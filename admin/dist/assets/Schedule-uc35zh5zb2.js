import { r as reactExports, _ as __vitePreload, R as React } from "../main-uc35zh5zb2.js";
function Schedule() {
  const slug = "schedule";
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-uc35zh5zb2.js"), true ? ["./SchedulesTable-uc35zh5zb2.js","../main-uc35zh5zb2.js","./main-uc35zh5zb2.css","./useTableUpdater-uc35zh5zb2.js","./_ColumnsMenu-uc35zh5zb2.js","./_ColumnsMenu-uc35zh5zb2.css","./InputField-uc35zh5zb2.js","./datepicker-uc35zh5zb2.css","./useMutation-uc35zh5zb2.js","./Tooltip_SortingFiltering-uc35zh5zb2.js","./_ModuleViewHeader-uc35zh5zb2.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

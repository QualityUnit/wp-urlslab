import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-b65fm56nnz.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-b65fm56nnz.js"), true ? ["./SchedulesTable-b65fm56nnz.js","../main-b65fm56nnz.js","./main.css","./useTableUpdater-b65fm56nnz.js","./datepicker-b65fm56nnz.js","./datepicker-b65fm56nnz.css","./useMutation-b65fm56nnz.js","./useTableUpdater-b65fm56nnz.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

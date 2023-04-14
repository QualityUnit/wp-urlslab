import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-qsmdpkosql.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-qsmdpkosql.js"), true ? ["./SchedulesTable-qsmdpkosql.js","../main-qsmdpkosql.js","./main.css","./useTableUpdater-qsmdpkosql.js","./datepicker-qsmdpkosql.js","./datepicker-qsmdpkosql.css","./useMutation-qsmdpkosql.js","./useTableUpdater-qsmdpkosql.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

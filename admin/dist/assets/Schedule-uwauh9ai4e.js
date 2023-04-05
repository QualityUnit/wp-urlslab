import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-uwauh9ai4e.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-uwauh9ai4e.js"), true ? ["./SchedulesTable-uwauh9ai4e.js","../main-uwauh9ai4e.js","./main.css","./useTableUpdater-uwauh9ai4e.js","./datepicker-uwauh9ai4e.js","./datepicker-uwauh9ai4e.css","./useMutation-uwauh9ai4e.js","./useTableUpdater-uwauh9ai4e.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

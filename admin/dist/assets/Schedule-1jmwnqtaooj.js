import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-1jmwnqtaooj.js";
/* empty css                               */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-1jmwnqtaooj.js"), true ? ["./SchedulesTable-1jmwnqtaooj.js","../main-1jmwnqtaooj.js","./main.css","./useTableUpdater-1jmwnqtaooj.js","./datepicker-1jmwnqtaooj.js","./datepicker-1jmwnqtaooj.css","./useMutation-1jmwnqtaooj.js","./useTableUpdater-1jmwnqtaooj.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

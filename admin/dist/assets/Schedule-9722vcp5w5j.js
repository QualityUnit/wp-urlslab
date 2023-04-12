import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-9722vcp5w5j.js";
/* empty css                               */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-9722vcp5w5j.js"), true ? ["./SchedulesTable-9722vcp5w5j.js","../main-9722vcp5w5j.js","./main.css","./useTableUpdater-9722vcp5w5j.js","./datepicker-9722vcp5w5j.js","./datepicker-9722vcp5w5j.css","./useMutation-9722vcp5w5j.js","./useTableUpdater-9722vcp5w5j.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

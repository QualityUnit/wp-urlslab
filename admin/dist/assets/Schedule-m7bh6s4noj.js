import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-m7bh6s4noj.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-m7bh6s4noj.js"), true ? ["./SchedulesTable-m7bh6s4noj.js","../main-m7bh6s4noj.js","./main.css","./useTableUpdater-m7bh6s4noj.js","./datepicker-m7bh6s4noj.js","./datepicker-m7bh6s4noj.css","./useMutation-m7bh6s4noj.js","./useTableUpdater-m7bh6s4noj.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

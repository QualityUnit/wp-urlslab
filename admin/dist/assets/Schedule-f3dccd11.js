import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../settings.js";
/* empty css                            */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-8015894d.js"), true ? ["./SchedulesTable-8015894d.js","../settings.js","./main.css","./useTableUpdater-eb9e545c.js","./datepicker-ff7dcd9b.js","./datepicker.css","./useMutation-6f0dd623.js","./useTableUpdater.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

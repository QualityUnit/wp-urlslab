import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../settings.js";
/* empty css                            */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-fac63504.js"), true ? ["./SchedulesTable-fac63504.js","../settings.js","./main.css","./useTableUpdater-afa37684.js","./datepicker-ff7dcd9b.js","./datepicker.css","./useMutation-1e5291cb.js","./useTableUpdater.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

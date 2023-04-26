import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-djykm1j602.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-djykm1j602.js"), true ? ["./SchedulesTable-djykm1j602.js","../main-djykm1j602.js","./main.css","./useTableUpdater-djykm1j602.js","./datepicker-djykm1j602.js","./datepicker-djykm1j602.css","./useMutation-djykm1j602.js","./useTableUpdater-djykm1j602.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

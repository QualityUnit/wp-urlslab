import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-y40g2arl2u.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-y40g2arl2u.js"), true ? ["./SchedulesTable-y40g2arl2u.js","../main-y40g2arl2u.js","./main.css","./useTableUpdater-y40g2arl2u.js","./datepicker-y40g2arl2u.js","./datepicker-y40g2arl2u.css","./useMutation-y40g2arl2u.js","./useTableUpdater-y40g2arl2u.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

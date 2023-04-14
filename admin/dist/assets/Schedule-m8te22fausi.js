import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-m8te22fausi.js";
/* empty css                               */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-m8te22fausi.js"), true ? ["./SchedulesTable-m8te22fausi.js","../main-m8te22fausi.js","./main.css","./useTableUpdater-m8te22fausi.js","./datepicker-m8te22fausi.js","./datepicker-m8te22fausi.css","./useMutation-m8te22fausi.js","./useTableUpdater-m8te22fausi.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

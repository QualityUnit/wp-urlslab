import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-0ikdlurw95.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-0ikdlurw95.js"), true ? ["./SchedulesTable-0ikdlurw95.js","../main-0ikdlurw95.js","./main.css","./useTableUpdater-0ikdlurw95.js","./datepicker-0ikdlurw95.js","./datepicker-0ikdlurw95.css","./useMutation-0ikdlurw95.js","./useTableUpdater-0ikdlurw95.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

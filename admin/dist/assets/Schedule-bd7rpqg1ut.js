import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-bd7rpqg1ut.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-bd7rpqg1ut.js"), true ? ["./SchedulesTable-bd7rpqg1ut.js","../main-bd7rpqg1ut.js","./main.css","./useTableUpdater-bd7rpqg1ut.js","./datepicker-bd7rpqg1ut.js","./datepicker-bd7rpqg1ut.css","./useMutation-bd7rpqg1ut.js","./useTableUpdater-bd7rpqg1ut.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

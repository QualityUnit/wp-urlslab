import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-ef3h0h2i95.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-ef3h0h2i95.js"), true ? ["./SchedulesTable-ef3h0h2i95.js","../main-ef3h0h2i95.js","./main.css","./useTableUpdater-ef3h0h2i95.js","./datepicker-ef3h0h2i95.js","./datepicker-ef3h0h2i95.css","./useMutation-ef3h0h2i95.js","./useTableUpdater-ef3h0h2i95.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

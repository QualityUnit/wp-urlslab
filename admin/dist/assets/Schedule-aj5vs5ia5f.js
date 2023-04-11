import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-aj5vs5ia5f.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-aj5vs5ia5f.js"), true ? ["./SchedulesTable-aj5vs5ia5f.js","../main-aj5vs5ia5f.js","./main.css","./useTableUpdater-aj5vs5ia5f.js","./datepicker-aj5vs5ia5f.js","./datepicker-aj5vs5ia5f.css","./useMutation-aj5vs5ia5f.js","./useTableUpdater-aj5vs5ia5f.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

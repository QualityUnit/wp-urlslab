import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-phlz4hf9kc.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-phlz4hf9kc.js"), true ? ["./SchedulesTable-phlz4hf9kc.js","../main-phlz4hf9kc.js","./main.css","./useTableUpdater-phlz4hf9kc.js","./datepicker-phlz4hf9kc.js","./datepicker-phlz4hf9kc.css","./useMutation-phlz4hf9kc.js","./useTableUpdater-phlz4hf9kc.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-wcstbj3c61.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-wcstbj3c61.js"), true ? ["./SchedulesTable-wcstbj3c61.js","../main-wcstbj3c61.js","./main.css","./useTableUpdater-wcstbj3c61.js","./datepicker-wcstbj3c61.js","./datepicker-wcstbj3c61.css","./useMutation-wcstbj3c61.js","./useTableUpdater-wcstbj3c61.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

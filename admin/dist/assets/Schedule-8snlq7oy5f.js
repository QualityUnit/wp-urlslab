import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-8snlq7oy5f.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-8snlq7oy5f.js"), true ? ["./SchedulesTable-8snlq7oy5f.js","../main-8snlq7oy5f.js","./main.css","./useTableUpdater-8snlq7oy5f.js","./datepicker-8snlq7oy5f.js","./datepicker-8snlq7oy5f.css","./useMutation-8snlq7oy5f.js","./useTableUpdater-8snlq7oy5f.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

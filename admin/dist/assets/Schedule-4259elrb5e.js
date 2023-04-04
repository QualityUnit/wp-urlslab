import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-4259elrb5e.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-4259elrb5e.js"), true ? ["./SchedulesTable-4259elrb5e.js","../main-4259elrb5e.js","./main.css","./useTableUpdater-4259elrb5e.js","./datepicker-4259elrb5e.js","./datepicker-4259elrb5e.css","./useMutation-4259elrb5e.js","./useTableUpdater-4259elrb5e.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

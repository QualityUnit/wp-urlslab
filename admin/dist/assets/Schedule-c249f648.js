import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main.js";
/* empty css                            */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-01fe5ed3.js"), true ? ["./SchedulesTable-01fe5ed3.js","../main.js","./main.css","./useTableUpdater-2d78d3f5.js","./datepicker-2e4a989d.js","./datepicker.css","./useMutation-88f18619.js","./useTableUpdater.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

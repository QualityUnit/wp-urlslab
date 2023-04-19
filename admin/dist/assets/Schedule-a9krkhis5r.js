import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-a9krkhis5r.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-a9krkhis5r.js"), true ? ["./SchedulesTable-a9krkhis5r.js","../main-a9krkhis5r.js","./main.css","./useTableUpdater-a9krkhis5r.js","./Tooltip-a9krkhis5r.js","./Tooltip-a9krkhis5r.css","./useMutation-a9krkhis5r.js","./useTableUpdater-a9krkhis5r.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-wkxjxa57v3.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-wkxjxa57v3.js"), true ? ["./SchedulesTable-wkxjxa57v3.js","../main-wkxjxa57v3.js","./main.css","./useTableUpdater-wkxjxa57v3.js","./Tooltip-wkxjxa57v3.js","./Tooltip-wkxjxa57v3.css","./useMutation-wkxjxa57v3.js","./useTableUpdater-wkxjxa57v3.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-hk0merw2e9j.js";
/* empty css                               */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-hk0merw2e9j.js"), true ? ["./SchedulesTable-hk0merw2e9j.js","../main-hk0merw2e9j.js","./main.css","./useTableUpdater-hk0merw2e9j.js","./Tooltip-hk0merw2e9j.js","./Tooltip-hk0merw2e9j.css","./useMutation-hk0merw2e9j.js","./useTableUpdater-hk0merw2e9j.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-0b0oq30ihj.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-0b0oq30ihj.js"), true ? ["./SchedulesTable-0b0oq30ihj.js","../main-0b0oq30ihj.js","./main.css","./useTableUpdater-0b0oq30ihj.js","./Tooltip-0b0oq30ihj.js","./Tooltip-0b0oq30ihj.css","./useMutation-0b0oq30ihj.js","./useTableUpdater-0b0oq30ihj.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

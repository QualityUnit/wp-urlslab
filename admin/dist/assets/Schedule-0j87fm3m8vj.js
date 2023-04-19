import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-0j87fm3m8vj.js";
/* empty css                               */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-0j87fm3m8vj.js"), true ? ["./SchedulesTable-0j87fm3m8vj.js","../main-0j87fm3m8vj.js","./main.css","./useTableUpdater-0j87fm3m8vj.js","./Tooltip-0j87fm3m8vj.js","./Tooltip-0j87fm3m8vj.css","./useMutation-0j87fm3m8vj.js","./useTableUpdater-0j87fm3m8vj.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

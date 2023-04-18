import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-pc4ugqzvhp.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-pc4ugqzvhp.js"), true ? ["./SchedulesTable-pc4ugqzvhp.js","../main-pc4ugqzvhp.js","./main.css","./useTableUpdater-pc4ugqzvhp.js","./Tooltip-pc4ugqzvhp.js","./Tooltip-pc4ugqzvhp.css","./useMutation-pc4ugqzvhp.js","./useTableUpdater-pc4ugqzvhp.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

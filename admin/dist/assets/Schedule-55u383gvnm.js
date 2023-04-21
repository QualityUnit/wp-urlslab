import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-55u383gvnm.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-55u383gvnm.js"), true ? ["./SchedulesTable-55u383gvnm.js","../main-55u383gvnm.js","./main.css","./useTableUpdater-55u383gvnm.js","./Tooltip-55u383gvnm.js","./Tooltip-55u383gvnm.css","./useMutation-55u383gvnm.js","./useTableUpdater-55u383gvnm.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

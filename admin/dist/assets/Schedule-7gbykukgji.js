import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-7gbykukgji.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-7gbykukgji.js"), true ? ["./SchedulesTable-7gbykukgji.js","../main-7gbykukgji.js","./main.css","./useTableUpdater-7gbykukgji.js","./Tooltip-7gbykukgji.js","./Tooltip-7gbykukgji.css","./useMutation-7gbykukgji.js","./useTableUpdater-7gbykukgji.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

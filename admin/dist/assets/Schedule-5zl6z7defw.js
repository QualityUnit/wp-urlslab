import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-5zl6z7defw.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-5zl6z7defw.js"), true ? ["./SchedulesTable-5zl6z7defw.js","../main-5zl6z7defw.js","./main.css","./useTableUpdater-5zl6z7defw.js","./datepicker-5zl6z7defw.js","./datepicker-5zl6z7defw.css","./useMutation-5zl6z7defw.js","./useTableUpdater-5zl6z7defw.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-k5hry376nn.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-k5hry376nn.js"), true ? ["./SchedulesTable-k5hry376nn.js","../main-k5hry376nn.js","./main.css","./useTableUpdater-k5hry376nn.js","./datepicker-k5hry376nn.js","./datepicker-k5hry376nn.css","./useMutation-k5hry376nn.js","./useTableUpdater-k5hry376nn.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

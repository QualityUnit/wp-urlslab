import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-d5fdhgs187.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-d5fdhgs187.js"), true ? ["./SchedulesTable-d5fdhgs187.js","../main-d5fdhgs187.js","./main.css","./useTableUpdater-d5fdhgs187.js","./Tooltip-d5fdhgs187.js","./Tooltip-d5fdhgs187.css","./useMutation-d5fdhgs187.js","./useTableUpdater-d5fdhgs187.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

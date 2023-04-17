import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-xwra0ch1zz.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-xwra0ch1zz.js"), true ? ["./SchedulesTable-xwra0ch1zz.js","../main-xwra0ch1zz.js","./main.css","./useTableUpdater-xwra0ch1zz.js","./Tooltip-xwra0ch1zz.js","./Tooltip-xwra0ch1zz.css","./useMutation-xwra0ch1zz.js","./useTableUpdater-xwra0ch1zz.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

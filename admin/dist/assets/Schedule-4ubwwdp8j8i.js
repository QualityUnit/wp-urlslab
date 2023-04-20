import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-4ubwwdp8j8i.js";
/* empty css                               */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-4ubwwdp8j8i.js"), true ? ["./SchedulesTable-4ubwwdp8j8i.js","../main-4ubwwdp8j8i.js","./main.css","./useTableUpdater-4ubwwdp8j8i.js","./Tooltip-4ubwwdp8j8i.js","./Tooltip-4ubwwdp8j8i.css","./useMutation-4ubwwdp8j8i.js","./useTableUpdater-4ubwwdp8j8i.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

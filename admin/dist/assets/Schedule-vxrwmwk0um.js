import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-vxrwmwk0um.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-vxrwmwk0um.js"), true ? ["./SchedulesTable-vxrwmwk0um.js","../main-vxrwmwk0um.js","./main.css","./useTableUpdater-vxrwmwk0um.js","./Tooltip-vxrwmwk0um.js","./Tooltip-vxrwmwk0um.css","./useMutation-vxrwmwk0um.js","./useTableUpdater-vxrwmwk0um.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

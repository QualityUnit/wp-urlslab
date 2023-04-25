import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-0spbnujwpri.js";
/* empty css                               */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-0spbnujwpri.js"), true ? ["./SchedulesTable-0spbnujwpri.js","../main-0spbnujwpri.js","./main.css","./useTableUpdater-0spbnujwpri.js","./Tooltip-0spbnujwpri.js","./Tooltip-0spbnujwpri.css","./useMutation-0spbnujwpri.js","./useTableUpdater-0spbnujwpri.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-rdlntrsf1rk.js";
/* empty css                               */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-rdlntrsf1rk.js"), true ? ["./SchedulesTable-rdlntrsf1rk.js","../main-rdlntrsf1rk.js","./main.css","./useTableUpdater-rdlntrsf1rk.js","./datepicker-rdlntrsf1rk.js","./datepicker-rdlntrsf1rk.css","./useMutation-rdlntrsf1rk.js","./useTableUpdater-rdlntrsf1rk.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

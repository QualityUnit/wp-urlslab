import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-mwi7nr1gli.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-mwi7nr1gli.js"), true ? ["./SchedulesTable-mwi7nr1gli.js","../main-mwi7nr1gli.js","./main.css","./useTableUpdater-mwi7nr1gli.js","./datepicker-mwi7nr1gli.js","./datepicker-mwi7nr1gli.css","./useMutation-mwi7nr1gli.js","./useTableUpdater-mwi7nr1gli.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

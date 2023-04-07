import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-8pccqzn1mg.js";
/* empty css                              */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-8pccqzn1mg.js"), true ? ["./SchedulesTable-8pccqzn1mg.js","../main-8pccqzn1mg.js","./main.css","./useTableUpdater-8pccqzn1mg.js","./datepicker-8pccqzn1mg.js","./datepicker-8pccqzn1mg.css","./useMutation-8pccqzn1mg.js","./useTableUpdater-8pccqzn1mg.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

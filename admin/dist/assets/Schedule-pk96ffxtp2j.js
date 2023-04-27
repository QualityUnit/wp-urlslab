import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-pk96ffxtp2j.js";
/* empty css                               */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-pk96ffxtp2j.js"), true ? ["./SchedulesTable-pk96ffxtp2j.js","../main-pk96ffxtp2j.js","./main.css","./useTableUpdater-pk96ffxtp2j.js","./datepicker-pk96ffxtp2j.js","./datepicker-pk96ffxtp2j.css","./useMutation-pk96ffxtp2j.js","./useTableUpdater-pk96ffxtp2j.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

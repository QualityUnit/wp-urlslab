import { u as useI18n, r as reactExports, _ as __vitePreload, R as React } from "../main-7nutiw5q9wl.js";
/* empty css                               */function Schedule({ moduleId }) {
  const { __ } = useI18n();
  const slug = "schedule";
  /* @__PURE__ */ new Map([
    [slug, __("Schedules")]
  ]);
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-7nutiw5q9wl.js"), true ? ["./SchedulesTable-7nutiw5q9wl.js","../main-7nutiw5q9wl.js","./main.css","./useTableUpdater-7nutiw5q9wl.js","./datepicker-7nutiw5q9wl.js","./datepicker-7nutiw5q9wl.css","./useMutation-7nutiw5q9wl.js","./useTableUpdater-7nutiw5q9wl.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug })));
}
export {
  Schedule as default
};

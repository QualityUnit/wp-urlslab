import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-cahlic561m.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-cahlic561m.js";
/* empty css                              */function SchedulesOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("h1", null, "Urlslab service"), /* @__PURE__ */ React.createElement("h2", null, "How can paid service help my Wordpress?"), /* @__PURE__ */ React.createElement("p", null, "Even you can use our plugin for free and laverage from multiple cool features, integration with our paid service will boost your web in the eyes of search engines thanks to following features:"), /* @__PURE__ */ React.createElement("p", null, "Here should be explanation how credits work, what type of actions we charge and why sometime we return the credit to user (e.g. when we discover, that url doesn't need to be crawled"));
}
function Schedule({ moduleId }) {
  const slug = "schedule";
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-cahlic561m.js"), true ? ["./SchedulesTable-cahlic561m.js","../main-cahlic561m.js","./main-cahlic561m.css","./useTableUpdater-cahlic561m.js","./_ColumnsMenu-cahlic561m.js","./_ColumnsMenu-cahlic561m.css","./InputField-cahlic561m.js","./MultiSelectMenu-cahlic561m.js","./_Inputs-cahlic561m.css","./Tooltip_SortingFiltering-cahlic561m.js","./datepicker-cahlic561m.css","./_ModuleViewHeader-cahlic561m.css"] : void 0, import.meta.url));
  const CreditsTable = reactExports.lazy(() => __vitePreload(() => import("./CreditsTable-cahlic561m.js"), true ? ["./CreditsTable-cahlic561m.js","../main-cahlic561m.js","./main-cahlic561m.css","./useTableUpdater-cahlic561m.js","./_ColumnsMenu-cahlic561m.js","./_ColumnsMenu-cahlic561m.css","./InputField-cahlic561m.js","./MultiSelectMenu-cahlic561m.js","./_Inputs-cahlic561m.css","./Tooltip_SortingFiltering-cahlic561m.js","./datepicker-cahlic561m.css","./_ModuleViewHeader-cahlic561m.css"] : void 0, import.meta.url));
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Schedules")],
    ["credits", __("Recent Credits")]
  ]);
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleMenu: tableMenu,
      noSettings: true,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(SchedulesOverview, null)), activeSection === slug && /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug }))), activeSection === "credits" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(CreditsTable, { slug: "billing/credits/events" })));
}
export {
  Schedule as default
};

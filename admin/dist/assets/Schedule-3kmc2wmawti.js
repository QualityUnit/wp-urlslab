import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-3kmc2wmawti.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-3kmc2wmawti.js";
/* empty css                               */function SchedulesOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("h1", null, "Urlslab service"), /* @__PURE__ */ React.createElement("h2", null, "How can paid service help my Wordpress?"), /* @__PURE__ */ React.createElement("p", null, "Even you can use our plugin for free and laverage from multiple cool features, integration with our paid service will boost your web in the eyes of search engines thanks to following features:"), /* @__PURE__ */ React.createElement("p", null, "Here should be explanation how credits work, what type of actions we charge and why sometime we return the credit to user (e.g. when we discover, that url doesn't need to be crawled"));
}
function Schedule({ moduleId }) {
  const slug = "schedule";
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-3kmc2wmawti.js"), true ? ["./SchedulesTable-3kmc2wmawti.js","../main-3kmc2wmawti.js","./main-3kmc2wmawti.css","./useTableUpdater-3kmc2wmawti.js","./_ColumnsMenu-3kmc2wmawti.js","./_ColumnsMenu-3kmc2wmawti.css","./InputField-3kmc2wmawti.js","./MultiSelectMenu-3kmc2wmawti.js","./_Inputs-3kmc2wmawti.css","./Tooltip_SortingFiltering-3kmc2wmawti.js","./datepicker-3kmc2wmawti.css","./_ModuleViewHeader-3kmc2wmawti.css"] : void 0, import.meta.url));
  const CreditsTable = reactExports.lazy(() => __vitePreload(() => import("./CreditsTable-3kmc2wmawti.js"), true ? ["./CreditsTable-3kmc2wmawti.js","../main-3kmc2wmawti.js","./main-3kmc2wmawti.css","./useTableUpdater-3kmc2wmawti.js","./_ColumnsMenu-3kmc2wmawti.js","./_ColumnsMenu-3kmc2wmawti.css","./InputField-3kmc2wmawti.js","./MultiSelectMenu-3kmc2wmawti.js","./_Inputs-3kmc2wmawti.css","./Tooltip_SortingFiltering-3kmc2wmawti.js","./datepicker-3kmc2wmawti.css","./_ModuleViewHeader-3kmc2wmawti.css"] : void 0, import.meta.url));
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

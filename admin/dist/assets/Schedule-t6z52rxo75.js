import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-t6z52rxo75.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-t6z52rxo75.js";
/* empty css                              */function SchedulesOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), title: "Urlslab service" }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h2", null, "How can paid service help my Wordpress?"), /* @__PURE__ */ React.createElement("p", null, "Even you can use our plugin for free and laverage from multiple cool features, integration with our paid service will boost your web in the eyes of search engines thanks to following features:"), /* @__PURE__ */ React.createElement("p", null, "Here should be explanation how credits work, what type of actions we charge and why sometime we return the credit to user (e.g. when we discover, that url doesn't need to be crawled")));
}
function Schedule({ moduleId }) {
  const slug = "schedule";
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-t6z52rxo75.js"), true ? ["./SchedulesTable-t6z52rxo75.js","../main-t6z52rxo75.js","./main-t6z52rxo75.css","./ModuleViewHeaderBottom-t6z52rxo75.js","./datepicker-t6z52rxo75.js","./MultiSelectMenu-t6z52rxo75.js","./MultiSelectMenu-t6z52rxo75.css","./datepicker-t6z52rxo75.css","./ModuleViewHeaderBottom-t6z52rxo75.css","./Tooltip_SortingFiltering-t6z52rxo75.js","./_ModuleViewHeader-t6z52rxo75.css"] : void 0, import.meta.url));
  const CreditsTable = reactExports.lazy(() => __vitePreload(() => import("./CreditsTable-t6z52rxo75.js"), true ? ["./CreditsTable-t6z52rxo75.js","../main-t6z52rxo75.js","./main-t6z52rxo75.css","./ModuleViewHeaderBottom-t6z52rxo75.js","./datepicker-t6z52rxo75.js","./MultiSelectMenu-t6z52rxo75.js","./MultiSelectMenu-t6z52rxo75.css","./datepicker-t6z52rxo75.css","./ModuleViewHeaderBottom-t6z52rxo75.css","./Tooltip_SortingFiltering-t6z52rxo75.js","./_ModuleViewHeader-t6z52rxo75.css"] : void 0, import.meta.url));
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Schedules")],
    ["credits", __("Recent Credits")]
  ]);
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      moduleMenu: tableMenu,
      noSettings: true,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(SchedulesOverview, { moduleId }), activeSection === slug && /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SchedulesTable, { slug }))), activeSection === "credits" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(CreditsTable, { slug: "billing/credits/events" })));
}
export {
  Schedule as default
};

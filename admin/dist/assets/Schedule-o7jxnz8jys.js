import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-o7jxnz8jys.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-o7jxnz8jys.js";
import "./Checkbox-o7jxnz8jys.js";
/* empty css                              */function SchedulesOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("h1", null, "Urlslab service"), /* @__PURE__ */ React.createElement("h2", null, "How can paid service help my Wordpress?"), /* @__PURE__ */ React.createElement("p", null, "Even you can use our plugin for free and laverage from multiple cool features, integration with our paid service will boost your web in the eyes of search engines thanks to following features:"), /* @__PURE__ */ React.createElement("p", null, "Here should be explanation how credits work, what type of actions we charge and why sometime we return the credit to user (e.g. when we discover, that url doesn't need to be crawled"));
}
function Schedule({ moduleId }) {
  const slug = "schedule";
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SchedulesTable = reactExports.lazy(() => __vitePreload(() => import("./SchedulesTable-o7jxnz8jys.js"), true ? ["./SchedulesTable-o7jxnz8jys.js","../main-o7jxnz8jys.js","./main-o7jxnz8jys.css","./ModuleViewHeaderBottom-o7jxnz8jys.js","./datepicker-o7jxnz8jys.js","./MultiSelectMenu-o7jxnz8jys.js","./Checkbox-o7jxnz8jys.js","./Checkbox-o7jxnz8jys.css","./MultiSelectMenu-o7jxnz8jys.css","./datepicker-o7jxnz8jys.css","./ModuleViewHeaderBottom-o7jxnz8jys.css","./Tooltip_SortingFiltering-o7jxnz8jys.js","./_ModuleViewHeader-o7jxnz8jys.css"] : void 0, import.meta.url));
  const CreditsTable = reactExports.lazy(() => __vitePreload(() => import("./CreditsTable-o7jxnz8jys.js"), true ? ["./CreditsTable-o7jxnz8jys.js","../main-o7jxnz8jys.js","./main-o7jxnz8jys.css","./ModuleViewHeaderBottom-o7jxnz8jys.js","./datepicker-o7jxnz8jys.js","./MultiSelectMenu-o7jxnz8jys.js","./Checkbox-o7jxnz8jys.js","./Checkbox-o7jxnz8jys.css","./MultiSelectMenu-o7jxnz8jys.css","./datepicker-o7jxnz8jys.css","./ModuleViewHeaderBottom-o7jxnz8jys.css","./Tooltip_SortingFiltering-o7jxnz8jys.js","./_ModuleViewHeader-o7jxnz8jys.css"] : void 0, import.meta.url));
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

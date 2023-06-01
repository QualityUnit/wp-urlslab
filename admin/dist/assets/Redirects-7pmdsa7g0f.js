import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-7pmdsa7g0f.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-7pmdsa7g0f.js";
/* empty css                              */function RedirectsOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "Enhance your website's user experience and search engine optimisation with the essential Redirects and 404 Monitor module. Effortlessly identify and resolve 404 errors, maintain your site's integrity, and keep broken links at bay."), /* @__PURE__ */ React.createElement("p", null, "Featuring a user-friendly interface, this module simplifies the process of creating and managing redirects. Set up permanent or temporary redirects with ease, ensuring your visitors always land on the correct page. Stay informed of any 404 errors with the advanced monitoring system, allowing you to promptly address issues."), /* @__PURE__ */ React.createElement("p", null, "Don't let broken links and 404 errors hinder your website's performance. Equip your site with the Redirects and 404 Monitor module, and experience the benefits of a seamless browsing experience for users and improved SEO for your website.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function Redirects({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["redirects", __("Redirects")],
    ["notfound", __("404 Monitor")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-7pmdsa7g0f.js"), true ? ["./Settings-7pmdsa7g0f.js","../main-7pmdsa7g0f.js","./main-7pmdsa7g0f.css","./datepicker-7pmdsa7g0f.js","./MultiSelectMenu-7pmdsa7g0f.js","./MultiSelectMenu-7pmdsa7g0f.css","./datepicker-7pmdsa7g0f.css","./Textarea-7pmdsa7g0f.js","./Switch-7pmdsa7g0f.js","./Switch-7pmdsa7g0f.css","./Settings-7pmdsa7g0f.css"] : void 0, import.meta.url));
  const NotFoundTable = reactExports.lazy(() => __vitePreload(() => import("./NotFoundTable-7pmdsa7g0f.js"), true ? ["./NotFoundTable-7pmdsa7g0f.js","../main-7pmdsa7g0f.js","./main-7pmdsa7g0f.css","./ModuleViewHeaderBottom-7pmdsa7g0f.js","./datepicker-7pmdsa7g0f.js","./MultiSelectMenu-7pmdsa7g0f.js","./MultiSelectMenu-7pmdsa7g0f.css","./datepicker-7pmdsa7g0f.css","./ModuleViewHeaderBottom-7pmdsa7g0f.css","./TagsMenu-7pmdsa7g0f.js","./Tooltip_SortingFiltering-7pmdsa7g0f.js","./SuggestInputField-7pmdsa7g0f.js","./useRedirectTableMenus-7pmdsa7g0f.js"] : void 0, import.meta.url));
  const RedirectsTable = reactExports.lazy(() => __vitePreload(() => import("./RedirectsTable-7pmdsa7g0f.js"), true ? ["./RedirectsTable-7pmdsa7g0f.js","../main-7pmdsa7g0f.js","./main-7pmdsa7g0f.css","./ModuleViewHeaderBottom-7pmdsa7g0f.js","./datepicker-7pmdsa7g0f.js","./MultiSelectMenu-7pmdsa7g0f.js","./MultiSelectMenu-7pmdsa7g0f.css","./datepicker-7pmdsa7g0f.css","./ModuleViewHeaderBottom-7pmdsa7g0f.css","./TagsMenu-7pmdsa7g0f.js","./Tooltip_SortingFiltering-7pmdsa7g0f.js","./SuggestInputField-7pmdsa7g0f.js","./icon-edit-7pmdsa7g0f.js","./useRedirectTableMenus-7pmdsa7g0f.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(RedirectsOverview, { moduleId }), activeSection === "redirects" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(RedirectsTable, { slug: "redirects" })), activeSection === "notfound" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(NotFoundTable, { slug: "not-found-log" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Redirects as default
};

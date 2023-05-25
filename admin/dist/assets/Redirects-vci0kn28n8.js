import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-vci0kn28n8.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-vci0kn28n8.js";
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
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-vci0kn28n8.js"), true ? ["./Settings-vci0kn28n8.js","../main-vci0kn28n8.js","./main-vci0kn28n8.css","./datepicker-vci0kn28n8.js","./MultiSelectMenu-vci0kn28n8.js","./MultiSelectMenu-vci0kn28n8.css","./datepicker-vci0kn28n8.css","./Textarea-vci0kn28n8.js","./Switch-vci0kn28n8.js","./Switch-vci0kn28n8.css","./Settings-vci0kn28n8.css"] : void 0, import.meta.url));
  const NotFoundTable = reactExports.lazy(() => __vitePreload(() => import("./NotFoundTable-vci0kn28n8.js"), true ? ["./NotFoundTable-vci0kn28n8.js","../main-vci0kn28n8.js","./main-vci0kn28n8.css","./ModuleViewHeaderBottom-vci0kn28n8.js","./datepicker-vci0kn28n8.js","./MultiSelectMenu-vci0kn28n8.js","./MultiSelectMenu-vci0kn28n8.css","./datepicker-vci0kn28n8.css","./ModuleViewHeaderBottom-vci0kn28n8.css","./TagsMenu-vci0kn28n8.js","./Tooltip_SortingFiltering-vci0kn28n8.js","./SuggestInputField-vci0kn28n8.js","./useRedirectTableMenus-vci0kn28n8.js"] : void 0, import.meta.url));
  const RedirectsTable = reactExports.lazy(() => __vitePreload(() => import("./RedirectsTable-vci0kn28n8.js"), true ? ["./RedirectsTable-vci0kn28n8.js","../main-vci0kn28n8.js","./main-vci0kn28n8.css","./ModuleViewHeaderBottom-vci0kn28n8.js","./datepicker-vci0kn28n8.js","./MultiSelectMenu-vci0kn28n8.js","./MultiSelectMenu-vci0kn28n8.css","./datepicker-vci0kn28n8.css","./ModuleViewHeaderBottom-vci0kn28n8.css","./TagsMenu-vci0kn28n8.js","./Tooltip_SortingFiltering-vci0kn28n8.js","./SuggestInputField-vci0kn28n8.js","./icon-edit-vci0kn28n8.js","./useRedirectTableMenus-vci0kn28n8.js"] : void 0, import.meta.url));
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

import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-nfjp4fmo45.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-nfjp4fmo45.js";
import "./api-exclamation-nfjp4fmo45.js";
/* empty css                              */function RedirectsOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "Enhance your website's user experience and search engine optimization with the essential Redirects and 404 Monitor module. Effortlessly identify and resolve 404 errors, maintain your site's integrity, and keep broken links at bay."), /* @__PURE__ */ React.createElement("p", null, "Featuring a user-friendly interface, this module simplifies the process of creating and managing redirects. Set up permanent or temporary redirects with ease, ensuring your visitors always land on the correct page. Stay informed of any 404 errors with the advanced monitoring system, allowing you to promptly address issues."), /* @__PURE__ */ React.createElement("p", null, "Don't let broken links and 404 errors hinder your website's performance. Equip your site with the Redirects and 404 Monitor module, and experience the benefits of a seamless browsing experience for users and improved SEO for your website."));
}
function Redirects({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["redirects", __("Redirects")],
    ["notfound", __("404 Monitor")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-nfjp4fmo45.js"), true ? ["./Settings-nfjp4fmo45.js","../main-nfjp4fmo45.js","./main.css","./InputField-nfjp4fmo45.js","./datepicker-nfjp4fmo45.css","./Switch-nfjp4fmo45.js","./Switch-nfjp4fmo45.css","./useMutation-nfjp4fmo45.js","./Settings-nfjp4fmo45.css"] : void 0, import.meta.url));
  const NotFoundTable = reactExports.lazy(() => __vitePreload(() => import("./NotFoundTable-nfjp4fmo45.js"), true ? ["./NotFoundTable-nfjp4fmo45.js","../main-nfjp4fmo45.js","./main.css","./useTableUpdater-nfjp4fmo45.js","./_ColumnsMenu-nfjp4fmo45.js","./_ColumnsMenu-nfjp4fmo45.css","./InputField-nfjp4fmo45.js","./datepicker-nfjp4fmo45.css","./useMutation-nfjp4fmo45.js","./TagsMenu-nfjp4fmo45.js","./Tooltip_SortingFiltering-nfjp4fmo45.js","./useRedirectTableMenus-nfjp4fmo45.js"] : void 0, import.meta.url));
  const RedirectsTable = reactExports.lazy(() => __vitePreload(() => import("./RedirectsTable-nfjp4fmo45.js"), true ? ["./RedirectsTable-nfjp4fmo45.js","../main-nfjp4fmo45.js","./main.css","./useTableUpdater-nfjp4fmo45.js","./_ColumnsMenu-nfjp4fmo45.js","./_ColumnsMenu-nfjp4fmo45.css","./InputField-nfjp4fmo45.js","./datepicker-nfjp4fmo45.css","./useMutation-nfjp4fmo45.js","./TagsMenu-nfjp4fmo45.js","./Tooltip_SortingFiltering-nfjp4fmo45.js","./icon-edit-nfjp4fmo45.js","./useRedirectTableMenus-nfjp4fmo45.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(RedirectsOverview, null)), activeSection === "redirects" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(RedirectsTable, { slug: "redirects" })), activeSection === "notfound" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(NotFoundTable, { slug: "not-found-log" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Redirects as default
};

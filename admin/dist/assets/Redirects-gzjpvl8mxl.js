import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-gzjpvl8mxl.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-gzjpvl8mxl.js";
import "./api-exclamation-gzjpvl8mxl.js";
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
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-gzjpvl8mxl.js"), true ? ["./Settings-gzjpvl8mxl.js","../main-gzjpvl8mxl.js","./main.css","./FilterMenu-gzjpvl8mxl.js","./datepicker-gzjpvl8mxl.css","./Switch-gzjpvl8mxl.js","./Switch-gzjpvl8mxl.css","./useMutation-gzjpvl8mxl.js","./Settings-gzjpvl8mxl.css"] : void 0, import.meta.url));
  const NotFoundTable = reactExports.lazy(() => __vitePreload(() => import("./NotFoundTable-gzjpvl8mxl.js"), true ? ["./NotFoundTable-gzjpvl8mxl.js","../main-gzjpvl8mxl.js","./main.css","./useTableUpdater-gzjpvl8mxl.js","./_ColumnsMenu-gzjpvl8mxl.js","./_ColumnsMenu-gzjpvl8mxl.css","./FilterMenu-gzjpvl8mxl.js","./datepicker-gzjpvl8mxl.css","./useMutation-gzjpvl8mxl.js","./Tooltip_SortingFiltering-gzjpvl8mxl.js","./useRedirectTableMenus-gzjpvl8mxl.js"] : void 0, import.meta.url));
  const RedirectsTable = reactExports.lazy(() => __vitePreload(() => import("./RedirectsTable-gzjpvl8mxl.js"), true ? ["./RedirectsTable-gzjpvl8mxl.js","../main-gzjpvl8mxl.js","./main.css","./useTableUpdater-gzjpvl8mxl.js","./_ColumnsMenu-gzjpvl8mxl.js","./_ColumnsMenu-gzjpvl8mxl.css","./FilterMenu-gzjpvl8mxl.js","./datepicker-gzjpvl8mxl.css","./useMutation-gzjpvl8mxl.js","./Tooltip_SortingFiltering-gzjpvl8mxl.js","./useRedirectTableMenus-gzjpvl8mxl.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(RedirectsOverview, null)), activeSection === "redirects" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(RedirectsTable, { slug: "redirects" })), activeSection === "notfound" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(NotFoundTable, { slug: "not-found-log" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Redirects as default
};

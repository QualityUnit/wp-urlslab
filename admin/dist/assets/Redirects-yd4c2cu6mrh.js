import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-yd4c2cu6mrh.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-yd4c2cu6mrh.js";
import "./api-exclamation-yd4c2cu6mrh.js";
/* empty css                               */function RedirectsOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "Enhance your website's user experience and search engine optimization with the essential Redirects and 404 Monitor module. Effortlessly identify and resolve 404 errors, maintain your site's integrity, and keep broken links at bay."), /* @__PURE__ */ React.createElement("p", null, "Featuring a user-friendly interface, this module simplifies the process of creating and managing redirects. Set up permanent or temporary redirects with ease, ensuring your visitors always land on the correct page. Stay informed of any 404 errors with the advanced monitoring system, allowing you to promptly address issues."), /* @__PURE__ */ React.createElement("p", null, "Don't let broken links and 404 errors hinder your website's performance. Equip your site with the Redirects and 404 Monitor module, and experience the benefits of a seamless browsing experience for users and improved SEO for your website."));
}
function Redirects({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["redirects", __("Redirects")],
    ["notfound", __("404 Monitor")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-yd4c2cu6mrh.js"), true ? ["./Settings-yd4c2cu6mrh.js","../main-yd4c2cu6mrh.js","./main.css","./InputField-yd4c2cu6mrh.js","./datepicker-yd4c2cu6mrh.css","./Switch-yd4c2cu6mrh.js","./Switch-yd4c2cu6mrh.css","./useMutation-yd4c2cu6mrh.js","./Settings-yd4c2cu6mrh.css"] : void 0, import.meta.url));
  const NotFoundTable = reactExports.lazy(() => __vitePreload(() => import("./NotFoundTable-yd4c2cu6mrh.js"), true ? ["./NotFoundTable-yd4c2cu6mrh.js","../main-yd4c2cu6mrh.js","./main.css","./useTableUpdater-yd4c2cu6mrh.js","./_ColumnsMenu-yd4c2cu6mrh.js","./_ColumnsMenu-yd4c2cu6mrh.css","./InputField-yd4c2cu6mrh.js","./datepicker-yd4c2cu6mrh.css","./useMutation-yd4c2cu6mrh.js","./TagsMenu-yd4c2cu6mrh.js","./Tooltip_SortingFiltering-yd4c2cu6mrh.js","./useRedirectTableMenus-yd4c2cu6mrh.js"] : void 0, import.meta.url));
  const RedirectsTable = reactExports.lazy(() => __vitePreload(() => import("./RedirectsTable-yd4c2cu6mrh.js"), true ? ["./RedirectsTable-yd4c2cu6mrh.js","../main-yd4c2cu6mrh.js","./main.css","./useTableUpdater-yd4c2cu6mrh.js","./_ColumnsMenu-yd4c2cu6mrh.js","./_ColumnsMenu-yd4c2cu6mrh.css","./InputField-yd4c2cu6mrh.js","./datepicker-yd4c2cu6mrh.css","./useMutation-yd4c2cu6mrh.js","./TagsMenu-yd4c2cu6mrh.js","./Tooltip_SortingFiltering-yd4c2cu6mrh.js","./icon-edit-yd4c2cu6mrh.js","./useRedirectTableMenus-yd4c2cu6mrh.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(RedirectsOverview, null)), activeSection === "redirects" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(RedirectsTable, { slug: "redirects" })), activeSection === "notfound" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(NotFoundTable, { slug: "not-found-log" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Redirects as default
};

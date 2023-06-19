<<<<<<< HEAD:admin/dist/assets/Redirects-vqw3w5p1iw.js
<<<<<<< HEAD:admin/dist/assets/Redirects-vqw3w5p1iw.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-vqw3w5p1iw.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-vqw3w5p1iw.js";
=======
<<<<<<<< HEAD:admin/dist/assets/Redirects-txs3jaim6w.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { u as useI18n, _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/Redirects-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/Redirects-txs3jaim6w.js
/* empty css                              */function RedirectsOverview({ moduleId }) {
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-o8x8qzqwuhk.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-o8x8qzqwuhk.js";
/* empty css                               */function RedirectsOverview({ moduleId }) {
>>>>>>> main:admin/dist/assets/Redirects-o8x8qzqwuhk.js
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
<<<<<<< HEAD:admin/dist/assets/Redirects-vqw3w5p1iw.js
<<<<<<< HEAD:admin/dist/assets/Redirects-vqw3w5p1iw.js
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-vqw3w5p1iw.js"), true ? ["./Settings-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./Textarea-vqw3w5p1iw.js","./Switch-vqw3w5p1iw.js","./Switch-vqw3w5p1iw.css","./Settings-vqw3w5p1iw.css"] : void 0, import.meta.url));
  const NotFoundTable = reactExports.lazy(() => __vitePreload(() => import("./NotFoundTable-vqw3w5p1iw.js"), true ? ["./NotFoundTable-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.js","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.css","./TagsMenu-vqw3w5p1iw.js","./Tooltip_SortingFiltering-vqw3w5p1iw.js","./SuggestInputField-vqw3w5p1iw.js","./useRedirectTableMenus-vqw3w5p1iw.js"] : void 0, import.meta.url));
  const RedirectsTable = reactExports.lazy(() => __vitePreload(() => import("./RedirectsTable-vqw3w5p1iw.js"), true ? ["./RedirectsTable-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.js","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.css","./TagsMenu-vqw3w5p1iw.js","./Tooltip_SortingFiltering-vqw3w5p1iw.js","./SuggestInputField-vqw3w5p1iw.js","./icon-edit-vqw3w5p1iw.js","./useRedirectTableMenus-vqw3w5p1iw.js"] : void 0, import.meta.url));
=======
<<<<<<<< HEAD:admin/dist/assets/Redirects-txs3jaim6w.js
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-txs3jaim6w.js"), true ? ["./Settings-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./Textarea-txs3jaim6w.js","./Switch-txs3jaim6w.js","./Switch-txs3jaim6w.css","./Settings-txs3jaim6w.css"] : void 0, import.meta.url));
  const NotFoundTable = reactExports.lazy(() => __vitePreload(() => import("./NotFoundTable-txs3jaim6w.js"), true ? ["./NotFoundTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./TagsMenu-txs3jaim6w.js","./Tooltip_SortingFiltering-txs3jaim6w.js","./SuggestInputField-txs3jaim6w.js","./useRedirectTableMenus-txs3jaim6w.js"] : void 0, import.meta.url));
  const RedirectsTable = reactExports.lazy(() => __vitePreload(() => import("./RedirectsTable-txs3jaim6w.js"), true ? ["./RedirectsTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./TagsMenu-txs3jaim6w.js","./Tooltip_SortingFiltering-txs3jaim6w.js","./SuggestInputField-txs3jaim6w.js","./icon-edit-txs3jaim6w.js","./useRedirectTableMenus-txs3jaim6w.js"] : void 0, import.meta.url));
========
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-myg4akepfo.js"), true ? ["./Settings-myg4akepfo.js","./index-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./Textarea-myg4akepfo.js","./Switch-myg4akepfo.js","./Switch-myg4akepfo.css","./Settings-myg4akepfo.css"] : void 0, import.meta.url));
  const NotFoundTable = reactExports.lazy(() => __vitePreload(() => import("./NotFoundTable-myg4akepfo.js"), true ? ["./NotFoundTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./TagsMenu-myg4akepfo.js","./Tooltip_SortingFiltering-myg4akepfo.js","./SuggestInputField-myg4akepfo.js","./useRedirectTableMenus-myg4akepfo.js"] : void 0, import.meta.url));
  const RedirectsTable = reactExports.lazy(() => __vitePreload(() => import("./RedirectsTable-myg4akepfo.js"), true ? ["./RedirectsTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./TagsMenu-myg4akepfo.js","./Tooltip_SortingFiltering-myg4akepfo.js","./SuggestInputField-myg4akepfo.js","./icon-edit-myg4akepfo.js","./useRedirectTableMenus-myg4akepfo.js"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/Redirects-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/Redirects-txs3jaim6w.js
=======
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-o8x8qzqwuhk.js"), true ? ["./Settings-o8x8qzqwuhk.js","../main-o8x8qzqwuhk.js","./main-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.css","./Textarea-o8x8qzqwuhk.js","./Switch-o8x8qzqwuhk.js","./Switch-o8x8qzqwuhk.css","./Settings-o8x8qzqwuhk.css"] : void 0, import.meta.url));
  const NotFoundTable = reactExports.lazy(() => __vitePreload(() => import("./NotFoundTable-o8x8qzqwuhk.js"), true ? ["./NotFoundTable-o8x8qzqwuhk.js","../main-o8x8qzqwuhk.js","./main-o8x8qzqwuhk.css","./ModuleViewHeaderBottom-o8x8qzqwuhk.js","./datepicker-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.css","./ModuleViewHeaderBottom-o8x8qzqwuhk.css","./TagsMenu-o8x8qzqwuhk.js","./Tooltip_SortingFiltering-o8x8qzqwuhk.js","./SuggestInputField-o8x8qzqwuhk.js","./useRedirectTableMenus-o8x8qzqwuhk.js"] : void 0, import.meta.url));
  const RedirectsTable = reactExports.lazy(() => __vitePreload(() => import("./RedirectsTable-o8x8qzqwuhk.js"), true ? ["./RedirectsTable-o8x8qzqwuhk.js","../main-o8x8qzqwuhk.js","./main-o8x8qzqwuhk.css","./ModuleViewHeaderBottom-o8x8qzqwuhk.js","./datepicker-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.css","./ModuleViewHeaderBottom-o8x8qzqwuhk.css","./TagsMenu-o8x8qzqwuhk.js","./Tooltip_SortingFiltering-o8x8qzqwuhk.js","./SuggestInputField-o8x8qzqwuhk.js","./icon-edit-o8x8qzqwuhk.js","./useRedirectTableMenus-o8x8qzqwuhk.js"] : void 0, import.meta.url));
>>>>>>> main:admin/dist/assets/Redirects-o8x8qzqwuhk.js
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

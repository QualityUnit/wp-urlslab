import { R as React, r as reactExports, _ as __vitePreload } from "../main-3kmc2wmawti.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-3kmc2wmawti.js";
/* empty css                               */function OptimizeOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Database Optimizer module is a great tool that helps you to get the most out of your website's performance. By automating the optimization process in the background, you can easily ensure that your website is running at its peak."), /* @__PURE__ */ React.createElement("p", null, "The module automatically deletes post revisions, auto-draft posts and posts in the trash, thus freeing up space and resources. In addition, expired transient options and orphaned data in the database can also be cleared, allowing the system to run much more efficiently. This can significantly improve the speed and performance of your website."));
}
function Optimize({ moduleId }) {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-3kmc2wmawti.js"), true ? ["./Settings-3kmc2wmawti.js","../main-3kmc2wmawti.js","./main-3kmc2wmawti.css","./InputField-3kmc2wmawti.js","./MultiSelectMenu-3kmc2wmawti.js","./_Inputs-3kmc2wmawti.css","./Switch-3kmc2wmawti.js","./Switch-3kmc2wmawti.css","./Settings-3kmc2wmawti.css","./datepicker-3kmc2wmawti.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(OptimizeOverview, null)), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Optimize as default
};

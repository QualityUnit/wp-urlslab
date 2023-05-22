import { r as reactExports, R as React, _ as __vitePreload } from "../main-5r8qef65wm.js";
import { O as Overview, M as ModuleViewHeader } from "./ModuleViewHeader-5r8qef65wm.js";
import "./Checkbox-5r8qef65wm.js";
/* empty css                              */function OptimizeOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, noCheckbox: true, section: (val) => setSection(val) }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("p", null, "The Database Optimizer module is a great tool that helps you to get the most out of your website's performance. By automating the optimization process in the background, you can easily ensure that your website is running at its peak."), /* @__PURE__ */ React.createElement("p", null, "The module automatically deletes post revisions, auto-draft posts and posts in the trash, thus freeing up space and resources. In addition, expired transient options and orphaned data in the database can also be cleared, allowing the system to run much more efficiently. This can significantly improve the speed and performance of your website.")));
}
function Optimize({ moduleId }) {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-5r8qef65wm.js"), true ? ["./Settings-5r8qef65wm.js","../main-5r8qef65wm.js","./main-5r8qef65wm.css","./datepicker-5r8qef65wm.js","./MultiSelectMenu-5r8qef65wm.js","./Checkbox-5r8qef65wm.js","./Checkbox-5r8qef65wm.css","./MultiSelectMenu-5r8qef65wm.css","./datepicker-5r8qef65wm.css","./Switch-5r8qef65wm.js","./Switch-5r8qef65wm.css","./Settings-5r8qef65wm.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(OptimizeOverview, { moduleId }), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Optimize as default
};

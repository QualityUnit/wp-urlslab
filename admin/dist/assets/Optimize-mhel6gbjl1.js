import { r as reactExports, R as React, _ as __vitePreload } from "../main-mhel6gbjl1.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-mhel6gbjl1.js";
/* empty css                              */import "./Checkbox-mhel6gbjl1.js";
function OptimizeOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, noCheckbox: true, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Database Optimiser module is a great tool that helps you to get the most out of your website's performance. By automating the optimisation process in the background, you can easily ensure that your website is running at its peak."), /* @__PURE__ */ React.createElement("p", null, "The module automatically deletes post revisions, auto-draft posts and posts in the trash, thus freeing up space and resources. In addition, expired transient options and orphaned data in the database can also be cleared, allowing the system to run much more efficiently. This can significantly improve the speed and performance of your website.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function Optimize({ moduleId }) {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-mhel6gbjl1.js"), true ? ["./Settings-mhel6gbjl1.js","../main-mhel6gbjl1.js","./main-mhel6gbjl1.css","./datepicker-mhel6gbjl1.js","./MultiSelectMenu-mhel6gbjl1.js","./Checkbox-mhel6gbjl1.js","./Checkbox-mhel6gbjl1.css","./MultiSelectMenu-mhel6gbjl1.css","./datepicker-mhel6gbjl1.css","./Textarea-mhel6gbjl1.js","./Switch-mhel6gbjl1.js","./Switch-mhel6gbjl1.css","./Settings-mhel6gbjl1.css"] : void 0, import.meta.url));
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

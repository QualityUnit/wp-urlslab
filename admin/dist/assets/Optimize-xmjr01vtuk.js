import { r as reactExports, R as React, _ as __vitePreload } from "../main-xmjr01vtuk.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-xmjr01vtuk.js";
/* empty css                              */import "./Checkbox-xmjr01vtuk.js";
function OptimizeOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, noCheckbox: true, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Database Optimiser module is a great tool that helps you to get the most out of your website's performance. By automating the optimisation process in the background, you can easily ensure that your website is running at its peak."), /* @__PURE__ */ React.createElement("p", null, "The module automatically deletes post revisions, auto-draft posts and posts in the trash, thus freeing up space and resources. In addition, expired transient options and orphaned data in the database can also be cleared, allowing the system to run much more efficiently. This can significantly improve the speed and performance of your website.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function Optimize({ moduleId }) {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-xmjr01vtuk.js"), true ? ["./Settings-xmjr01vtuk.js","../main-xmjr01vtuk.js","./main-xmjr01vtuk.css","./datepicker-xmjr01vtuk.js","./MultiSelectMenu-xmjr01vtuk.js","./Checkbox-xmjr01vtuk.js","./Checkbox-xmjr01vtuk.css","./MultiSelectMenu-xmjr01vtuk.css","./datepicker-xmjr01vtuk.css","./Textarea-xmjr01vtuk.js","./Switch-xmjr01vtuk.js","./Switch-xmjr01vtuk.css","./Settings-xmjr01vtuk.css"] : void 0, import.meta.url));
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

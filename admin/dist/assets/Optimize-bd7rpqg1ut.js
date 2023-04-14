import { R as React, r as reactExports, _ as __vitePreload } from "../main-bd7rpqg1ut.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-bd7rpqg1ut.js";
import "./api-exclamation-bd7rpqg1ut.js";
/* empty css                              */function OptimizeOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Database Optimizer module is a great tool that helps you to get the most out of your website's performance. By automating the optimization process in the background, you can easily ensure that your website is running at its peak."), /* @__PURE__ */ React.createElement("p", null, "The module automatically deletes post revisions, auto-draft posts and posts in the trash, thus freeing up space and resources. In addition, expired transient options and orphaned data in the database can also be cleared, allowing the system to run much more efficiently. This can significantly improve the speed and performance of your website."));
}
function Optimize({ moduleId }) {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-bd7rpqg1ut.js"), true ? ["./Settings-bd7rpqg1ut.js","../main-bd7rpqg1ut.js","./main.css","./datepicker-bd7rpqg1ut.js","./datepicker-bd7rpqg1ut.css","./Switch-bd7rpqg1ut.js","./Switch-bd7rpqg1ut.css","./useMutation-bd7rpqg1ut.js","./Settings-bd7rpqg1ut.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(OptimizeOverview, null)), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Optimize as default
};

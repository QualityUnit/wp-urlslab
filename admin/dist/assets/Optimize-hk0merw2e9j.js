import { R as React, r as reactExports, _ as __vitePreload } from "../main-hk0merw2e9j.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-hk0merw2e9j.js";
import "./api-exclamation-hk0merw2e9j.js";
/* empty css                               */function OptimizeOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Database Optimizer module is a great tool that helps you to get the most out of your website's performance. By automating the optimization process in the background, you can easily ensure that your website is running at its peak."), /* @__PURE__ */ React.createElement("p", null, "The module automatically deletes post revisions, auto-draft posts and posts in the trash, thus freeing up space and resources. In addition, expired transient options and orphaned data in the database can also be cleared, allowing the system to run much more efficiently. This can significantly improve the speed and performance of your website."));
}
function Optimize({ moduleId }) {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-hk0merw2e9j.js"), true ? ["./Settings-hk0merw2e9j.js","../main-hk0merw2e9j.js","./main.css","./Tooltip-hk0merw2e9j.js","./Tooltip-hk0merw2e9j.css","./Switch-hk0merw2e9j.js","./Switch-hk0merw2e9j.css","./useMutation-hk0merw2e9j.js","./Settings-hk0merw2e9j.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(OptimizeOverview, null)), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Optimize as default
};

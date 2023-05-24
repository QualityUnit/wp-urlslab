import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-yqr1c0iv4jl.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-yqr1c0iv4jl.js";
/* empty css                               */import "./Checkbox-yqr1c0iv4jl.js";
function CustomHtmlOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "Add custom HTML content to your WordPress page easily.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function CustomHtml({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["custom-html", __("Custom HTML")]
  ]);
  const CustomHtmlTable = reactExports.lazy(() => __vitePreload(() => import("./CustomHtmlTable-yqr1c0iv4jl.js"), true ? ["./CustomHtmlTable-yqr1c0iv4jl.js","../main-yqr1c0iv4jl.js","./main-yqr1c0iv4jl.css","./ModuleViewHeaderBottom-yqr1c0iv4jl.js","./datepicker-yqr1c0iv4jl.js","./MultiSelectMenu-yqr1c0iv4jl.js","./Checkbox-yqr1c0iv4jl.js","./Checkbox-yqr1c0iv4jl.css","./MultiSelectMenu-yqr1c0iv4jl.css","./datepicker-yqr1c0iv4jl.css","./ModuleViewHeaderBottom-yqr1c0iv4jl.css","./TagsMenu-yqr1c0iv4jl.js","./Tooltip_SortingFiltering-yqr1c0iv4jl.js","./Textarea-yqr1c0iv4jl.js","./icon-edit-yqr1c0iv4jl.js","./transform-yqr1c0iv4jl.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-yqr1c0iv4jl.js"), true ? ["./Settings-yqr1c0iv4jl.js","../main-yqr1c0iv4jl.js","./main-yqr1c0iv4jl.css","./datepicker-yqr1c0iv4jl.js","./MultiSelectMenu-yqr1c0iv4jl.js","./Checkbox-yqr1c0iv4jl.js","./Checkbox-yqr1c0iv4jl.css","./MultiSelectMenu-yqr1c0iv4jl.css","./datepicker-yqr1c0iv4jl.css","./Textarea-yqr1c0iv4jl.js","./Switch-yqr1c0iv4jl.js","./Switch-yqr1c0iv4jl.css","./Settings-yqr1c0iv4jl.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(CustomHtmlOverview, { moduleId }), activeSection === "custom-html" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(CustomHtmlTable, { slug: "custom-html" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  CustomHtml as default
};

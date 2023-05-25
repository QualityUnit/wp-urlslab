import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-8770rk7tqv.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-8770rk7tqv.js";
/* empty css                              */import "./Checkbox-8770rk7tqv.js";
function CustomHtmlOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Custom HTML Injection module is a versatile and powerful solution designed to seamlessly integrate custom HTML code into any section of your web page. This invaluable tool is essential for implementing scripts such as Google Tag Manager and other third-party services."), /* @__PURE__ */ React.createElement("p", null, "One of the standout features of the module is its ability to define specific rules for loading your custom HTML code, providing you with ultimate control over the precise location where your code will be executed. This targeted approach ensures that your code has the desired impact on your site's user experience while eliminating any potential conflicts with other elements.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function CustomHtml({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["custom-html", __("Custom HTML")]
  ]);
  const CustomHtmlTable = reactExports.lazy(() => __vitePreload(() => import("./CustomHtmlTable-8770rk7tqv.js"), true ? ["./CustomHtmlTable-8770rk7tqv.js","../main-8770rk7tqv.js","./main-8770rk7tqv.css","./ModuleViewHeaderBottom-8770rk7tqv.js","./datepicker-8770rk7tqv.js","./MultiSelectMenu-8770rk7tqv.js","./Checkbox-8770rk7tqv.js","./Checkbox-8770rk7tqv.css","./MultiSelectMenu-8770rk7tqv.css","./datepicker-8770rk7tqv.css","./ModuleViewHeaderBottom-8770rk7tqv.css","./TagsMenu-8770rk7tqv.js","./Tooltip_SortingFiltering-8770rk7tqv.js","./Textarea-8770rk7tqv.js","./icon-edit-8770rk7tqv.js","./transform-8770rk7tqv.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-8770rk7tqv.js"), true ? ["./Settings-8770rk7tqv.js","../main-8770rk7tqv.js","./main-8770rk7tqv.css","./datepicker-8770rk7tqv.js","./MultiSelectMenu-8770rk7tqv.js","./Checkbox-8770rk7tqv.js","./Checkbox-8770rk7tqv.css","./MultiSelectMenu-8770rk7tqv.css","./datepicker-8770rk7tqv.css","./Textarea-8770rk7tqv.js","./Switch-8770rk7tqv.js","./Switch-8770rk7tqv.css","./Settings-8770rk7tqv.css"] : void 0, import.meta.url));
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

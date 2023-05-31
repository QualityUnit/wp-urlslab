import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-yv7e1z8gbu.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-yv7e1z8gbu.js";
/* empty css                              */function CustomHtmlOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Custom HTML Injection module is a versatile and powerful solution designed to seamlessly integrate custom HTML code into any section of your web page. This invaluable tool is essential for implementing scripts such as Google Tag Manager and other third-party services."), /* @__PURE__ */ React.createElement("p", null, "One of the standout features of the module is its ability to define specific rules for loading your custom HTML code, providing you with ultimate control over the precise location where your code will be executed. This targeted approach ensures that your code has the desired impact on your site's user experience while eliminating any potential conflicts with other elements.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function CustomHtml({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["custom-html", __("Custom HTML")]
  ]);
  const CustomHtmlTable = reactExports.lazy(() => __vitePreload(() => import("./CustomHtmlTable-yv7e1z8gbu.js"), true ? ["./CustomHtmlTable-yv7e1z8gbu.js","../main-yv7e1z8gbu.js","./main-yv7e1z8gbu.css","./ModuleViewHeaderBottom-yv7e1z8gbu.js","./datepicker-yv7e1z8gbu.js","./MultiSelectMenu-yv7e1z8gbu.js","./MultiSelectMenu-yv7e1z8gbu.css","./datepicker-yv7e1z8gbu.css","./ModuleViewHeaderBottom-yv7e1z8gbu.css","./TagsMenu-yv7e1z8gbu.js","./Tooltip_SortingFiltering-yv7e1z8gbu.js","./Textarea-yv7e1z8gbu.js","./icon-edit-yv7e1z8gbu.js","./transform-yv7e1z8gbu.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-yv7e1z8gbu.js"), true ? ["./Settings-yv7e1z8gbu.js","../main-yv7e1z8gbu.js","./main-yv7e1z8gbu.css","./datepicker-yv7e1z8gbu.js","./MultiSelectMenu-yv7e1z8gbu.js","./MultiSelectMenu-yv7e1z8gbu.css","./datepicker-yv7e1z8gbu.css","./Textarea-yv7e1z8gbu.js","./Switch-yv7e1z8gbu.js","./Switch-yv7e1z8gbu.css","./Settings-yv7e1z8gbu.css"] : void 0, import.meta.url));
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

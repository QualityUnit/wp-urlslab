import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-l0xckuglwsi.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-l0xckuglwsi.js";
/* empty css                               */function CustomHtmlOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Custom HTML Injection module is a versatile and powerful solution designed to seamlessly integrate custom HTML code into any section of your web page. This invaluable tool is essential for implementing scripts such as Google Tag Manager and other third-party services."), /* @__PURE__ */ React.createElement("p", null, "One of the standout features of the module is its ability to define specific rules for loading your custom HTML code, providing you with ultimate control over the precise location where your code will be executed. This targeted approach ensures that your code has the desired impact on your site's user experience while eliminating any potential conflicts with other elements.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function CustomHtml({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["custom-html", __("Custom HTML")]
  ]);
  const CustomHtmlTable = reactExports.lazy(() => __vitePreload(() => import("./CustomHtmlTable-l0xckuglwsi.js"), true ? ["./CustomHtmlTable-l0xckuglwsi.js","../main-l0xckuglwsi.js","./main-l0xckuglwsi.css","./ModuleViewHeaderBottom-l0xckuglwsi.js","./datepicker-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.css","./datepicker-l0xckuglwsi.css","./ModuleViewHeaderBottom-l0xckuglwsi.css","./TagsMenu-l0xckuglwsi.js","./Tooltip_SortingFiltering-l0xckuglwsi.js","./Textarea-l0xckuglwsi.js","./icon-edit-l0xckuglwsi.js","./transform-l0xckuglwsi.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-l0xckuglwsi.js"), true ? ["./Settings-l0xckuglwsi.js","../main-l0xckuglwsi.js","./main-l0xckuglwsi.css","./datepicker-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.css","./datepicker-l0xckuglwsi.css","./Textarea-l0xckuglwsi.js","./Switch-l0xckuglwsi.js","./Switch-l0xckuglwsi.css","./Settings-l0xckuglwsi.css"] : void 0, import.meta.url));
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

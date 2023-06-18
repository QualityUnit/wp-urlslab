import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-kp480g2rhj.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-kp480g2rhj.js";
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
  const CustomHtmlTable = reactExports.lazy(() => __vitePreload(() => import("./CustomHtmlTable-kp480g2rhj.js"), true ? ["./CustomHtmlTable-kp480g2rhj.js","..\\main-kp480g2rhj.js","./main-kp480g2rhj.css","./ModuleViewHeaderBottom-kp480g2rhj.js","./datepicker-kp480g2rhj.js","./MultiSelectMenu-kp480g2rhj.js","./MultiSelectMenu-kp480g2rhj.css","./datepicker-kp480g2rhj.css","./ModuleViewHeaderBottom-kp480g2rhj.css","./TagsMenu-kp480g2rhj.js","./Tooltip_SortingFiltering-kp480g2rhj.js","./Textarea-kp480g2rhj.js","./icon-edit-kp480g2rhj.js","./transform-kp480g2rhj.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-kp480g2rhj.js"), true ? ["./Settings-kp480g2rhj.js","..\\main-kp480g2rhj.js","./main-kp480g2rhj.css","./datepicker-kp480g2rhj.js","./MultiSelectMenu-kp480g2rhj.js","./MultiSelectMenu-kp480g2rhj.css","./datepicker-kp480g2rhj.css","./Textarea-kp480g2rhj.js","./Switch-kp480g2rhj.js","./Switch-kp480g2rhj.css","./Settings-kp480g2rhj.css"] : void 0, import.meta.url));
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

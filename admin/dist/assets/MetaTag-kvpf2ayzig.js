import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-kvpf2ayzig.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-kvpf2ayzig.js";
/* empty css                              */function MetaTagOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "Open Graph and Twitter meta tags are essential for improving your content’s reach and shareability on social media. They enable your content to be displayed in an attractive and eye-catching way that will draw in readers and encourage them to share it with their networks. The Meta Tags Manager module allows you to specify the title, description, image, and other details displayed when someone shares your content on Facebook, Twitter, or other social media platforms."), /* @__PURE__ */ React.createElement("p", null, "In addition, the module can generate an enhanced page summary as a description. This is an excellent way to add more information about your page that can boost your SEO ranking. It can also be used to provide a brief overview of what the page is about, which can help to attract potential visitors.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
const MetaTagsTable = reactExports.lazy(() => __vitePreload(() => import("./MetaTagsTable-kvpf2ayzig.js"), true ? ["./MetaTagsTable-kvpf2ayzig.js","../main-kvpf2ayzig.js","./main-kvpf2ayzig.css","./ModuleViewHeaderBottom-kvpf2ayzig.js","./datepicker-kvpf2ayzig.js","./MultiSelectMenu-kvpf2ayzig.js","./MultiSelectMenu-kvpf2ayzig.css","./datepicker-kvpf2ayzig.css","./ModuleViewHeaderBottom-kvpf2ayzig.css","./TagsMenu-kvpf2ayzig.js","./Tooltip_SortingFiltering-kvpf2ayzig.js"] : void 0, import.meta.url));
const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-kvpf2ayzig.js"), true ? ["./Settings-kvpf2ayzig.js","../main-kvpf2ayzig.js","./main-kvpf2ayzig.css","./datepicker-kvpf2ayzig.js","./MultiSelectMenu-kvpf2ayzig.js","./MultiSelectMenu-kvpf2ayzig.css","./datepicker-kvpf2ayzig.css","./Textarea-kvpf2ayzig.js","./Switch-kvpf2ayzig.js","./Switch-kvpf2ayzig.css","./Settings-kvpf2ayzig.css"] : void 0, import.meta.url));
function MetaTag({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const slug = "metatag";
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Meta tags")]
  ]);
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(MetaTagOverview, { moduleId }), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(MetaTagsTable, { slug })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  MetaTag as default
};

import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-wr0uobcc1sl.js";
import { O as Overview, M as ModuleViewHeader } from "./ModuleViewHeader-wr0uobcc1sl.js";
import "./Checkbox-wr0uobcc1sl.js";
/* empty css                               */function MetaTagOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val) }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("p", null, "Open Graph and Twitter meta tags are essential for improving your content’s reach and shareability on social media. They enable your content to be displayed in an attractive and eye-catching way that will draw in readers and encourage them to share it with their networks. The Meta Tags Manager module allows you to specify the title, description, image, and other details displayed when someone shares your content on Facebook, Twitter, or other social media platforms."), /* @__PURE__ */ React.createElement("p", null, "In addition, the module can generate an enhanced page summary as a description. This is an excellent way to add more information about your page that can boost your SEO ranking. It can also be used to provide a brief overview of what the page is about, which can help to attract potential visitors.")));
}
function MetaTag({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const slug = "metatag";
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Meta tags")]
  ]);
  const MetaTagsTable = reactExports.lazy(() => __vitePreload(() => import("./MetaTagsTable-wr0uobcc1sl.js"), true ? ["./MetaTagsTable-wr0uobcc1sl.js","../main-wr0uobcc1sl.js","./main-wr0uobcc1sl.css","./ModuleViewHeaderBottom-wr0uobcc1sl.js","./datepicker-wr0uobcc1sl.js","./MultiSelectMenu-wr0uobcc1sl.js","./Checkbox-wr0uobcc1sl.js","./Checkbox-wr0uobcc1sl.css","./MultiSelectMenu-wr0uobcc1sl.css","./datepicker-wr0uobcc1sl.css","./ModuleViewHeaderBottom-wr0uobcc1sl.css","./TagsMenu-wr0uobcc1sl.js","./Tooltip_SortingFiltering-wr0uobcc1sl.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-wr0uobcc1sl.js"), true ? ["./Settings-wr0uobcc1sl.js","../main-wr0uobcc1sl.js","./main-wr0uobcc1sl.css","./datepicker-wr0uobcc1sl.js","./MultiSelectMenu-wr0uobcc1sl.js","./Checkbox-wr0uobcc1sl.js","./Checkbox-wr0uobcc1sl.css","./MultiSelectMenu-wr0uobcc1sl.css","./datepicker-wr0uobcc1sl.css","./Switch-wr0uobcc1sl.js","./Switch-wr0uobcc1sl.css","./Settings-wr0uobcc1sl.css"] : void 0, import.meta.url));
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

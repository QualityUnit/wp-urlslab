import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-bnkd71mu9.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-bnkd71mu9.js";
import "./api-exclamation-bnkd71mu9.js";
/* empty css                             */function MetaTagOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "Open Graph and Twitter meta tags are essential for improving your content’s reach and shareability on social media. They enable your content to be displayed in an attractive and eye-catching way that will draw in readers and encourage them to share it with their networks. The Meta Tags Manager module allows you to specify the title, description, image, and other details displayed when someone shares your content on Facebook, Twitter, or other social media platforms."), /* @__PURE__ */ React.createElement("p", null, "In addition, the module can generate an enhanced page summary as a description. This is an excellent way to add more information about your page that can boost your SEO ranking. It can also be used to provide a brief overview of what the page is about, which can help to attract potential visitors."));
}
function MetaTag({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const slug = "metatag";
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Meta tags")]
  ]);
  const MetaTagsTable = reactExports.lazy(() => __vitePreload(() => import("./MetaTagsTable-bnkd71mu9.js"), true ? ["./MetaTagsTable-bnkd71mu9.js","../main-bnkd71mu9.js","./main.css","./useTableUpdater-bnkd71mu9.js","./Tooltip-bnkd71mu9.js","./Tooltip-bnkd71mu9.css","./useMutation-bnkd71mu9.js","./useTableUpdater-bnkd71mu9.css","./DateTimeFormat-bnkd71mu9.js"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-bnkd71mu9.js"), true ? ["./Settings-bnkd71mu9.js","../main-bnkd71mu9.js","./main.css","./Tooltip-bnkd71mu9.js","./Tooltip-bnkd71mu9.css","./Switch-bnkd71mu9.js","./Switch-bnkd71mu9.css","./useMutation-bnkd71mu9.js","./Settings-bnkd71mu9.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(MetaTagOverview, null)), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(MetaTagsTable, { slug })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  MetaTag as default
};

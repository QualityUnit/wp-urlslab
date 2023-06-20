import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-l0xckuglwsi.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-l0xckuglwsi.js";
/* empty css                               */function KeywordLinksOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Keywords Manager module is an incredibly valuable tool for boosting the website's SEO and internal link building. It is designed to help you monitor and manage internal keyword linking - a process that can significantly impact search engine rankings since they only see the meaning of ranking your website to the specific keyword once you also link to that keyword internally."), /* @__PURE__ */ React.createElement("p", null, "The module can help you target relevant keywords and phrases in your content. It also allows you to track and monitor the usage of the keywords. This can help you ensure that your content is optimised for maximum visibility for search engines."), /* @__PURE__ */ React.createElement("p", null, "In addition to helping improve search engine rankings, the module can also be used to strengthen the internal link structure of your website. It can help improve user experience by making it easier for visitors to find the content they are looking for. Internal linking also allows you to direct visitors to other parts of your website, helping to increase overall engagement.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function KeywordLinks({ moduleId }) {
  const { __ } = useI18n();
  const slug = "keyword";
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Keywords")]
    // [ 'd3-chart', __( 'Word Cloud' ) ],
  ]);
  const KeywordsTable = reactExports.lazy(() => __vitePreload(() => import("./KeywordsTable-l0xckuglwsi.js"), true ? ["./KeywordsTable-l0xckuglwsi.js","../main-l0xckuglwsi.js","./main-l0xckuglwsi.css","./ModuleViewHeaderBottom-l0xckuglwsi.js","./datepicker-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.css","./datepicker-l0xckuglwsi.css","./ModuleViewHeaderBottom-l0xckuglwsi.css","./TagsMenu-l0xckuglwsi.js","./Tooltip_SortingFiltering-l0xckuglwsi.js","./SuggestInputField-l0xckuglwsi.js","./icon-edit-l0xckuglwsi.js","./icon-link-l0xckuglwsi.js"] : void 0, import.meta.url));
  reactExports.lazy(() => __vitePreload(() => import("./D3WordCloud-l0xckuglwsi.js"), true ? ["./D3WordCloud-l0xckuglwsi.js","../main-l0xckuglwsi.js","./main-l0xckuglwsi.css","./transform-l0xckuglwsi.js","./OverviewTemplate-l0xckuglwsi.js","./OverviewTemplate-l0xckuglwsi.css","./_ModuleViewHeader-l0xckuglwsi.css"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-l0xckuglwsi.js"), true ? ["./Settings-l0xckuglwsi.js","../main-l0xckuglwsi.js","./main-l0xckuglwsi.css","./datepicker-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.js","./MultiSelectMenu-l0xckuglwsi.css","./datepicker-l0xckuglwsi.css","./Textarea-l0xckuglwsi.js","./Switch-l0xckuglwsi.js","./Switch-l0xckuglwsi.css","./Settings-l0xckuglwsi.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(KeywordLinksOverview, { moduleId }), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(KeywordsTable, { slug })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  KeywordLinks as default
};

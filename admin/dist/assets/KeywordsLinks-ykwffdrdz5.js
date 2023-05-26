import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-ykwffdrdz5.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-ykwffdrdz5.js";
/* empty css                              */function KeywordLinksOverview({ moduleId }) {
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
  const KeywordsTable = reactExports.lazy(() => __vitePreload(() => import("./KeywordsTable-ykwffdrdz5.js"), true ? ["./KeywordsTable-ykwffdrdz5.js","../main-ykwffdrdz5.js","./main-ykwffdrdz5.css","./ModuleViewHeaderBottom-ykwffdrdz5.js","./datepicker-ykwffdrdz5.js","./MultiSelectMenu-ykwffdrdz5.js","./MultiSelectMenu-ykwffdrdz5.css","./datepicker-ykwffdrdz5.css","./ModuleViewHeaderBottom-ykwffdrdz5.css","./TagsMenu-ykwffdrdz5.js","./Tooltip_SortingFiltering-ykwffdrdz5.js","./SuggestInputField-ykwffdrdz5.js","./icon-edit-ykwffdrdz5.js","./icon-link-ykwffdrdz5.js"] : void 0, import.meta.url));
  reactExports.lazy(() => __vitePreload(() => import("./D3WordCloud-ykwffdrdz5.js"), true ? ["./D3WordCloud-ykwffdrdz5.js","../main-ykwffdrdz5.js","./main-ykwffdrdz5.css","./transform-ykwffdrdz5.js","./OverviewTemplate-ykwffdrdz5.js","./OverviewTemplate-ykwffdrdz5.css","./_ModuleViewHeader-ykwffdrdz5.css"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-ykwffdrdz5.js"), true ? ["./Settings-ykwffdrdz5.js","../main-ykwffdrdz5.js","./main-ykwffdrdz5.css","./datepicker-ykwffdrdz5.js","./MultiSelectMenu-ykwffdrdz5.js","./MultiSelectMenu-ykwffdrdz5.css","./datepicker-ykwffdrdz5.css","./Textarea-ykwffdrdz5.js","./Switch-ykwffdrdz5.js","./Switch-ykwffdrdz5.css","./Settings-ykwffdrdz5.css"] : void 0, import.meta.url));
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

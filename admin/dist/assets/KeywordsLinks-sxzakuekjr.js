import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-sxzakuekjr.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-sxzakuekjr.js";
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
  const KeywordsTable = reactExports.lazy(() => __vitePreload(() => import("./KeywordsTable-sxzakuekjr.js"), true ? ["./KeywordsTable-sxzakuekjr.js","../main-sxzakuekjr.js","./main-sxzakuekjr.css","./ModuleViewHeaderBottom-sxzakuekjr.js","./datepicker-sxzakuekjr.js","./MultiSelectMenu-sxzakuekjr.js","./MultiSelectMenu-sxzakuekjr.css","./datepicker-sxzakuekjr.css","./ModuleViewHeaderBottom-sxzakuekjr.css","./TagsMenu-sxzakuekjr.js","./Tooltip_SortingFiltering-sxzakuekjr.js","./SuggestInputField-sxzakuekjr.js","./icon-edit-sxzakuekjr.js","./icon-link-sxzakuekjr.js"] : void 0, import.meta.url));
  reactExports.lazy(() => __vitePreload(() => import("./D3WordCloud-sxzakuekjr.js"), true ? ["./D3WordCloud-sxzakuekjr.js","../main-sxzakuekjr.js","./main-sxzakuekjr.css","./transform-sxzakuekjr.js","./OverviewTemplate-sxzakuekjr.js","./OverviewTemplate-sxzakuekjr.css","./_ModuleViewHeader-sxzakuekjr.css"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-sxzakuekjr.js"), true ? ["./Settings-sxzakuekjr.js","../main-sxzakuekjr.js","./main-sxzakuekjr.css","./datepicker-sxzakuekjr.js","./MultiSelectMenu-sxzakuekjr.js","./MultiSelectMenu-sxzakuekjr.css","./datepicker-sxzakuekjr.css","./Textarea-sxzakuekjr.js","./Switch-sxzakuekjr.js","./Switch-sxzakuekjr.css","./Settings-sxzakuekjr.css"] : void 0, import.meta.url));
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

import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-wcstbj3c61.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-wcstbj3c61.js";
import "./api-exclamation-wcstbj3c61.js";
/* empty css                              */function KeywordLinksOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Keywords Manager module is an incredibly valuable tool for boosting the website's SEO and internal link building. It is designed to help you monitor and manage internal keyword linking - a process that can significantly impact search engine rankings since they only see the meaning of ranking your website to the specific keyword once you also link to that keyword internally."), /* @__PURE__ */ React.createElement("p", null, "The module can help you target relevant keywords and phrases in your content. It also allows you to track and monitor the usage of the keywords. This can help you ensure that your content is optimized for maximum visibility for search engines."), /* @__PURE__ */ React.createElement("p", null, "In addition to helping improve search engine rankings, the module can also be used to strengthen the internal link structure of your website. It can help improve user experience by making it easier for visitors to find the content they are looking for. Internal linking also allows you to direct visitors to other parts of your website, helping to increase overall engagement."));
}
function KeywordLinks({ moduleId }) {
  const { __ } = useI18n();
  const slug = "keyword";
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Keywords")],
    ["d3-chart", __("Word Cloud")]
  ]);
  const KeywordsTable = reactExports.lazy(() => __vitePreload(() => import("./KeywordsTable-wcstbj3c61.js"), true ? ["./KeywordsTable-wcstbj3c61.js","../main-wcstbj3c61.js","./main.css","./useTableUpdater-wcstbj3c61.js","./datepicker-wcstbj3c61.js","./datepicker-wcstbj3c61.css","./useMutation-wcstbj3c61.js","./useTableUpdater-wcstbj3c61.css","./icon-link-wcstbj3c61.js"] : void 0, import.meta.url));
  const D3WordCloud = reactExports.lazy(() => __vitePreload(() => import("./D3WordCloud-wcstbj3c61.js"), true ? ["./D3WordCloud-wcstbj3c61.js","../main-wcstbj3c61.js","./main.css","./_ModuleViewHeader-wcstbj3c61.css"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-wcstbj3c61.js"), true ? ["./Settings-wcstbj3c61.js","../main-wcstbj3c61.js","./main.css","./datepicker-wcstbj3c61.js","./datepicker-wcstbj3c61.css","./Switch-wcstbj3c61.js","./Switch-wcstbj3c61.css","./useMutation-wcstbj3c61.js","./Settings-wcstbj3c61.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(KeywordLinksOverview, null)), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(KeywordsTable, { slug })), activeSection === "d3-chart" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(D3WordCloud, { slug })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  KeywordLinks as default
};

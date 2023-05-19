import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-06urfgcy5u.js";
import { O as Overview, M as ModuleViewHeader } from "./ModuleViewHeader-06urfgcy5u.js";
import "./Checkbox-06urfgcy5u.js";
/* empty css                              */function KeywordLinksOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val) }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("p", null, "The Keywords Manager module is an incredibly valuable tool for boosting the website's SEO and internal link building. It is designed to help you monitor and manage internal keyword linking - a process that can significantly impact search engine rankings since they only see the meaning of ranking your website to the specific keyword once you also link to that keyword internally."), /* @__PURE__ */ React.createElement("p", null, "The module can help you target relevant keywords and phrases in your content. It also allows you to track and monitor the usage of the keywords. This can help you ensure that your content is optimized for maximum visibility for search engines."), /* @__PURE__ */ React.createElement("p", null, "In addition to helping improve search engine rankings, the module can also be used to strengthen the internal link structure of your website. It can help improve user experience by making it easier for visitors to find the content they are looking for. Internal linking also allows you to direct visitors to other parts of your website, helping to increase overall engagement.")));
}
function KeywordLinks({ moduleId }) {
  const { __ } = useI18n();
  const slug = "keyword";
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    [slug, __("Keywords")]
    // [ 'd3-chart', __( 'Word Cloud' ) ],
  ]);
  const KeywordsTable = reactExports.lazy(() => __vitePreload(() => import("./KeywordsTable-06urfgcy5u.js"), true ? ["./KeywordsTable-06urfgcy5u.js","../main-06urfgcy5u.js","./main-06urfgcy5u.css","./ModuleViewHeaderBottom-06urfgcy5u.js","./datepicker-06urfgcy5u.js","./MultiSelectMenu-06urfgcy5u.js","./Checkbox-06urfgcy5u.js","./Checkbox-06urfgcy5u.css","./MultiSelectMenu-06urfgcy5u.css","./datepicker-06urfgcy5u.css","./ModuleViewHeaderBottom-06urfgcy5u.css","./TagsMenu-06urfgcy5u.js","./Tooltip_SortingFiltering-06urfgcy5u.js","./icon-edit-06urfgcy5u.js","./icon-link-06urfgcy5u.js"] : void 0, import.meta.url));
  reactExports.lazy(() => __vitePreload(() => import("./D3WordCloud-06urfgcy5u.js"), true ? ["./D3WordCloud-06urfgcy5u.js","../main-06urfgcy5u.js","./main-06urfgcy5u.css","./transform-06urfgcy5u.js","./ModuleViewHeader-06urfgcy5u.js","./Checkbox-06urfgcy5u.js","./Checkbox-06urfgcy5u.css","./ModuleViewHeader-06urfgcy5u.css","./_ModuleViewHeader-06urfgcy5u.css"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-06urfgcy5u.js"), true ? ["./Settings-06urfgcy5u.js","../main-06urfgcy5u.js","./main-06urfgcy5u.css","./datepicker-06urfgcy5u.js","./MultiSelectMenu-06urfgcy5u.js","./Checkbox-06urfgcy5u.js","./Checkbox-06urfgcy5u.css","./MultiSelectMenu-06urfgcy5u.css","./datepicker-06urfgcy5u.css","./Switch-06urfgcy5u.js","./Switch-06urfgcy5u.css","./Settings-06urfgcy5u.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(KeywordLinksOverview, { moduleId }), activeSection === slug && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(KeywordsTable, { slug })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  KeywordLinks as default
};

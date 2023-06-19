<<<<<<< HEAD:admin/dist/assets/KeywordsLinks-vqw3w5p1iw.js
<<<<<<< HEAD:admin/dist/assets/KeywordsLinks-vqw3w5p1iw.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-vqw3w5p1iw.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-vqw3w5p1iw.js";
=======
<<<<<<<< HEAD:admin/dist/assets/KeywordsLinks-txs3jaim6w.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { u as useI18n, _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/KeywordsLinks-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/KeywordsLinks-txs3jaim6w.js
/* empty css                              */function KeywordLinksOverview({ moduleId }) {
=======
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-o8x8qzqwuhk.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-o8x8qzqwuhk.js";
/* empty css                               */function KeywordLinksOverview({ moduleId }) {
>>>>>>> main:admin/dist/assets/KeywordsLinks-o8x8qzqwuhk.js
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
<<<<<<< HEAD:admin/dist/assets/KeywordsLinks-vqw3w5p1iw.js
<<<<<<< HEAD:admin/dist/assets/KeywordsLinks-vqw3w5p1iw.js
  const KeywordsTable = reactExports.lazy(() => __vitePreload(() => import("./KeywordsTable-vqw3w5p1iw.js"), true ? ["./KeywordsTable-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.js","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./ModuleViewHeaderBottom-vqw3w5p1iw.css","./TagsMenu-vqw3w5p1iw.js","./Tooltip_SortingFiltering-vqw3w5p1iw.js","./SuggestInputField-vqw3w5p1iw.js","./icon-edit-vqw3w5p1iw.js","./icon-link-vqw3w5p1iw.js"] : void 0, import.meta.url));
  reactExports.lazy(() => __vitePreload(() => import("./D3WordCloud-vqw3w5p1iw.js"), true ? ["./D3WordCloud-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./transform-vqw3w5p1iw.js","./OverviewTemplate-vqw3w5p1iw.js","./OverviewTemplate-vqw3w5p1iw.css","./_ModuleViewHeader-vqw3w5p1iw.css"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-vqw3w5p1iw.js"), true ? ["./Settings-vqw3w5p1iw.js","../main-vqw3w5p1iw.js","./main-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.js","./MultiSelectMenu-vqw3w5p1iw.css","./datepicker-vqw3w5p1iw.css","./Textarea-vqw3w5p1iw.js","./Switch-vqw3w5p1iw.js","./Switch-vqw3w5p1iw.css","./Settings-vqw3w5p1iw.css"] : void 0, import.meta.url));
=======
<<<<<<<< HEAD:admin/dist/assets/KeywordsLinks-txs3jaim6w.js
  const KeywordsTable = reactExports.lazy(() => __vitePreload(() => import("./KeywordsTable-txs3jaim6w.js"), true ? ["./KeywordsTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./TagsMenu-txs3jaim6w.js","./Tooltip_SortingFiltering-txs3jaim6w.js","./SuggestInputField-txs3jaim6w.js","./icon-edit-txs3jaim6w.js","./icon-link-txs3jaim6w.js"] : void 0, import.meta.url));
  reactExports.lazy(() => __vitePreload(() => import("./D3WordCloud-txs3jaim6w.js"), true ? ["./D3WordCloud-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./transform-txs3jaim6w.js","./OverviewTemplate-txs3jaim6w.js","./OverviewTemplate-txs3jaim6w.css","./_ModuleViewHeader-txs3jaim6w.css"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-txs3jaim6w.js"), true ? ["./Settings-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./Textarea-txs3jaim6w.js","./Switch-txs3jaim6w.js","./Switch-txs3jaim6w.css","./Settings-txs3jaim6w.css"] : void 0, import.meta.url));
========
  const KeywordsTable = reactExports.lazy(() => __vitePreload(() => import("./KeywordsTable-myg4akepfo.js"), true ? ["./KeywordsTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./TagsMenu-myg4akepfo.js","./Tooltip_SortingFiltering-myg4akepfo.js","./SuggestInputField-myg4akepfo.js","./icon-edit-myg4akepfo.js","./icon-link-myg4akepfo.js"] : void 0, import.meta.url));
  reactExports.lazy(() => __vitePreload(() => import("./D3WordCloud-myg4akepfo.js"), true ? ["./D3WordCloud-myg4akepfo.js","./index-myg4akepfo.js","./transform-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./OverviewTemplate-myg4akepfo.js","./OverviewTemplate-myg4akepfo.css","./_ModuleViewHeader-myg4akepfo.css"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-myg4akepfo.js"), true ? ["./Settings-myg4akepfo.js","./index-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./Textarea-myg4akepfo.js","./Switch-myg4akepfo.js","./Switch-myg4akepfo.css","./Settings-myg4akepfo.css"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/KeywordsLinks-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/KeywordsLinks-txs3jaim6w.js
=======
  const KeywordsTable = reactExports.lazy(() => __vitePreload(() => import("./KeywordsTable-o8x8qzqwuhk.js"), true ? ["./KeywordsTable-o8x8qzqwuhk.js","../main-o8x8qzqwuhk.js","./main-o8x8qzqwuhk.css","./ModuleViewHeaderBottom-o8x8qzqwuhk.js","./datepicker-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.css","./ModuleViewHeaderBottom-o8x8qzqwuhk.css","./TagsMenu-o8x8qzqwuhk.js","./Tooltip_SortingFiltering-o8x8qzqwuhk.js","./SuggestInputField-o8x8qzqwuhk.js","./icon-edit-o8x8qzqwuhk.js","./icon-link-o8x8qzqwuhk.js"] : void 0, import.meta.url));
  reactExports.lazy(() => __vitePreload(() => import("./D3WordCloud-o8x8qzqwuhk.js"), true ? ["./D3WordCloud-o8x8qzqwuhk.js","../main-o8x8qzqwuhk.js","./main-o8x8qzqwuhk.css","./transform-o8x8qzqwuhk.js","./OverviewTemplate-o8x8qzqwuhk.js","./OverviewTemplate-o8x8qzqwuhk.css","./_ModuleViewHeader-o8x8qzqwuhk.css"] : void 0, import.meta.url));
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-o8x8qzqwuhk.js"), true ? ["./Settings-o8x8qzqwuhk.js","../main-o8x8qzqwuhk.js","./main-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.js","./MultiSelectMenu-o8x8qzqwuhk.css","./datepicker-o8x8qzqwuhk.css","./Textarea-o8x8qzqwuhk.js","./Switch-o8x8qzqwuhk.js","./Switch-o8x8qzqwuhk.css","./Settings-o8x8qzqwuhk.css"] : void 0, import.meta.url));
>>>>>>> main:admin/dist/assets/KeywordsLinks-o8x8qzqwuhk.js
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

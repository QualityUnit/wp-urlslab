<<<<<<<< HEAD:admin/dist/assets/Screenshot-txs3jaim6w.js
import { r as reactExports, R as React, u as useI18n, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { u as useI18n, _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/Screenshot-myg4akepfo.js
/* empty css                              */function ScreenShotOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return (
    // has also property title for custom title like <Overview moduleId=xxx title="my title"
    // noCheckbox property hides "disable overview" checkbox on modules without tables (just overview and setttings in menu)
    // customSections={ sections }
    /* @__PURE__ */ React.createElement(Overview, { moduleId, section: (val) => setSection(val) }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "Screenshots are a great way to grab an audience's attention and make your content more appealing. With this module, you can easily add automatically generated screenshots via a shortcode into the content. It will not only save you time but will also give your content a professional look."), /* @__PURE__ */ React.createElement("p", null, "Using the Screenshots module can be especially useful for websites with many pages, where manually taking screenshots for each one can be time-consuming. With the module, you can quickly generate screenshots for each page."), /* @__PURE__ */ React.createElement("p", null, "Overall, the module makes screenshots easy to use with zero effort. It is a great way to save time and make your content stand out.")), section === "integrate" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "How to use the feature?"), /* @__PURE__ */ React.createElement("p", null, "It's almost effortless and will only take a maximum of five minutes. All you have to do is add a shortcode to your theme template, and the module will take care of the rest for you."), /* @__PURE__ */ React.createElement("h4", null, "Shortcode"), /* @__PURE__ */ React.createElement("code", null, '[urlslab-screenshot screenshot-type="carousel" url="https://www.liveagent.com" alt="Home" width="100%" height="100%" default-image="https://www.yourdomain.com/default_image.jpg"]'), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Shortcode Attributes")), /* @__PURE__ */ React.createElement("table", { border: "1" }, /* @__PURE__ */ React.createElement("tbody", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Attribute"), /* @__PURE__ */ React.createElement("th", null, "Required"), /* @__PURE__ */ React.createElement("th", null, "Description"), /* @__PURE__ */ React.createElement("th", null, "Default Value"), /* @__PURE__ */ React.createElement("th", null, "Possible Values")), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "screenshot-type"), /* @__PURE__ */ React.createElement("td", null, "optional"), /* @__PURE__ */ React.createElement("td", null, " "), /* @__PURE__ */ React.createElement("td", null, "carousel"), /* @__PURE__ */ React.createElement("td", null, "carousel, full-page, carousel-thumbnail, full-page-thumbnail")), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "url"), /* @__PURE__ */ React.createElement("td", null, "mandatory"), /* @__PURE__ */ React.createElement("td", null, "Link to the page from which a screenshot should be taken."), /* @__PURE__ */ React.createElement("td", null, " "), /* @__PURE__ */ React.createElement("td", null, " ")), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "alt"), /* @__PURE__ */ React.createElement("td", null, "optional"), /* @__PURE__ */ React.createElement("td", null, "Value of the image alt text."), /* @__PURE__ */ React.createElement("td", null, "A summary of the destination URL"), /* @__PURE__ */ React.createElement("td", null, " ")), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "width"), /* @__PURE__ */ React.createElement("td", null, "optional"), /* @__PURE__ */ React.createElement("td", null, "The width of the image."), /* @__PURE__ */ React.createElement("td", null, "100%"), /* @__PURE__ */ React.createElement("td", null, " ")), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "height"), /* @__PURE__ */ React.createElement("td", null, "optional"), /* @__PURE__ */ React.createElement("td", null, "The height of the image."), /* @__PURE__ */ React.createElement("td", null, "100%"), /* @__PURE__ */ React.createElement("td", null, " ")), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "default-image"), /* @__PURE__ */ React.createElement("td", null, "optional"), /* @__PURE__ */ React.createElement("td", null, "The URL of the default image in case we don't yet have the screenshot."), /* @__PURE__ */ React.createElement("td", null, "-"), /* @__PURE__ */ React.createElement("td", null, " ")))), /* @__PURE__ */ React.createElement("h4", null, "Example"), /* @__PURE__ */ React.createElement("p", null, "Example of shortcode to include a screenshot of www.liveagent.com to your website content: ", /* @__PURE__ */ React.createElement("code", null, '[urlslab-screenshot url="https://www.liveagent.com"]'))), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")))
  );
}
function Screenshot({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["screenshot", __("Screenshots")]
  ]);
<<<<<<<< HEAD:admin/dist/assets/Screenshot-txs3jaim6w.js
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-txs3jaim6w.js"), true ? ["./Settings-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./Textarea-txs3jaim6w.js","./Switch-txs3jaim6w.js","./Switch-txs3jaim6w.css","./Settings-txs3jaim6w.css"] : void 0, import.meta.url));
  const ScreenshotTable = reactExports.lazy(() => __vitePreload(() => import("./ScreenshotTable-txs3jaim6w.js"), true ? ["./ScreenshotTable-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.js","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./ModuleViewHeaderBottom-txs3jaim6w.css","./TagsMenu-txs3jaim6w.js","./Tooltip_SortingFiltering-txs3jaim6w.js","./icon-link-txs3jaim6w.js"] : void 0, import.meta.url));
========
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-myg4akepfo.js"), true ? ["./Settings-myg4akepfo.js","./index-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./Textarea-myg4akepfo.js","./Switch-myg4akepfo.js","./Switch-myg4akepfo.css","./Settings-myg4akepfo.css"] : void 0, import.meta.url));
  const ScreenshotTable = reactExports.lazy(() => __vitePreload(() => import("./ScreenshotTable-myg4akepfo.js"), true ? ["./ScreenshotTable-myg4akepfo.js","./index-myg4akepfo.js","./ModuleViewHeaderBottom-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./ModuleViewHeaderBottom-myg4akepfo.css","./TagsMenu-myg4akepfo.js","./Tooltip_SortingFiltering-myg4akepfo.js","./icon-link-myg4akepfo.js"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/Screenshot-myg4akepfo.js
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      moduleMenu: tableMenu,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(ScreenShotOverview, { moduleId }), activeSection === "screenshot" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(ScreenshotTable, { slug: "screenshot" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Screenshot as default
};

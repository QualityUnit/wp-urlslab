import { r as reactExports, R as React, _ as __vitePreload } from "../main-12fmhmm85q.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-12fmhmm85q.js";
/* empty css                              */function ImageAltAttributeOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, noCheckbox: true, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Image SEO module is an essential tool for any website owner looking to maximize visibility and ensure that their images are properly optimised for SEO. This module can instantly improve image SEO by automatically adding descriptive alt texts to images."), /* @__PURE__ */ React.createElement("p", null, "Images are an important part of any website, as they can help to draw in visitors and make the website more visually appealing. However, if images are not properly optimised for SEO, they may not show up in search engine results and can be detrimental to the website's overall visibility."), /* @__PURE__ */ React.createElement("p", null, "The module also helps to improve user experience by making it easier for visitors to find and understand the images on the website. Visitors can more easily identify the images and understand their context by automatically adding descriptive alt texts to images. It can make the website more user-friendly, which can help to improve the overall experience for visitors.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function ImageAltAttribute({ moduleId }) {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-12fmhmm85q.js"), true ? ["./Settings-12fmhmm85q.js","../main-12fmhmm85q.js","./main-12fmhmm85q.css","./datepicker-12fmhmm85q.js","./MultiSelectMenu-12fmhmm85q.js","./MultiSelectMenu-12fmhmm85q.css","./datepicker-12fmhmm85q.css","./Textarea-12fmhmm85q.js","./Switch-12fmhmm85q.js","./Switch-12fmhmm85q.css","./Settings-12fmhmm85q.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(
    ModuleViewHeader,
    {
      moduleId,
      activeMenu: (activemenu) => setActiveSection(activemenu)
    }
  ), activeSection === "overview" && /* @__PURE__ */ React.createElement(ImageAltAttributeOverview, { moduleId }), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  ImageAltAttribute as default
};

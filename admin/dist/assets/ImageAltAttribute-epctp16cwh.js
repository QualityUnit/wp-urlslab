import { R as React, r as reactExports, _ as __vitePreload } from "../main-epctp16cwh.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-epctp16cwh.js";
import "./api-exclamation-epctp16cwh.js";
/* empty css                              */function ImageAltAttributeOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The Image SEO module is an essential tool for any website owner looking to maximize visibility and ensure that their images are properly optimized for SEO. This module can instantly improve image SEO by automatically adding descriptive alt texts to images."), /* @__PURE__ */ React.createElement("p", null, "Images are an important part of any website, as they can help to draw in visitors and make the website more visually appealing. However, if images are not properly optimized for SEO, they may not show up in search engine results and can be detrimental to the website's overall visibility."), /* @__PURE__ */ React.createElement("p", null, "The module also helps to improve user experience by making it easier for visitors to find and understand the images on the website. Visitors can more easily identify the images and understand their context by automatically adding descriptive alt texts to images. It can make the website more user-friendly, which can help to improve the overall experience for visitors."));
}
function ImageAltAttribute({ moduleId }) {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-epctp16cwh.js"), true ? ["./Settings-epctp16cwh.js","../main-epctp16cwh.js","./main.css","./InputField-epctp16cwh.js","./datepicker-epctp16cwh.css","./Switch-epctp16cwh.js","./Switch-epctp16cwh.css","./useMutation-epctp16cwh.js","./Settings-epctp16cwh.css"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(ImageAltAttributeOverview, null)), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  ImageAltAttribute as default
};

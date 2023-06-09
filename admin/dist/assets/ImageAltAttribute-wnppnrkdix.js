<<<<<<< HEAD:admin/dist/assets/ImageAltAttribute-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/ImageAltAttribute-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/ImageAltAttribute-txs3jaim6w.js
import { r as reactExports, R as React, _ as __vitePreload } from "../main-txs3jaim6w.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-txs3jaim6w.js";
========
import { _ as __vitePreload } from "../main-myg4akepfo.js";
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/ImageAltAttribute-myg4akepfo.js
=======
import { r as reactExports, R as React, _ as __vitePreload } from "../main-6ohoyviu4u.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-6ohoyviu4u.js";
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/ImageAltAttribute-6ohoyviu4u.js
=======
import { r as reactExports, R as React, _ as __vitePreload } from "../main-wnppnrkdix.js";
import { O as Overview, M as ModuleViewHeader } from "./OverviewTemplate-wnppnrkdix.js";
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/ImageAltAttribute-wnppnrkdix.js
/* empty css                              */function ImageAltAttributeOverview({ moduleId }) {
  const [section, setSection] = reactExports.useState("about");
  return /* @__PURE__ */ React.createElement(Overview, { moduleId, noCheckbox: true, section: (val) => setSection(val), noIntegrate: true }, section === "about" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "About the module"), /* @__PURE__ */ React.createElement("p", null, "The Image SEO module is an essential tool for any website owner looking to maximize visibility and ensure that their images are properly optimised for SEO. This module can instantly improve image SEO by automatically adding descriptive alt texts to images."), /* @__PURE__ */ React.createElement("p", null, "Images are an important part of any website, as they can help to draw in visitors and make the website more visually appealing. However, if images are not properly optimised for SEO, they may not show up in search engine results and can be detrimental to the website's overall visibility."), /* @__PURE__ */ React.createElement("p", null, "The module also helps to improve user experience by making it easier for visitors to find and understand the images on the website. Visitors can more easily identify the images and understand their context by automatically adding descriptive alt texts to images. It can make the website more user-friendly, which can help to improve the overall experience for visitors.")), section === "faq" && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h4", null, "FAQ"), /* @__PURE__ */ React.createElement("p", null, "Available soon.")));
}
function ImageAltAttribute({ moduleId }) {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
<<<<<<< HEAD:admin/dist/assets/ImageAltAttribute-6ohoyviu4u.js
<<<<<<< HEAD:admin/dist/assets/ImageAltAttribute-myg4akepfo.js
<<<<<<<< HEAD:admin/dist/assets/ImageAltAttribute-txs3jaim6w.js
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-txs3jaim6w.js"), true ? ["./Settings-txs3jaim6w.js","../main-txs3jaim6w.js","./main-txs3jaim6w.css","./datepicker-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.js","./MultiSelectMenu-txs3jaim6w.css","./datepicker-txs3jaim6w.css","./Textarea-txs3jaim6w.js","./Switch-txs3jaim6w.js","./Switch-txs3jaim6w.css","./Settings-txs3jaim6w.css"] : void 0, import.meta.url));
========
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-myg4akepfo.js"), true ? ["./Settings-myg4akepfo.js","./index-myg4akepfo.js","..\\main-myg4akepfo.js","./main-myg4akepfo.css","./datepicker-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.js","./MultiSelectMenu-myg4akepfo.css","./datepicker-myg4akepfo.css","./Textarea-myg4akepfo.js","./Switch-myg4akepfo.js","./Switch-myg4akepfo.css","./Settings-myg4akepfo.css"] : void 0, import.meta.url));
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/ImageAltAttribute-myg4akepfo.js
=======
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-6ohoyviu4u.js"), true ? ["./Settings-6ohoyviu4u.js","..\\main-6ohoyviu4u.js","./main-6ohoyviu4u.css","./datepicker-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.js","./MultiSelectMenu-6ohoyviu4u.css","./datepicker-6ohoyviu4u.css","./Textarea-6ohoyviu4u.js","./Switch-6ohoyviu4u.js","./Switch-6ohoyviu4u.css","./Settings-6ohoyviu4u.css"] : void 0, import.meta.url));
>>>>>>> 18bd270e (custom vite build & watch):admin/dist/assets/ImageAltAttribute-6ohoyviu4u.js
=======
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-wnppnrkdix.js"), true ? ["./Settings-wnppnrkdix.js","..\\main-wnppnrkdix.js","./main-wnppnrkdix.css","./datepicker-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.js","./MultiSelectMenu-wnppnrkdix.css","./datepicker-wnppnrkdix.css","./Textarea-wnppnrkdix.js","./Switch-wnppnrkdix.js","./Switch-wnppnrkdix.css","./Settings-wnppnrkdix.css"] : void 0, import.meta.url));
>>>>>>> 63c8f541 (feat: add popup content):admin/dist/assets/ImageAltAttribute-wnppnrkdix.js
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

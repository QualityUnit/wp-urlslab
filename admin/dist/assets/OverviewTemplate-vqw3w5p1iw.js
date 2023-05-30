<<<<<<< HEAD:admin/dist/assets/OverviewTemplate-vqw3w5p1iw.js
import { R as React, u as useI18n, r as reactExports, g as get, c as update, a as useQueryClient } from "../main-vqw3w5p1iw.js";
=======
<<<<<<<< HEAD:admin/dist/assets/OverviewTemplate-txs3jaim6w.js
import { R as React, u as useI18n, r as reactExports, g as get, c as update, a as useQueryClient } from "../main-txs3jaim6w.js";
========
import { R as React, r as reactExports } from "./index-myg4akepfo.js";
import { u as useI18n, g as get, b as update, a as useQueryClient } from "../main-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/OverviewTemplate-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/OverviewTemplate-txs3jaim6w.js
/* empty css                              */const _SimpleButton = "";
function SimpleButton({ onClick, className, children }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: `urlslab-simple-button ${className}`,
      onClick: onClick || null
    },
    children
  );
}
function ModuleViewHeader({ moduleId, moduleMenu, activeMenu, noSettings }) {
  const { __ } = useI18n();
  const [active, setActive] = reactExports.useState("overview");
  const menuItems = /* @__PURE__ */ new Map([
    ["overview", __("Overview")],
    ["settings", __("Settings")]
  ]);
  const rememberActiveMenu = (state) => {
    update(moduleId, (dbData) => {
      return { ...dbData, activeMenu: state };
    });
  };
  const handleMenu = (menukey, returning) => {
    setActive(menukey);
    if (!returning) {
      rememberActiveMenu(menukey);
    }
    if (activeMenu) {
      activeMenu(menukey);
    }
  };
  const activator = (menukey) => {
    if (menukey === active) {
      return "active";
    }
    return "";
  };
  const getActiveMenu = reactExports.useCallback(async () => {
    const moduleData = moduleId && await get(moduleId);
    if (moduleData == null ? void 0 : moduleData.activeMenu) {
      handleMenu(moduleData == null ? void 0 : moduleData.activeMenu, true);
    }
  }, []);
  reactExports.useEffect(() => {
    getActiveMenu();
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-moduleView-header" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-moduleView-headerTop" }, /* @__PURE__ */ React.createElement(
    SimpleButton,
    {
      key: "overview",
      className: activator("overview"),
      onClick: () => handleMenu("overview")
    },
    menuItems.get("overview")
  ), moduleMenu ? Array.from(moduleMenu).map(([key, value]) => {
    return /* @__PURE__ */ React.createElement(
      SimpleButton,
      {
        key,
        className: activator(key),
        onClick: () => handleMenu(key)
      },
      value
    );
  }) : null, !noSettings && /* @__PURE__ */ React.createElement(
    SimpleButton,
    {
      key: "settings",
      className: activator("settings"),
      onClick: () => handleMenu("settings")
    },
    menuItems.get("settings")
  )));
}
<<<<<<< HEAD:admin/dist/assets/OverviewTemplate-vqw3w5p1iw.js
const AboutIcon = "" + new URL("icon-overview-about-vqw3w5p1iw.svg", import.meta.url).href;
const IntegrateIcon = "" + new URL("icon-overview-integrate-vqw3w5p1iw.svg", import.meta.url).href;
const FaqIcon = "" + new URL("icon-overview-faq-vqw3w5p1iw.svg", import.meta.url).href;
=======
<<<<<<<< HEAD:admin/dist/assets/OverviewTemplate-txs3jaim6w.js
const AboutIcon = "" + new URL("icon-overview-about-txs3jaim6w.svg", import.meta.url).href;
const IntegrateIcon = "" + new URL("icon-overview-integrate-txs3jaim6w.svg", import.meta.url).href;
const FaqIcon = "" + new URL("icon-overview-faq-txs3jaim6w.svg", import.meta.url).href;
========
const AboutIcon = "" + new URL("icon-overview-about-myg4akepfo.svg", import.meta.url).href;
const IntegrateIcon = "" + new URL("icon-overview-integrate-myg4akepfo.svg", import.meta.url).href;
const FaqIcon = "" + new URL("icon-overview-faq-myg4akepfo.svg", import.meta.url).href;
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/OverviewTemplate-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/OverviewTemplate-txs3jaim6w.js
const _OverviewTemplate = "";
function Overview({ moduleId, noFAQ, noIntegrate, title, customSections, section, children }) {
  const { __ } = useI18n();
  const [active, setActive] = reactExports.useState("about");
  const queryClient = useQueryClient();
  const moduleData = queryClient.getQueryData(["modules"])[moduleId];
  const handleMenu = (val) => {
    setActive(val);
    section(val);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel flex-tablet fadeInto" }, /* @__PURE__ */ React.createElement("ul", { className: "urlslab-overview-menu" }, /* @__PURE__ */ React.createElement("li", { className: `urlslab-overview-menuItem ${active === "about" ? "active" : ""}` }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleMenu("about") }, /* @__PURE__ */ React.createElement("span", { className: "urlslab-overview-menuIcon" }, /* @__PURE__ */ React.createElement("img", { src: AboutIcon, alt: __("About") })), __("About module"))), !noIntegrate && /* @__PURE__ */ React.createElement("li", { className: `urlslab-overview-menuItem ${active === "integrate" ? "active" : ""}` }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleMenu("integrate") }, /* @__PURE__ */ React.createElement("span", { className: "urlslab-overview-menuIcon" }, /* @__PURE__ */ React.createElement("img", { src: IntegrateIcon, alt: __("How to integrate") })), __("How to integrate"))), (customSections == null ? void 0 : customSections.length) > 0 && customSections.map((sect) => {
    const { id, title: sectionTitle, icon } = sect;
    return /* @__PURE__ */ React.createElement("li", { className: `urlslab-overview-menuItem ${active === id ? "active" : ""}`, key: id }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleMenu(id) }, icon && /* @__PURE__ */ React.createElement("span", { className: "urlslab-overview-menuIcon" }, /* @__PURE__ */ React.createElement("img", { src: icon, alt: sectionTitle })), sectionTitle));
  }), !noFAQ && /* @__PURE__ */ React.createElement("li", { className: `urlslab-overview-menuItem ${active === "faq" ? "active" : ""}` }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleMenu("faq") }, /* @__PURE__ */ React.createElement("span", { className: "urlslab-overview-menuIcon" }, /* @__PURE__ */ React.createElement("img", { src: FaqIcon, alt: __("FAQ") })), __("FAQ")))), /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview-content" }, title ? /* @__PURE__ */ React.createElement("h3", null, " ", title, " ") : (moduleData == null ? void 0 : moduleData.title) && /* @__PURE__ */ React.createElement("h3", null, " ", moduleData.title, " "), children)));
}
export {
  ModuleViewHeader as M,
  Overview as O
};

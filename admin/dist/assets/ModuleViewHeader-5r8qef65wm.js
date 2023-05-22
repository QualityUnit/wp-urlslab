import { u as useI18n, r as reactExports, a as useQueryClient, g as get, R as React, c as update } from "../main-5r8qef65wm.js";
import { C as Checkbox } from "./Checkbox-5r8qef65wm.js";
/* empty css                              */const AboutIcon = "" + new URL("icon-overview-about-5r8qef65wm.svg", import.meta.url).href;
const IntegrateIcon = "" + new URL("icon-overview-integrate-5r8qef65wm.svg", import.meta.url).href;
const FaqIcon = "" + new URL("icon-overview-faq-5r8qef65wm.svg", import.meta.url).href;
const _OverviewTemplate = "";
function Overview({ moduleId, noFAQ, noIntegrate, noCheckbox, title, customSections, section, children }) {
  const { __ } = useI18n();
  const [active, setActive] = reactExports.useState("about");
  const [overViewVisible, setOverviewVisibility] = reactExports.useState();
  const queryClient = useQueryClient();
  const moduleData = queryClient.getQueryData(["modules"])[moduleId];
  const handleMenu = (val) => {
    setActive(val);
    section(val);
  };
  const handleOverviewVisibility = (state) => {
    update(moduleId, (dbData) => {
      return { ...dbData, hideOverview: state };
    });
  };
  const overViewVisibility = reactExports.useCallback(async () => {
    if (!noCheckbox) {
      const { hideOverview } = await get(moduleId) || { hideOverview: false };
      setOverviewVisibility(hideOverview);
    }
  }, [moduleId, noCheckbox]);
  reactExports.useEffect(() => {
    overViewVisibility();
  }, [overViewVisibility]);
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview" }, !noCheckbox && /* @__PURE__ */ React.createElement(Checkbox, { className: "mb-m", smallText: true, key: overViewVisible, defaultValue: overViewVisible, onChange: handleOverviewVisibility }, __("Do not display the overview when opening the module")), /* @__PURE__ */ React.createElement("div", { className: "urlslab-panel flex-tablet fadeInto" }, /* @__PURE__ */ React.createElement("ul", { className: "urlslab-overview-menu" }, /* @__PURE__ */ React.createElement("li", { className: `urlslab-overview-menuItem ${active === "about" ? "active" : ""}` }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleMenu("about") }, /* @__PURE__ */ React.createElement("span", { className: "urlslab-overview-menuIcon" }, /* @__PURE__ */ React.createElement("img", { src: AboutIcon, alt: __("About") })), __("About module"))), !noIntegrate && /* @__PURE__ */ React.createElement("li", { className: `urlslab-overview-menuItem ${active === "integrate" ? "active" : ""}` }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleMenu("integrate") }, /* @__PURE__ */ React.createElement("span", { className: "urlslab-overview-menuIcon" }, /* @__PURE__ */ React.createElement("img", { src: IntegrateIcon, alt: __("How to integrate") })), __("How to integrate"))), (customSections == null ? void 0 : customSections.length) > 0 && customSections.map((sect) => {
    const { id, title: sectionTitle, icon } = sect;
    return /* @__PURE__ */ React.createElement("li", { className: `urlslab-overview-menuItem ${active === id ? "active" : ""}`, key: id }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleMenu(id) }, icon && /* @__PURE__ */ React.createElement("span", { className: "urlslab-overview-menuIcon" }, /* @__PURE__ */ React.createElement("img", { src: icon, alt: sectionTitle })), sectionTitle));
  }), !noFAQ && /* @__PURE__ */ React.createElement("li", { className: `urlslab-overview-menuItem ${active === "faq" ? "active" : ""}` }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleMenu("faq") }, /* @__PURE__ */ React.createElement("span", { className: "urlslab-overview-menuIcon" }, /* @__PURE__ */ React.createElement("img", { src: FaqIcon, alt: __("FAQ") })), __("FAQ")))), /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview-content" }, title ? /* @__PURE__ */ React.createElement("h3", null, " ", title, " ") : (moduleData == null ? void 0 : moduleData.title) && /* @__PURE__ */ React.createElement("h3", null, " ", moduleData.title, " "), children)));
}
const _SimpleButton = "";
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
  const handleMenu = (menukey) => {
    setActive(menukey);
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
  const getOverviewVisibility = reactExports.useCallback(async () => {
    const { hideOverview } = await get(moduleId) ?? false;
    if (hideOverview && moduleMenu) {
      handleMenu(Array.from(moduleMenu)[0][0]);
    }
  }, []);
  reactExports.useEffect(() => {
    getOverviewVisibility();
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
export {
  ModuleViewHeader as M,
  Overview as O
};

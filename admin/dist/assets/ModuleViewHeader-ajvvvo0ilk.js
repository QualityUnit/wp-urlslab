import { u as useI18n, b as useCheckApiKey, a as useQueryClient, R as React, B as Button, r as reactExports } from "../main-ajvvvo0ilk.js";
import { S as SvgApiExclamation } from "./api-exclamation-ajvvvo0ilk.js";
/* empty css                              */const _OverviewTemplate = "";
function Overview({ moduleId, children }) {
  const { __ } = useI18n();
  const { settingsLoaded, apiKeySet } = useCheckApiKey();
  const queryClient = useQueryClient();
  const moduleData = queryClient.getQueryData(["modules"])[moduleId];
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview urlslab-panel fadeInto" }, settingsLoaded && apiKeySet === false && moduleData.apikey && /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview-apiKey flex-tablet" }, /* @__PURE__ */ React.createElement("div", { className: "apiIcon xxl" }, /* @__PURE__ */ React.createElement(SvgApiExclamation, null)), /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview-apiKey__content" }, /* @__PURE__ */ React.createElement("h3", null, __("The module requires URLsLab service")), /* @__PURE__ */ React.createElement("p", null, __("With URLsLab service, you can unlock the full potential of the module and reap the benefits of automation. Save yourself hours of tedious work and get accurate results - it's the smart way to automate data processing!"))), /* @__PURE__ */ React.createElement(Button, { href: "https://www.urlslab.com", target: "_blank", active: true }, __("Get the API Key"))), /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview-content" }, /* @__PURE__ */ React.createElement("h3", null, moduleData.title), children));
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
function ModuleViewHeader({ moduleMenu, activeMenu, noSettings }) {
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

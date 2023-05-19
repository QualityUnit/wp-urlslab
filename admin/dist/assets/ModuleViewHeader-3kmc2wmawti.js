import { r as reactExports, u as useI18n, b as useCheckApiKey, a as useQueryClient, R as React, B as Button } from "../main-3kmc2wmawti.js";
/* empty css                               */const SvgApiExclamation = (props) => /* @__PURE__ */ reactExports.createElement("svg", { viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", xmlSpace: "preserve", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M12 .5C5.652.5.5 5.652.5 12S5.652 23.5 12 23.5 23.5 18.348 23.5 12 18.348.5 12 .5ZM12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2Z", style: {
  fill: "#2570ed"
} }), /* @__PURE__ */ reactExports.createElement("path", { d: "M13 16.23a.77.77 0 0 1-.77.77h-.46a.77.77 0 0 1-.77-.77v-.767a.77.77 0 0 1 .77-.771h.46a.77.77 0 0 1 .77.771v.767ZM13 12.384a.77.77 0 0 1-.77.77h-.46a.77.77 0 0 1-.77-.77V7.77a.77.77 0 0 1 .77-.77h.46a.77.77 0 0 1 .77.77v4.614Z", style: {
  fill: "#2570ed",
  fillRule: "nonzero"
} }));
const _OverviewTemplate = "";
function Overview({ moduleId, children }) {
  const { __ } = useI18n();
  const { settingsLoaded, apiKeySet } = useCheckApiKey();
  const queryClient = useQueryClient();
  const moduleData = queryClient.getQueryData(["modules"])[moduleId];
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview urlslab-panel fadeInto" }, settingsLoaded && apiKeySet === false && (moduleData == null ? void 0 : moduleData.apikey) && /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview-apiKey flex-tablet" }, /* @__PURE__ */ React.createElement("div", { className: "apiIcon xxl" }, /* @__PURE__ */ React.createElement(SvgApiExclamation, null)), /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview-apiKey__content" }, /* @__PURE__ */ React.createElement("h3", null, __("The module requires URLsLab service")), /* @__PURE__ */ React.createElement("p", null, __("With URLsLab service, you can unlock the full potential of the module and reap the benefits of automation. Save yourself hours of tedious work and get accurate results - it's the smart way to automate data processing!"))), /* @__PURE__ */ React.createElement(Button, { href: "https://www.urlslab.com", target: "_blank", active: true }, __("Get the API Key"))), /* @__PURE__ */ React.createElement("div", { className: "urlslab-overview-content" }, (moduleData == null ? void 0 : moduleData.title) && /* @__PURE__ */ React.createElement("h3", null, " ", moduleData == null ? void 0 : moduleData.title, " "), children));
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

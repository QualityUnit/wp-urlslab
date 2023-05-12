import { r as reactExports, u as useI18n, a as useQueryClient, R as React, s as setModule, b as useCheckApiKey } from "../main-rdp1zamdep.js";
import { S as Switch } from "./Switch-rdp1zamdep.js";
import { S as SvgApiExclamation } from "./api-exclamation-rdp1zamdep.js";
import { u as useMutation } from "./useMutation-rdp1zamdep.js";
const __vite_glob_0_0 = "" + new URL("optimize-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_1 = "" + new URL("urlslab-css-optimizer-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_2 = "" + new URL("urlslab-image-alt-attribute-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_3 = "" + new URL("urlslab-keywords-links-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_4 = "" + new URL("urlslab-lazy-loading-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_5 = "" + new URL("urlslab-link-enhancer-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_6 = "" + new URL("urlslab-media-offloader-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_7 = "" + new URL("urlslab-meta-tag-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_8 = "" + new URL("urlslab-related-resources-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_9 = "" + new URL("urlslab-screenshot-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_10 = "" + new URL("urlslab-search-and-replace-rdp1zamdep.png", import.meta.url).href;
const __vite_glob_0_11 = "" + new URL("yt_lazy_loading-rdp1zamdep.png", import.meta.url).href;
const SvgIconArrow = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: 15, height: 13, viewBox: "0 0 15 13", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M8.51351 0L7.37027 1.14562L11.8946 5.6875H0V7.3125H11.8946L7.37027 11.8544L8.51351 13L15 6.5L8.51351 0Z" }));
const _DashboardModule = "";
function DashboardModule({ moduleId, title, children, isActive, hasApi, activePage }) {
  const { __ } = useI18n();
  const queryClient = useQueryClient();
  const handleSwitch = useMutation({
    mutationFn: () => {
      return setModule(moduleId, { active: !isActive });
    },
    onSuccess: () => {
      queryClient.setQueryData(["modules", moduleId.active], !isActive);
      queryClient.invalidateQueries(["modules"]);
    }
  });
  const handleActive = (module) => {
    if (activePage) {
      activePage(module);
    }
  };
  const imagePath = new URL((/* @__PURE__ */ Object.assign({ "../assets/images/modules/optimize.png": __vite_glob_0_0, "../assets/images/modules/urlslab-css-optimizer.png": __vite_glob_0_1, "../assets/images/modules/urlslab-image-alt-attribute.png": __vite_glob_0_2, "../assets/images/modules/urlslab-keywords-links.png": __vite_glob_0_3, "../assets/images/modules/urlslab-lazy-loading.png": __vite_glob_0_4, "../assets/images/modules/urlslab-link-enhancer.png": __vite_glob_0_5, "../assets/images/modules/urlslab-media-offloader.png": __vite_glob_0_6, "../assets/images/modules/urlslab-meta-tag.png": __vite_glob_0_7, "../assets/images/modules/urlslab-related-resources.png": __vite_glob_0_8, "../assets/images/modules/urlslab-screenshot.png": __vite_glob_0_9, "../assets/images/modules/urlslab-search-and-replace.png": __vite_glob_0_10, "../assets/images/modules/yt_lazy_loading.png": __vite_glob_0_11 }))[`../assets/images/modules/${moduleId}.png`], self.location).pathname;
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-dashboardmodule ${handleSwitch.isLoading ? "activating" : ""} ${isActive ? "active" : ""}` }, hasApi ? /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-api" }, /* @__PURE__ */ React.createElement(SvgApiExclamation, null), __("URLsLab API Key Required")) : "", handleSwitch.isLoading ? /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-activating" }, isActive ? __("Deactivating…") : __("Activating…")) : "", /* @__PURE__ */ React.createElement(
    Switch,
    {
      secondary: true,
      onChange: () => handleSwitch.mutate(),
      className: "urlslab-dashboardmodule-switch",
      label: __("Activate module"),
      labelOff: __("Deactivate module"),
      checked: isActive
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-main flex-tablet flex-align-center" }, imagePath ? /* @__PURE__ */ React.createElement("img", { className: "urlslab-dashboardmodule-image fadeInto", src: imagePath, alt: title }) : null, /* @__PURE__ */ React.createElement("h3", { className: "urlslab-dashboardmodule-title" }, title), /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-content" }, /* @__PURE__ */ React.createElement("p", null, children), isActive ? /* @__PURE__ */ React.createElement("button", { className: "urlslab-learnMore", onClick: () => handleActive(moduleId) }, __("Manage module"), " ", /* @__PURE__ */ React.createElement(SvgIconArrow, null)) : null)));
}
function Modules({ modules, activePage }) {
  const { settingsLoaded, apiKeySet } = useCheckApiKey();
  if (!modules.length) {
    return;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "urlslab-modules flex-tablet-landscape flex-wrap" }, modules.map((module) => {
    return module.id !== "general" ? /* @__PURE__ */ React.createElement(
      DashboardModule,
      {
        key: module.id,
        moduleId: module.id,
        hasApi: settingsLoaded && apiKeySet === false && module.apikey,
        isActive: module.active,
        title: module.title,
        activePage: (mod) => activePage(mod)
      },
      module.description
    ) : null;
  })));
}
export {
  Modules as default
};

import { r as reactExports, u as useI18n, a as useQueryClient, R as React, T as Tag, s as setModule, b as useCheckApiKey } from "../main-0goypwedk6.js";
import { S as Switch } from "./Switch-0goypwedk6.js";
import { u as useMutation } from "./useMutation-0goypwedk6.js";
const __vite_glob_0_0 = "" + new URL("optimize-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_1 = "" + new URL("redirects-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_2 = "" + new URL("urlslab-css-optimizer-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_3 = "" + new URL("urlslab-generator-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_4 = "" + new URL("urlslab-image-alt-attribute-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_5 = "" + new URL("urlslab-keywords-links-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_6 = "" + new URL("urlslab-lazy-loading-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_7 = "" + new URL("urlslab-link-enhancer-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_8 = "" + new URL("urlslab-media-offloader-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_9 = "" + new URL("urlslab-meta-tag-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_10 = "" + new URL("urlslab-related-resources-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_11 = "" + new URL("urlslab-screenshot-0goypwedk6.svg", import.meta.url).href;
const __vite_glob_0_12 = "" + new URL("urlslab-search-and-replace-0goypwedk6.svg", import.meta.url).href;
const SvgIconArrow = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: 15, height: 13, viewBox: "0 0 15 13", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M8.51351 0L7.37027 1.14562L11.8946 5.6875H0V7.3125H11.8946L7.37027 11.8544L8.51351 13L15 6.5L8.51351 0Z" }));
const _DashboardModule = "";
function DashboardModule({ moduleId, title, children, isActive, tags, activePage }) {
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
  const iconPath = new URL((/* @__PURE__ */ Object.assign({ "../assets/images/modules/optimize.svg": __vite_glob_0_0, "../assets/images/modules/redirects.svg": __vite_glob_0_1, "../assets/images/modules/urlslab-css-optimizer.svg": __vite_glob_0_2, "../assets/images/modules/urlslab-generator.svg": __vite_glob_0_3, "../assets/images/modules/urlslab-image-alt-attribute.svg": __vite_glob_0_4, "../assets/images/modules/urlslab-keywords-links.svg": __vite_glob_0_5, "../assets/images/modules/urlslab-lazy-loading.svg": __vite_glob_0_6, "../assets/images/modules/urlslab-link-enhancer.svg": __vite_glob_0_7, "../assets/images/modules/urlslab-media-offloader.svg": __vite_glob_0_8, "../assets/images/modules/urlslab-meta-tag.svg": __vite_glob_0_9, "../assets/images/modules/urlslab-related-resources.svg": __vite_glob_0_10, "../assets/images/modules/urlslab-screenshot.svg": __vite_glob_0_11, "../assets/images/modules/urlslab-search-and-replace.svg": __vite_glob_0_12 }))[`../assets/images/modules/${moduleId}.svg`], self.location).pathname;
  const { labels, labelsList } = tags;
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-dashboardmodule ${handleSwitch.isLoading ? "activating" : ""} ${isActive ? "active" : ""}` }, handleSwitch.isLoading ? /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-activating" }, isActive ? __("Deactivating…") : __("Activating…")) : "", /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-top flex-tablet flex-align-center" }, iconPath ? /* @__PURE__ */ React.createElement("img", { className: "urlslab-dashboardmodule-icon fadeInto", src: iconPath, alt: title }) : null, /* @__PURE__ */ React.createElement("h3", { className: "urlslab-dashboardmodule-title" }, title), labels.includes("beta") && /* @__PURE__ */ React.createElement(Tag, { className: "midSize c-white bg-primary-color" }, "BETA"), /* @__PURE__ */ React.createElement(
    Switch,
    {
      secondary: true,
      onChange: () => handleSwitch.mutate(),
      className: "urlslab-dashboardmodule-switch ma-left",
      label: __("Activate"),
      labelOff: __("Deactivate"),
      checked: isActive
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-content" }, /* @__PURE__ */ React.createElement("p", null, children), labels.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-tags" }, labels.map((tag) => {
    const { name, color } = labelsList[tag];
    return tag !== "beta" && /* @__PURE__ */ React.createElement(Tag, { key: tag, className: `midSize smallText mr-s ${!color && "bg-grey-lighter"}`, style: color && { backgroundColor: color } }, name);
  })), isActive ? /* @__PURE__ */ React.createElement("button", { className: "urlslab-learnMore ma-top c-black", onClick: () => handleActive(moduleId) }, __("Manage plugin"), " ", /* @__PURE__ */ React.createElement(SvgIconArrow, null)) : null));
}
function Modules({ modules, activePage }) {
  const { settingsLoaded, apiKeySet } = useCheckApiKey();
  if (!modules.length) {
    return;
  }
  const labelsList = {
    paid: { name: "Paid service", color: "#75E9DB" },
    free: { name: "Free" },
    experimental: { name: "Experimental", color: "#ff492b" },
    beta: { name: "Beta", color: "#2570ED" },
    alpha: { name: "Alpha" },
    expert: { name: "Expert" },
    seo: { name: "SEO", color: "#D4C5F9" },
    cron: { name: "Cron" },
    performance: { name: "Performance", color: "#65B5FF" },
    tools: { name: "Tools", color: "#FFD189" },
    ai: { name: "AI", color: "#F86767" }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "urlslab-modules flex-tablet-landscape flex-wrap" }, modules.map((module) => {
    const { id, apikey, active, title, description, labels } = module;
    return module.id !== "general" ? /* @__PURE__ */ React.createElement(
      DashboardModule,
      {
        key: id,
        moduleId: id,
        hasApi: settingsLoaded && apiKeySet === false && apikey,
        isActive: active,
        title,
        tags: { labels, labelsList },
        activePage: (mod) => activePage(mod)
      },
      description
    ) : null;
  })));
}
export {
  Modules as default
};

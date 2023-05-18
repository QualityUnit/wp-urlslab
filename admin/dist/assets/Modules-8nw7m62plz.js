import { u as useI18n, a as useQueryClient, R as React, T as Tag, s as setModule, b as useCheckApiKey } from "../main-8nw7m62plz.js";
import { S as Switch } from "./Switch-8nw7m62plz.js";
import { u as useMutation } from "./useMutation-8nw7m62plz.js";
const __vite_glob_0_0 = "" + new URL("optimize-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_1 = "" + new URL("redirects-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_2 = "" + new URL("urlslab-css-optimizer-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_3 = "" + new URL("urlslab-generator-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_4 = "" + new URL("urlslab-image-alt-attribute-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_5 = "" + new URL("urlslab-keywords-links-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_6 = "" + new URL("urlslab-lazy-loading-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_7 = "" + new URL("urlslab-link-enhancer-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_8 = "" + new URL("urlslab-media-offloader-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_9 = "" + new URL("urlslab-meta-tag-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_10 = "" + new URL("urlslab-related-resources-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_11 = "" + new URL("urlslab-screenshot-8nw7m62plz.svg", import.meta.url).href;
const __vite_glob_0_12 = "" + new URL("urlslab-search-and-replace-8nw7m62plz.svg", import.meta.url).href;
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
  const iconPath = new URL((/* @__PURE__ */ Object.assign({ "../assets/images/modules/optimize.svg": __vite_glob_0_0, "../assets/images/modules/redirects.svg": __vite_glob_0_1, "../assets/images/modules/urlslab-css-optimizer.svg": __vite_glob_0_2, "../assets/images/modules/urlslab-generator.svg": __vite_glob_0_3, "../assets/images/modules/urlslab-image-alt-attribute.svg": __vite_glob_0_4, "../assets/images/modules/urlslab-keywords-links.svg": __vite_glob_0_5, "../assets/images/modules/urlslab-lazy-loading.svg": __vite_glob_0_6, "../assets/images/modules/urlslab-link-enhancer.svg": __vite_glob_0_7, "../assets/images/modules/urlslab-media-offloader.svg": __vite_glob_0_8, "../assets/images/modules/urlslab-meta-tag.svg": __vite_glob_0_9, "../assets/images/modules/urlslab-related-resources.svg": __vite_glob_0_10, "../assets/images/modules/urlslab-screenshot.svg": __vite_glob_0_11, "../assets/images/modules/urlslab-search-and-replace.svg": __vite_glob_0_12 }))[`../assets/images/modules/${moduleId}.svg`], self.location).pathname;
  const { labels, labelsList } = tags;
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-dashboardmodule ${handleSwitch.isLoading ? "activating" : ""} ${isActive ? "active" : ""}` }, handleSwitch.isLoading ? /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-activating" }, isActive ? __("Deactivating…") : __("Activating…")) : "", /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-top flex-tablet flex-align-center" }, iconPath ? /* @__PURE__ */ React.createElement("img", { className: "urlslab-dashboardmodule-icon fadeInto", src: iconPath, alt: title }) : null, /* @__PURE__ */ React.createElement("h3", { className: "urlslab-dashboardmodule-title" }, title), /* @__PURE__ */ React.createElement(
    Switch,
    {
      secondary: true,
      onChange: () => handleSwitch.mutate(),
      className: "urlslab-dashboardmodule-switch ma-left",
      label: "",
      labelOff: "",
      checked: isActive
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-content" }, /* @__PURE__ */ React.createElement("p", null, children), labels.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-tags" }, labels.map((tag) => {
    const { name, color } = labelsList[tag];
    return /* @__PURE__ */ React.createElement(Tag, { key: tag, className: `midSize mr-s ${!color && "bg-grey-lighter"}`, style: color && { backgroundColor: color } }, name);
  }))));
}
function Modules({ modules, activePage }) {
  const { settingsLoaded, apiKeySet } = useCheckApiKey();
  if (!modules.length) {
    return;
  }
  const labelsList = {
    paid: { name: "Paid service", color: "#00c996" },
    free: { name: "Free" },
    experimental: { name: "Experimental", color: "#ff8875" },
    beta: { name: "Beta", color: "#75a9ff" },
    alpha: { name: "Alpha" },
    expert: { name: "Expert" },
    seo: { name: "SEO", color: "#D4C5F9" },
    cron: { name: "Cron" },
    performance: { name: "Performance", color: "#65B5FF" },
    tools: { name: "Tools", color: "#FFD189" },
    ai: { name: "AI", color: "#ff7a7a" }
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

import { a as useQueryClient, r as reactExports, g as get, u as useI18n, b as useMainMenu, R as React, T as Tag, s as setModule, d as delay } from "../main-f2t1lzmrns.js";
import { S as Switch } from "./Switch-f2t1lzmrns.js";
import { u as useMutation, M as MultiSelectMenu } from "./MultiSelectMenu-f2t1lzmrns.js";
function useCheckApiKey() {
  const queryClient = useQueryClient();
  const settingsLoaded = queryClient.getQueryData(["general"]);
  const [apiKeySet, setHasApiKey] = reactExports.useState();
  reactExports.useEffect(() => {
    get("apiKeySet").then((val) => {
      if (val === false) {
        setHasApiKey(false);
      }
    });
  });
  return { settingsLoaded, apiKeySet };
}
const __vite_glob_0_0 = "" + new URL("optimize-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_1 = "" + new URL("redirects-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_2 = "" + new URL("urlslab-cache-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_3 = "" + new URL("urlslab-css-optimizer-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_4 = "" + new URL("urlslab-custom-html-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_5 = "" + new URL("urlslab-generator-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_6 = "" + new URL("urlslab-image-alt-attribute-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_7 = "" + new URL("urlslab-keywords-links-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_8 = "" + new URL("urlslab-cache-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_9 = "" + new URL("urlslab-link-enhancer-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_10 = "" + new URL("urlslab-media-offloader-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_11 = "" + new URL("urlslab-meta-tag-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_12 = "" + new URL("urlslab-related-resources-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_13 = "" + new URL("urlslab-screenshot-f2t1lzmrns.svg", import.meta.url).href;
const __vite_glob_0_14 = "" + new URL("urlslab-custom-html-f2t1lzmrns.svg", import.meta.url).href;
const _DashboardModule = "";
function DashboardModule({ moduleId, title, children, isActive, tags }) {
  const { __ } = useI18n();
  const [active, setActive] = reactExports.useState(isActive);
  const { setActivePage } = useMainMenu();
  const handleSwitch = useMutation({
    mutationFn: async () => {
      const response = await setModule(moduleId, { active: !active });
      return { response };
    },
    onSuccess: ({ response }) => {
      if (response.ok) {
        setActive(!active);
        return false;
      }
      setActive(isActive);
    }
  });
  const iconPath = new URL((/* @__PURE__ */ Object.assign({ "../assets/images/modules/optimize.svg": __vite_glob_0_0, "../assets/images/modules/redirects.svg": __vite_glob_0_1, "../assets/images/modules/urlslab-cache.svg": __vite_glob_0_2, "../assets/images/modules/urlslab-css-optimizer.svg": __vite_glob_0_3, "../assets/images/modules/urlslab-custom-html.svg": __vite_glob_0_4, "../assets/images/modules/urlslab-generator.svg": __vite_glob_0_5, "../assets/images/modules/urlslab-image-alt-attribute.svg": __vite_glob_0_6, "../assets/images/modules/urlslab-keywords-links.svg": __vite_glob_0_7, "../assets/images/modules/urlslab-lazy-loading.svg": __vite_glob_0_8, "../assets/images/modules/urlslab-link-enhancer.svg": __vite_glob_0_9, "../assets/images/modules/urlslab-media-offloader.svg": __vite_glob_0_10, "../assets/images/modules/urlslab-meta-tag.svg": __vite_glob_0_11, "../assets/images/modules/urlslab-related-resources.svg": __vite_glob_0_12, "../assets/images/modules/urlslab-screenshot.svg": __vite_glob_0_13, "../assets/images/modules/urlslab-search-and-replace.svg": __vite_glob_0_14 }))[`../assets/images/modules/${moduleId}.svg`], self.location).pathname;
  const { labels, labelsList } = tags;
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-dashboardmodule ${handleSwitch.isLoading ? "activating" : ""} ${active ? "active" : ""}` }, handleSwitch.isLoading ? /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-activating" }, active ? __("Deactivating…") : __("Activating…")) : "", /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-top flex-tablet flex-align-center" }, iconPath ? /* @__PURE__ */ React.createElement("img", { className: "urlslab-dashboardmodule-icon fadeInto", src: iconPath, alt: title }) : null, /* @__PURE__ */ React.createElement("h3", { className: "urlslab-dashboardmodule-title" }, /* @__PURE__ */ React.createElement("button", { className: `${active ? "active" : ""}`, onClick: active ? () => setActivePage(moduleId) : null }, title)), /* @__PURE__ */ React.createElement(
    Switch,
    {
      secondary: true,
      onChange: () => handleSwitch.mutate(),
      className: "urlslab-dashboardmodule-switch ma-left",
      label: "",
      labelOff: "",
      defaultValue: active
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-content" }, /* @__PURE__ */ React.createElement("p", null, children), labels.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "urlslab-dashboardmodule-tags" }, labels.map((tag) => {
    const { name, color } = labelsList[tag];
    return /* @__PURE__ */ React.createElement(Tag, { key: tag, autoTextColor: color, className: `midSize mr-s ${!color && "bg-grey-lighter"}`, style: color && { backgroundColor: color } }, name);
  }))));
}
const DashboardModule$1 = reactExports.memo(DashboardModule);
const _SearchField = "";
function SearchField({ defaultValue, autoFocus, liveUpdate, placeholder, className, onChange }) {
  const [val, setVal] = reactExports.useState(defaultValue || "");
  const handleVal = reactExports.useCallback((event) => {
    if (onChange && (defaultValue !== val || !val)) {
      onChange(event.target.value);
    }
  }, [onChange, defaultValue, val]);
  const handleValLive = (event) => {
    if (liveUpdate) {
      delay(() => handleVal(event), 800)();
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: `urlslab-searchfield urlslab-inputField has-svg ${className ? className : ""} ${val ? "has-value" : ""}` }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M9.167 16.583A7.417 7.417 0 1 0 9.166 1.75a7.417 7.417 0 0 0 .001 14.833Zm0-1.5a5.917 5.917 0 1 1 0-11.833 5.917 5.917 0 0 1 0 11.833Z", style: { fill: "#65676b" } }), /* @__PURE__ */ React.createElement("path", { d: "m18.03 16.97-3.625-3.625a.75.75 0 0 0-1.061 1.06l3.625 3.625a.75.75 0 0 0 1.061-1.06Z", style: { fill: "#65676b" } })), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "urlslab-searchfield-input urlslab-input input__text",
      type: "search",
      defaultValue: val,
      autoFocus,
      onChange: (event) => {
        setVal(event.target.value);
        handleValLive(event);
      },
      onBlur: (event) => handleVal(event),
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.keyCode === 9) {
          event.target.blur();
        }
      },
      placeholder: placeholder ? placeholder : "Search..."
    }
  ));
}
function Modules({ modules }) {
  const { __ } = useI18n();
  const { settingsLoaded, apiKeySet } = useCheckApiKey();
  const [filterBy, setFilterBy] = reactExports.useState({});
  const labelsList = {
    paid: { name: "Paid service", color: "#00c996" },
    // expert: { name: 'Experts', color: '#ffc996' },
    free: { name: "Free" },
    // experimental: { name: 'Experimental', color: '#ff8875' },
    beta: { name: "Beta", color: "#75a9ff" },
    // alpha: { name: 'Alpha' },
    // expert: { name: 'Expert' },
    seo: { name: "SEO", color: "#D4C5F9" },
    // cron: { name: 'Cron' },
    performance: { name: "Performance", color: "#65B5FF" },
    tools: { name: "Tools", color: "#FFD189" },
    ai: { name: "AI", color: "#ff7a7a" }
  };
  const statusList = {
    active: "Active modules",
    inactive: "Inactive modules"
  };
  let categoriesList = {};
  Object.entries({ ...labelsList }).map(([key, val]) => {
    const { name } = val;
    if (key !== "paid" && key !== "free") {
      categoriesList = { ...categoriesList, [key]: name };
    }
    return false;
  });
  const pricingList = {
    free: labelsList.free.name,
    paid: labelsList.paid.name
  };
  if (!modules.length) {
    return;
  }
  const handleFiltering = ({ input, type }) => {
    let inputValue = input;
    if (typeof input === "string") {
      inputValue = input.toLowerCase();
    }
    setFilterBy((filter2) => {
      return { ...filter2, [type]: inputValue };
    });
  };
  const filter = (module) => {
    const { apikey, active, labels } = module;
    const title = module.title.toLowerCase();
    const description = module.description.toLowerCase();
    const { search, categories, status, pricing } = filterBy;
    const moduleStatus = active ? "active" : "inactive";
    if ((!search || search && (title.includes(search) || description.includes(search))) && (!(categories == null ? void 0 : categories.length) || (labels == null ? void 0 : labels.some((label) => categories == null ? void 0 : categories.includes(label)))) && (!(status == null ? void 0 : status.length) || (status == null ? void 0 : status.some((val) => val === moduleStatus))) && (!(pricing == null ? void 0 : pricing.length) || (labels == null ? void 0 : labels.some((label) => pricing == null ? void 0 : pricing.includes(label))))) {
      return true;
    }
    return false;
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "urlslab-subheader flex flex-align-center" }, /* @__PURE__ */ React.createElement(SearchField, { liveUpdate: true, autoFocus: true, onChange: (input) => handleFiltering({ input, type: "search" }), placeholder: __("Search") }), /* @__PURE__ */ React.createElement("span", { className: "ml-l mr-s fs-xm" }, __("Filters"), ":"), /* @__PURE__ */ React.createElement(
    MultiSelectMenu,
    {
      id: "categories",
      onChange: (input) => handleFiltering({ input, type: "categories" }),
      className: "mr-s",
      isFilter: true,
      items: categoriesList,
      defaultValue: Object.keys(categoriesList)
    },
    __("Categories")
  ), /* @__PURE__ */ React.createElement(
    MultiSelectMenu,
    {
      id: "status",
      onChange: (input) => handleFiltering({ input, type: "status" }),
      className: "mr-s",
      isFilter: true,
      items: statusList,
      defaultValue: Object.keys(statusList)
    },
    __("Status")
  ), /* @__PURE__ */ React.createElement(
    MultiSelectMenu,
    {
      id: "pricing",
      onChange: (input) => handleFiltering({ input, type: "pricing" }),
      className: "mr-s",
      isFilter: true,
      items: pricingList,
      defaultValue: Object.keys(pricingList)
    },
    __("Pricing")
  )), /* @__PURE__ */ React.createElement("div", { className: "urlslab-modules flex-tablet-landscape flex-wrap" }, modules.map((module) => {
    const { id, apikey, active, title, description, labels } = module;
    return module.id !== "general" && filter(module) ? /* @__PURE__ */ React.createElement(
      DashboardModule$1,
      {
        key: id,
        moduleId: id,
        hasApi: settingsLoaded && apiKeySet === false && apikey,
        isActive: active,
        title,
        tags: { labels, labelsList }
      },
      description
    ) : null;
  })));
}
export {
  Modules as default
};

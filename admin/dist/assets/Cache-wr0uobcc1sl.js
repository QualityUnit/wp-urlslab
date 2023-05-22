import { R as React, u as useI18n, r as reactExports, _ as __vitePreload } from "../main-wr0uobcc1sl.js";
import { M as ModuleViewHeader, O as Overview } from "./ModuleViewHeader-wr0uobcc1sl.js";
import "./Checkbox-wr0uobcc1sl.js";
/* empty css                               */function CacheOverview() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "Enhance your website speed with caching."));
}
function Cache({ moduleId }) {
  const { __ } = useI18n();
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const tableMenu = /* @__PURE__ */ new Map([
    ["cache-rules", __("Cache Rules")]
  ]);
  const SettingsModule = reactExports.lazy(() => __vitePreload(() => import("./Settings-wr0uobcc1sl.js"), true ? ["./Settings-wr0uobcc1sl.js","../main-wr0uobcc1sl.js","./main-wr0uobcc1sl.css","./datepicker-wr0uobcc1sl.js","./MultiSelectMenu-wr0uobcc1sl.js","./Checkbox-wr0uobcc1sl.js","./Checkbox-wr0uobcc1sl.css","./MultiSelectMenu-wr0uobcc1sl.css","./datepicker-wr0uobcc1sl.css","./Switch-wr0uobcc1sl.js","./Switch-wr0uobcc1sl.css","./Settings-wr0uobcc1sl.css"] : void 0, import.meta.url));
  const CacheRulesTable = reactExports.lazy(() => __vitePreload(() => import("./CacheRulesTable-wr0uobcc1sl.js"), true ? ["./CacheRulesTable-wr0uobcc1sl.js","../main-wr0uobcc1sl.js","./main-wr0uobcc1sl.css","./ModuleViewHeaderBottom-wr0uobcc1sl.js","./datepicker-wr0uobcc1sl.js","./MultiSelectMenu-wr0uobcc1sl.js","./Checkbox-wr0uobcc1sl.js","./Checkbox-wr0uobcc1sl.css","./MultiSelectMenu-wr0uobcc1sl.css","./datepicker-wr0uobcc1sl.css","./ModuleViewHeaderBottom-wr0uobcc1sl.css","./TagsMenu-wr0uobcc1sl.js","./Tooltip_SortingFiltering-wr0uobcc1sl.js","./icon-edit-wr0uobcc1sl.js"] : void 0, import.meta.url));
  return /* @__PURE__ */ React.createElement("div", { className: "urlslab-tableView" }, /* @__PURE__ */ React.createElement(ModuleViewHeader, { moduleMenu: tableMenu, activeMenu: (activemenu) => setActiveSection(activemenu) }), activeSection === "overview" && /* @__PURE__ */ React.createElement(Overview, { moduleId }, /* @__PURE__ */ React.createElement(CacheOverview, null)), activeSection === "cache-rules" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(CacheRulesTable, { slug: "cache-rules" })), activeSection === "settings" && /* @__PURE__ */ React.createElement(reactExports.Suspense, null, /* @__PURE__ */ React.createElement(SettingsModule, { className: "fadeInto", settingId: moduleId })));
}
export {
  Cache as default
};

import { R as React } from "./index-myg4akepfo.js";
import { u as useI18n, k as Tooltip, L as Loader } from "../main-myg4akepfo.js";
function TooltipSortingFiltering({ props }) {
  const { __ } = useI18n();
  const { isFetching, sorting, filters } = props;
  return isFetching && ((sorting == null ? void 0 : sorting.length) || (filters == null ? void 0 : filters.length)) ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, /* @__PURE__ */ React.createElement(Loader, null, __("Filtering & Sorting…"), /* @__PURE__ */ React.createElement("br", null), __("(might take a while)"))) : null;
}
export {
  TooltipSortingFiltering as T
};

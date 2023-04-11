import { u as useI18n, R as React } from "../main-mwi7nr1gli.js";
import { T as Tooltip } from "./useTableUpdater-mwi7nr1gli.js";
function TooltipSortingFiltering({ props }) {
  const { __ } = useI18n();
  const { isFetching, sortingColumn, filters } = props;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, isFetching && sortingColumn ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Sorting…")) : null, isFetching && filters ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Filtering…")) : null);
}
export {
  TooltipSortingFiltering as T
};

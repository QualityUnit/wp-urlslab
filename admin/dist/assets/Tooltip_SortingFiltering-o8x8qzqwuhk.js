<<<<<<<< HEAD:admin/dist/assets/Tooltip_SortingFiltering-m5s9qewrlkk.js
import { u as useI18n, R as React, l as Tooltip, L as Loader } from "../main-m5s9qewrlkk.js";
========
import { u as useI18n, R as React, l as Tooltip, L as Loader } from "../main-o8x8qzqwuhk.js";
>>>>>>>> main:admin/dist/assets/Tooltip_SortingFiltering-o8x8qzqwuhk.js
function TooltipSortingFiltering({ props }) {
  const { __ } = useI18n();
  const { isFetching, sorting, filters } = props;
  return isFetching && ((sorting == null ? void 0 : sorting.length) || filters && Object.keys(filters).length) ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, /* @__PURE__ */ React.createElement(Loader, null, __("Filtering & Sorting…"), /* @__PURE__ */ React.createElement("br", null), __("(might take a while)"))) : null;
}
export {
  TooltipSortingFiltering as T
};

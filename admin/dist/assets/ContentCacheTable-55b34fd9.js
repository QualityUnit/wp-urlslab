import { r as reactExports, R as React, L as Loader } from "../settings.js";
import { u as useTableUpdater, a as useInfiniteFetch, h as handleSelected, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, b as Table } from "./useTableUpdater-eb9e545c.js";
import { C as Checkbox } from "./datepicker-ff7dcd9b.js";
import { M as MenuInput } from "./MenuInput-e2b033a0.js";
import "./useMutation-6f0dd623.js";
import "./InputField-36e1e240.js";
function ContentCacheTable({ slug }) {
  var _a;
  const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn}`, [filters, sortingColumn]);
  const pageId = "cache_crc32";
  const {
    __,
    columnHelper,
    data,
    status,
    isSuccess,
    isFetchingNextPage,
    hasNextPage,
    ref
  } = useInfiniteFetch({ key: slug, url, pageId, currentFilters, sortingColumn });
  const header = {
    date_changed: __("Changed at"),
    cache_len: __("Cache size"),
    cache_content: __("Cache content")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        handleSelected(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("date_changed", {
      cell: (val) => new Date(val == null ? void 0 : val.getValue()).toLocaleString(window.navigator.language),
      header: header.date_changed,
      size: 100
    }),
    columnHelper.accessor("cache_len", {
      cell: (cell) => `${Math.round(cell.getValue() / 1024, 0)} kB`,
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter size in kB", defaultValue: currentFilters.cache_len, onChange: (val) => addFilter("cache_len", val * 1024) }, header.cache_len),
      size: 100
    }),
    columnHelper.accessor("cache_content", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: header.cache_content,
      size: 500
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ data, url, slug, cell, rowSelector: pageId }) }),
      header: null
    })
  ];
  if (status === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      slug,
      currentFilters,
      header,
      noImport: true,
      removeFilters: (key) => removeFilters(key),
      onSort: (val) => sortBy(val),
      exportOptions: {
        url: slug,
        filters,
        fromId: `from_${pageId}`,
        pageId,
        deleteCSVCols: [pageId, "dest_url_id"]
      }
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "fadeInto",
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Content cache entry has been deleted.")) : null,
    /* @__PURE__ */ React.createElement("button", { ref }, isFetchingNextPage ? "Loading more..." : hasNextPage)
  ));
}
export {
  ContentCacheTable as default
};

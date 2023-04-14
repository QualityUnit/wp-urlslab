import { R as React, L as Loader } from "../main-bd7rpqg1ut.js";
import { u as useTableUpdater, a as useInfiniteFetch, T as Tooltip, M as ModuleViewHeaderBottom, c as Table, d as TooltipSortingFiltering, P as ProgressBar } from "./useTableUpdater-bd7rpqg1ut.js";
import "./datepicker-bd7rpqg1ut.js";
import "./useMutation-bd7rpqg1ut.js";
function ContentCacheTable({ slug }) {
  var _a;
  const pageId = "cache_crc32";
  const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater({ slug });
  const url = `${filters || ""}${sortingColumn || ""}`;
  const {
    __,
    columnHelper,
    data,
    status,
    isSuccess,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    ref
  } = useInfiniteFetch({ key: slug, url, pageId });
  const header = {
    date_changed: __("Changed at"),
    cache_len: __("Cache size"),
    cache_content: __("Cache content")
  };
  const columns = [
    columnHelper.accessor("date_changed", {
      cell: (val) => new Date(val == null ? void 0 : val.getValue()).toLocaleString(window.navigator.language),
      header: header.date_changed,
      size: 100
    }),
    columnHelper.accessor("cache_len", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => `${Math.round(cell.getValue() / 1024, 0)} kB`,
      header: header.cache_len,
      size: 100
    }),
    columnHelper.accessor("cache_content", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: header.cache_content,
      size: 500
    })
  ];
  if (status === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      slug,
      header,
      table,
      noDelete: true,
      noExport: true,
      noImport: true,
      onSort: (val) => sortBy(val),
      onFilter: (filter) => setFilters(filter)
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "fadeInto",
      columns,
      slug,
      returnTable: (returnTable) => setTable(returnTable),
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sortingColumn } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  ContentCacheTable as default
};

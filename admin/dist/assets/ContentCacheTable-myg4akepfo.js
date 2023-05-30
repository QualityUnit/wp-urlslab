<<<<<<<< HEAD:admin/dist/assets/ContentCacheTable-txs3jaim6w.js
import { R as React, l as Tooltip, L as Loader } from "../main-txs3jaim6w.js";
import { a as useTableUpdater, b as useInfiniteFetch, e as SortBy, D as DateTimeFormat, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-txs3jaim6w.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-txs3jaim6w.js";
import "./MultiSelectMenu-txs3jaim6w.js";
import "./datepicker-txs3jaim6w.js";
========
import { R as React } from "./index-myg4akepfo.js";
import { a as useTableUpdater, b as useInfiniteFetch, d as SortBy, D as DateTimeFormat, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-myg4akepfo.js";
import { k as Tooltip, L as Loader } from "../main-myg4akepfo.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-myg4akepfo.js";
import "./MultiSelectMenu-myg4akepfo.js";
import "./datepicker-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/ContentCacheTable-myg4akepfo.js
function ContentCacheTable({ slug }) {
  var _a;
  const paginationId = "cache_crc32";
  const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater({ slug });
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
  } = useInfiniteFetch({ key: slug, filters, sorting, paginationId });
  const header = {
    date_changed: __("Last change"),
    cache_len: __("Cache size"),
    cache_content: __("Cache content")
  };
  const columns = [
    columnHelper.accessor("cache_content", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.cache_content),
      size: 300
    }),
    columnHelper.accessor("cache_len", {
      cell: (cell) => `${Math.round(cell.getValue() / 1024, 0)} kB`,
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.cache_len),
      size: 80
    }),
    columnHelper.accessor("date_changed", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.date_changed),
      size: 115
    })
  ];
  if (status === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      table,
      onFilter: (filter) => setFilters(filter),
      options: { header, slug, data, paginationId }
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
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  ContentCacheTable as default
};

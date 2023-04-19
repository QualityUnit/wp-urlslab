import { R as React, L as Loader } from "../main-2tbpj0mn3x.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, c as TooltipSortingFiltering, P as ProgressBar } from "./useTableUpdater-2tbpj0mn3x.js";
import { C as Checkbox, T as Tooltip } from "./Tooltip-2tbpj0mn3x.js";
import "./useMutation-2tbpj0mn3x.js";
function CSSCacheTable({ slug }) {
  var _a;
  const pageId = "url_id";
  const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater({ slug });
  const url = `${"undefined" === typeof filters ? "" : filters}${"undefined" === typeof sortingColumn ? "" : sortingColumn}`;
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
  const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows } = useChangeRow({ data, url, slug, pageId });
  const statusTypes = {
    N: __("New"),
    A: __("Available"),
    P: __("Processing"),
    D: __("Disabled")
  };
  const header = {
    url: __("URL"),
    status: __("Status"),
    status_changed: __("Last change"),
    filesize: __("File size")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("url", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: header.url,
      size: 450
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("status", {
      filterValMenu: statusTypes,
      cell: (cell) => statusTypes[cell.getValue()],
      header: header.status,
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("status_changed", {
      cell: (val) => new Date(val == null ? void 0 : val.getValue()).toLocaleString(window.navigator.language),
      header: header.status_changed,
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filesize", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      unit: "kB",
      cell: (cell) => `${Math.round(cell.getValue() / 1024, 0)} kB`,
      header: header.filesize,
      size: 100
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ cell }) }),
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
      header,
      table,
      noExport: true,
      noImport: true,
      selectedRows,
      onSort: (val) => sortBy(val),
      onDeleteSelected: deleteSelectedRows,
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.url_name} “${row.url_name}”`, " ", __("has been deleted.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sortingColumn } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  CSSCacheTable as default
};

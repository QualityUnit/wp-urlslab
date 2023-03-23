import { r as reactExports, R as React, L as Loader } from "../settings.js";
import { u as useTableUpdater, a as useInfiniteFetch, h as handleSelected, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, b as Table } from "./useTableUpdater-70a88a8a.js";
import { C as Checkbox, S as SortMenu } from "./datepicker-3a15b4e5.js";
import "./useMutation-1e5291cb.js";
function CSSCacheTable({ slug }) {
  var _a;
  const { table, setTable, filters, setFilters, sortingColumn, currentFilters, sortBy, row, deleteRow, updateRow } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn}`, [filters, sortingColumn]);
  const pageId = "url_id";
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
  const statusTypes = {
    N: __("New"),
    A: __("Available"),
    P: __("Processing"),
    D: __("Disabled")
  };
  const header = {
    url: __("URL"),
    status: __("Status"),
    status_changed: __("Status changed"),
    filesize: __("Filesize")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        handleSelected(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("url", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: header.url,
      size: 450
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("status", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        SortMenu,
        {
          items: statusTypes,
          name: cell.column.id,
          checkedId: cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
        }
      ),
      header: header.status,
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("status_changed", {
      cell: (val) => new Date(val == null ? void 0 : val.getValue()).toLocaleString(window.navigator.language),
      header: header.status_changed,
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filesize", {
      cell: (cell) => `${Math.round(cell.getValue() / 1024, 0)} kB`,
      header: header.filesize,
      size: 100
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
      header,
      table,
      noImport: true,
      onSort: (val) => sortBy(val),
      onFilter: (filter) => setFilters(filter),
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
      returnTable: (returnTable) => setTable(returnTable),
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.url_name} “${row.url_name}”`, " ", __("has been deleted.")) : null,
    /* @__PURE__ */ React.createElement("button", { ref }, isFetchingNextPage ? "Loading more..." : hasNextPage)
  ));
}
export {
  CSSCacheTable as default
};

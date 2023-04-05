import { r as reactExports, R as React, L as Loader } from "../main-8snlq7oy5f.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, c as Table, P as ProgressBar } from "./useTableUpdater-8snlq7oy5f.js";
import { C as Checkbox } from "./datepicker-8snlq7oy5f.js";
import "./useMutation-8snlq7oy5f.js";
function NotFoundTable({ slug }) {
  var _a;
  const pageId = "url_id";
  const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn}`, [filters, sortingColumn]);
  const {
    __,
    columnHelper,
    data,
    status,
    isSuccess,
    isFetchingNextPage,
    hasNextPage,
    ref
  } = useInfiniteFetch({ key: slug, url, pageId });
  const { row, selectRow, deleteRow } = useChangeRow({ data, url, slug, pageId });
  const header = {
    url: __("URL"),
    cnt: __("Visits"),
    created: __("First Visit"),
    updated: "Last Visit",
    agent: "User Agent",
    referer: "Referer"
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "nolimit checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("url", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: header.url,
      minSize: 300
    }),
    columnHelper.accessor("cnt", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: header.cnt,
      minSize: 50
    }),
    columnHelper.accessor("created", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: header.created,
      minSize: 100
    }),
    columnHelper.accessor("updated", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: header.updated,
      minSize: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2;
      return (_a2 = JSON.parse(`${cell == null ? void 0 : cell.request_data}`)) == null ? void 0 : _a2.server.agent;
    }, {
      id: "agent",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => cell.getValue(),
      header: header.agent,
      size: 150
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2;
      return (_a2 = JSON.parse(`${cell == null ? void 0 : cell.request_data}`)) == null ? void 0 : _a2.server.referer;
    }, {
      id: "referer",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => cell.getValue(),
      header: header.referer,
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
      onSort: (val) => sortBy(val),
      onFilter: (filter) => setFilters(filter),
      onClearRow: (clear) => clear,
      noImport: true,
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
      slug,
      returnTable: (returnTable) => setTable(returnTable),
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.url} “${row.url}”`, " ", __("has been deleted.")) : null,
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  NotFoundTable as default
};

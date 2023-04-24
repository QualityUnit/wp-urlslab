import { R as React, L as Loader } from "../main-bnkd71mu9.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, c as TooltipSortingFiltering, P as ProgressBar } from "./useTableUpdater-bnkd71mu9.js";
import { D as DateTimeFormat } from "./DateTimeFormat-bnkd71mu9.js";
import { C as Checkbox, T as Tooltip, I as InputField } from "./Tooltip-bnkd71mu9.js";
import "./useMutation-bnkd71mu9.js";
function LinkManagerTable({ slug }) {
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
  const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, pageId });
  const httpStatusTypes = {
    "-2": __("Processing"),
    "-1": __("Waiting"),
    200: __("Valid"),
    400: __("Client Error"),
    404: __("Not Found"),
    500: __("Server Error"),
    503: __("Server Error")
  };
  const relScheduleTypes = {
    N: "New",
    M: "Manual",
    S: "Scheduled",
    E: "Error"
  };
  const header = {
    url_name: __("URL"),
    url_title: __("Title"),
    url_meta_description: __("Description"),
    url_summary: __("Summary"),
    http_status: __("Status"),
    rel_schedule: __("Schedule"),
    update_http_date: __("Last change")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("screenshot_url", {
      className: "thumbnail",
      cell: (image) => (image == null ? void 0 : image.getValue()) ? /* @__PURE__ */ React.createElement("a", { href: image == null ? void 0 : image.getValue(), target: "_blank", rel: "noreferrer" }, /* @__PURE__ */ React.createElement("img", { src: image == null ? void 0 : image.getValue(), alt: image.row.original.url_name })) : /* @__PURE__ */ React.createElement("div", { className: "img" }),
      header: __("Thumbnail"),
      size: 80
    }),
    columnHelper.accessor("url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: header.url_name,
      size: 200
    }),
    columnHelper.accessor("url_title", {
      className: "nolimit",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, { className: "xxl" }, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: header.url_title,
      size: 200
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("url_meta_description", {
      className: "nolimit",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, { className: "xxl" }, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: header.url_meta_description,
      size: 200
    }),
    columnHelper.accessor("url_summary", {
      className: "nolimit",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, { className: "xxl" }, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: header.url_summary,
      size: 150
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("http_status", {
      filterValMenu: httpStatusTypes,
      cell: (cell) => httpStatusTypes[cell.getValue()],
      header: header.http_status,
      size: 80
    }),
    columnHelper.accessor("rel_schedule", {
      filterValMenu: relScheduleTypes,
      cell: (cell) => relScheduleTypes[cell.getValue()],
      header: header.rel_schedule,
      size: 80
    }),
    columnHelper.accessor("update_http_date", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: () => header.update_http_date,
      size: 140
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
      selectedRows,
      onSort: (val) => sortBy(val),
      onDeleteSelected: deleteSelectedRows,
      onFilter: (filter) => setFilters(filter),
      noImport: true,
      exportOptions: {
        url: slug,
        filters,
        fromId: `from_${pageId}`,
        pageId,
        deleteCSVCols: ["urlslab_url_id", "url_id", "urlslab_domain_id"],
        perPage: 1e3
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.url_name} “${row.url_name}”`, " has been deleted.") : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sortingColumn } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  LinkManagerTable as default
};

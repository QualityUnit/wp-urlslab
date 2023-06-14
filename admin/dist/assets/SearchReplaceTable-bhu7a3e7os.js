import { R as React, L as Loader } from "../main-bhu7a3e7os.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-bhu7a3e7os.js";
import { T as TagsMenu } from "./TagsMenu-bhu7a3e7os.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-bhu7a3e7os.js";
import { C as Checkbox } from "./MultiSelectMenu-bhu7a3e7os.js";
import { S as SortMenu, I as InputField } from "./datepicker-bhu7a3e7os.js";
import { S as SvgIconEdit } from "./icon-edit-bhu7a3e7os.js";
import "./transform-bhu7a3e7os.js";
function SearchReplaceTable({ slug }) {
  var _a;
  const paginationId = "id";
  const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater({ slug });
  const url = { filters, sorting };
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
  const { selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const { activatePanel, setRowToEdit } = useTablePanels();
  const rowToEdit = useTablePanels((state) => state.rowToEdit);
  const searchTypes = {
    T: __("Plain text"),
    R: __("Regular expression")
  };
  const header = {
    str_search: __("Search string (old)"),
    str_replace: __("Replace string (new)"),
    search_type: __("Search type"),
    labels: __("Tags"),
    url_filter: "URL filter"
  };
  const rowEditorCells = {
    search_type: /* @__PURE__ */ React.createElement(
      SortMenu,
      {
        defaultAccept: true,
        autoClose: true,
        items: searchTypes,
        name: "search_type",
        defaultValue: "T",
        description: __("Choose how will be matched string in the HTML page. Possible options is exact match and regular expression."),
        onChange: (val) => setRowToEdit({ ...rowToEdit, search_type: val })
      },
      header.search_type
    ),
    str_search: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        type: "url",
        defaultValue: "",
        label: header.str_search,
        description: __("Input string or regular expression to replace in the HTML"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, str_search: val }),
        required: true
      }
    ),
    str_replace: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        type: "url",
        defaultValue: "",
        label: header.str_replace,
        description: __("Value will replace match string"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, str_replace: val }),
        required: true
      }
    ),
    url_filter: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: ".*",
        label: header.url_filter,
        description: __("Regullar expression to match browser URL of page, where should be replacement applied. To replace text in all pages, use value `.*`"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, url_filter: val })
      }
    ),
    labels: /* @__PURE__ */ React.createElement(TagsMenu, { hasActivator: true, label: __("Tags:"), slug, onChange: (val) => setRowToEdit({ ...rowToEdit, labels: val }) })
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "nolimit checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("str_search", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { type: "text", defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.str_search),
      size: 200
    }),
    columnHelper.accessor("str_replace", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { type: "text", defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.str_replace),
      size: 200
    }),
    columnHelper.accessor("search_type", {
      filterValMenu: searchTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: searchTypes, name: cell.column.id, defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.search_type),
      size: 80
    }),
    columnHelper.accessor("url_filter", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { type: "text", defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_filter),
      size: 150
    }),
    columnHelper.accessor("labels", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(TagsMenu, { defaultValue: cell.getValue(), slug, onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.labels,
      size: 160
    }),
    columnHelper.accessor("editRow", {
      className: "editRow",
      cell: (cell) => {
        return /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(
          IconButton,
          {
            onClick: () => {
              updateRow({ cell, id: "str_search" });
              activatePanel("rowEditor");
            },
            tooltipClass: "align-left xxxl",
            tooltip: __("Edit row")
          },
          /* @__PURE__ */ React.createElement(SvgIconEdit, null)
        ), /* @__PURE__ */ React.createElement(
          IconButton,
          {
            className: "ml-s",
            onClick: () => deleteRow({ cell, id: "str_search" }),
            tooltipClass: "align-left xxxl",
            tooltip: __("Delete row")
          },
          /* @__PURE__ */ React.createElement(SvgIconTrash, null)
        ));
      },
      header: () => null,
      size: 60
    })
  ];
  if (status === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      table,
      selectedRows,
      onDeleteSelected: () => deleteSelectedRows({ id: "str_search" }),
      onFilter: (filter) => setFilters(filter),
      options: { header, rowEditorCells, title: "Add New Replacement", data, slug, url, paginationId, rowToEdit, id: "str_search", deleteCSVCols: [paginationId, "dest_url_id"] }
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
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  SearchReplaceTable as default
};

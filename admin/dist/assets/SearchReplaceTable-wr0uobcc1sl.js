import { R as React, L as Loader, i as Tooltip } from "../main-wr0uobcc1sl.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-wr0uobcc1sl.js";
import { T as TagsMenu } from "./TagsMenu-wr0uobcc1sl.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-wr0uobcc1sl.js";
import "./MultiSelectMenu-wr0uobcc1sl.js";
import { I as InputField, S as SortMenu } from "./datepicker-wr0uobcc1sl.js";
import { C as Checkbox } from "./Checkbox-wr0uobcc1sl.js";
import { S as SvgIconEdit } from "./icon-edit-wr0uobcc1sl.js";
import "./transform-wr0uobcc1sl.js";
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
  const { row, selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, setActivePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
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
    str_search: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "url", defaultValue: "", label: header.str_search, onChange: (val) => setEditorRow({ ...rowToEdit, str_search: val }), required: true }),
    str_replace: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "url", defaultValue: "", label: header.str_replace, onChange: (val) => setEditorRow({ ...rowToEdit, str_replace: val }), required: true }),
    search_type: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: searchTypes, name: "search_type", defaultValue: "T", onChange: (val) => setEditorRow({ ...rowToEdit, search_type: val }) }, header.search_type),
    url_filter: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.url_filter, onChange: (val) => setEditorRow({ ...rowToEdit, url_filter: val }) })
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
              setActivePanel("rowEditor");
              updateRow({ cell });
            },
            tooltipClass: "align-left xxxl",
            tooltip: __("Edit row")
          },
          /* @__PURE__ */ React.createElement(SvgIconEdit, null)
        ), /* @__PURE__ */ React.createElement(
          IconButton,
          {
            className: "ml-s",
            onClick: () => deleteRow({ cell }),
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
      slug,
      header,
      table,
      selectedRows,
      onDeleteSelected: deleteSelectedRows,
      onFilter: (filter) => setFilters(filter),
      onUpdateRow: (val) => {
        setActivePanel();
        setEditorRow();
        if (val === "rowInserted" || val === "rowChanged") {
          setActivePanel();
          setEditorRow(val);
          setTimeout(() => {
            setEditorRow();
          }, 3e3);
        }
      },
      activatePanel: activePanel,
      rowEditorOptions: { rowEditorCells, title: "Add New Replacement", data, slug, url, paginationId, rowToEdit },
      exportOptions: {
        slug,
        url,
        paginationId,
        deleteCSVCols: [paginationId, "dest_url_id"]
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.str_search} “${row.str_search}”`, " ", __("has been deleted.")) : null,
    rowToEdit === "rowChanged" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Search & Replace rule has been changed.")) : null,
    rowToEdit === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Search & Replace rule has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  SearchReplaceTable as default
};

import { R as React, L as Loader, i as Tooltip } from "../main-wr0uobcc1sl.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-wr0uobcc1sl.js";
import { T as TagsMenu } from "./TagsMenu-wr0uobcc1sl.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-wr0uobcc1sl.js";
import "./MultiSelectMenu-wr0uobcc1sl.js";
import { S as SortMenu, I as InputField } from "./datepicker-wr0uobcc1sl.js";
import { C as Checkbox } from "./Checkbox-wr0uobcc1sl.js";
import { S as SvgIconEdit } from "./icon-edit-wr0uobcc1sl.js";
function CacheRulesTable({ slug }) {
  var _a;
  const paginationId = "rule_id";
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
  const matchTypes = Object.freeze({
    A: "All Pages",
    E: "Exact match",
    S: "Contains",
    R: "Regexp"
  });
  const header = Object.freeze({
    match_type: __("Match type"),
    match_url: __("URL"),
    is_active: __("Is active"),
    labels: __("Tags"),
    browser: __("Browser"),
    cookie: __("Cookies"),
    headers: __("Request headers"),
    params: __("Request parameters"),
    ip: __("Visitor IP"),
    valid_from: __("Cache Valid From"),
    rule_order: __("Order"),
    cache_ttl: __("Cache Validity")
  });
  const rowEditorCells = {
    match_type: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: matchTypes, name: "match_type", defaultValue: "A", onChange: (val) => setEditorRow({ ...rowToEdit, match_type: val }) }, header.match_type),
    match_url: /* @__PURE__ */ React.createElement(InputField, { type: "url", liveUpdate: true, defaultValue: "", label: header.match_url, onChange: (val) => setEditorRow({ ...rowToEdit, match_url: val }), required: true }),
    cache_ttl: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "3600", label: header.cache_ttl, onChange: (val) => setEditorRow({ ...rowToEdit, cache_ttl: val }) }),
    headers: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, label: header.headers, defaultValue: "", onChange: (val) => setEditorRow({ ...rowToEdit, headers: val }) }),
    cookie: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, label: header.cookie, defaultValue: "", onChange: (val) => setEditorRow({ ...rowToEdit, cookie: val }) }),
    params: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, label: header.params, defaultValue: "", onChange: (val) => setEditorRow({ ...rowToEdit, params: val }) }),
    ip: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, label: header.ip, defaultValue: "", onChange: (val) => setEditorRow({ ...rowToEdit, ip: val }) }),
    browser: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, label: header.browser, defaultValue: "", onChange: (val) => setEditorRow({ ...rowToEdit, browser: val }) }),
    rule_order: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "10", label: header.rule_order, onChange: (val) => setEditorRow({ ...rowToEdit, rule_order: val }) }),
    is_active: /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: true, onChange: (val) => setEditorRow({ ...rowToEdit, is_active: val }) }, header.is_active)
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("match_type", {
      filterValMenu: matchTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: matchTypes, name: cell.column.id, defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.match_type),
      size: 80
    }),
    columnHelper.accessor("match_url", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.match_url),
      size: 200
    }),
    columnHelper.accessor("is_active", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.is_active),
      size: 100
    }),
    columnHelper.accessor("ip", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.ip),
      size: 100,
      show: false
    }),
    columnHelper.accessor("browser", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.browser),
      size: 100,
      show: false
    }),
    columnHelper.accessor("cookie", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.cookie),
      size: 100
    }),
    columnHelper.accessor("headers", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.headers),
      size: 100
    }),
    columnHelper.accessor("params", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.params),
      size: 100
    }),
    columnHelper.accessor("rule_order", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.rule_order),
      size: 30
    }),
    columnHelper.accessor("cache_ttl", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.cache_ttl),
      size: 30
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
      rowEditorOptions: { rowEditorCells, title: "Add New Cache Rule", data, slug, url, paginationId, rowToEdit },
      exportOptions: {
        slug,
        url,
        paginationId,
        deleteCSVCols: [paginationId]
      }
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "fadeInto",
      slug,
      returnTable: (returnTable) => setTable(returnTable),
      initialState: { columnVisibility: { headers: false, params: false, ip: false, browser: false, cookie: false } },
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.str_search} “${row.str_search}”`, " ", __("has been deleted.")) : null,
    rowToEdit === "rowChanged" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Rule has been changed.")) : null,
    rowToEdit === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Rule has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  CacheRulesTable as default
};

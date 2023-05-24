import { R as React, L as Loader, i as Tooltip } from "../main-yqr1c0iv4jl.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-yqr1c0iv4jl.js";
import { T as TagsMenu } from "./TagsMenu-yqr1c0iv4jl.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-yqr1c0iv4jl.js";
import "./MultiSelectMenu-yqr1c0iv4jl.js";
import { I as InputField, S as SortMenu } from "./datepicker-yqr1c0iv4jl.js";
import { C as Checkbox } from "./Checkbox-yqr1c0iv4jl.js";
import { T as TextArea } from "./Textarea-yqr1c0iv4jl.js";
import { S as SvgIconEdit } from "./icon-edit-yqr1c0iv4jl.js";
import "./transform-yqr1c0iv4jl.js";
function CustomHtmlTable({ slug }) {
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
    E: "Exact match",
    S: "Contains",
    R: "Regexp"
  });
  const logginTypes = Object.freeze({
    Y: "Logged in",
    N: "Not logged",
    A: "Any"
  });
  const header = {
    name: __("Rule Name"),
    labels: __("Tags"),
    match_type: __("Match type"),
    match_url: __("Match URL"),
    is_logged: __("Is logged?"),
    match_browser: __("Match Browser"),
    match_cookie: __("Match Cookies"),
    match_headers: __("Match Request headers"),
    match_params: __("Match Request parameters"),
    match_capabilities: __("User has capability"),
    match_roles: __("User has role"),
    match_ip: __("Match Visitor IP"),
    add_http_headers: __("Add HTTP Request headers"),
    add_start_headers: __("Add after <head> tag"),
    add_end_headers: __("Add before </head> tag"),
    add_start_body: __("Add after <body> tag"),
    add_end_body: __("Add before </body> tag"),
    rule_order: __("Rule Order"),
    is_active: __("Active Rule")
  };
  const rowEditorCells = {
    name: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "text", defaultValue: "", label: header.name, onChange: (val) => setEditorRow({ ...rowToEdit, name: val }), required: true }),
    match_type: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: matchTypes, name: "match_type", defaultValue: "E", onChange: (val) => setEditorRow({ ...rowToEdit, match_type: val }) }, header.match_type),
    match_url: /* @__PURE__ */ React.createElement(InputField, { type: "url", autoFocus: true, liveUpdate: true, defaultValue: "", label: header.match_url, onChange: (val) => setEditorRow({ ...rowToEdit, match_url: val }), required: true }),
    match_headers: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.match_headers, onChange: (val) => setEditorRow({ ...rowToEdit, match_headers: val }) }),
    match_cookie: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.match_cookie, onChange: (val) => setEditorRow({ ...rowToEdit, match_cookie: val }) }),
    match_params: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.match_params, onChange: (val) => setEditorRow({ ...rowToEdit, match_params: val }) }),
    match_capabilities: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.match_capabilities, onChange: (val) => setEditorRow({ ...rowToEdit, match_capabilities: val }) }),
    match_ip: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.match_ip, onChange: (val) => setEditorRow({ ...rowToEdit, match_ip: val }) }),
    match_roles: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.match_roles, onChange: (val) => setEditorRow({ ...rowToEdit, match_roles: val }) }),
    match_browser: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.match_browser, onChange: (val) => setEditorRow({ ...rowToEdit, match_browser: val }) }),
    is_logged: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: logginTypes, name: "is_logged", defaultValue: "A", onChange: (val) => setEditorRow({ ...rowToEdit, is_logged: val }) }, header.is_logged),
    add_http_headers: /* @__PURE__ */ React.createElement(TextArea, { rows: "5", liveUpdate: true, defaultValue: "", label: header.add_http_headers, onChange: (val) => setEditorRow({ ...rowToEdit, add_http_headers: val }), required: true }),
    add_start_headers: /* @__PURE__ */ React.createElement(TextArea, { rows: "5", liveUpdate: true, defaultValue: "", label: header.add_start_headers, onChange: (val) => setEditorRow({ ...rowToEdit, add_start_headers: val }), required: true }),
    add_end_headers: /* @__PURE__ */ React.createElement(TextArea, { rows: "5", liveUpdate: true, defaultValue: "", label: header.add_end_headers, onChange: (val) => setEditorRow({ ...rowToEdit, add_end_headers: val }), required: true }),
    add_start_body: /* @__PURE__ */ React.createElement(TextArea, { rows: "5", liveUpdate: true, defaultValue: "", label: header.add_start_body, onChange: (val) => setEditorRow({ ...rowToEdit, add_start_body: val }), required: true }),
    add_end_body: /* @__PURE__ */ React.createElement(TextArea, { rows: "5", liveUpdate: true, defaultValue: "", label: header.add_end_body, onChange: (val) => setEditorRow({ ...rowToEdit, add_end_body: val }), required: true }),
    rule_order: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "text", defaultValue: "", label: header.rule_order, onChange: (val) => setEditorRow({ ...rowToEdit, rule_order: val }), required: true }),
    is_active: /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: true, onChange: (val) => setEditorRow({ ...rowToEdit, is_active: val }) }, header.is_active)
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "nolimit checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("name", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { type: "text", defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.name),
      size: 200
    }),
    columnHelper.accessor("labels", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(TagsMenu, { defaultValue: cell.getValue(), slug, onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.labels,
      size: 160
    }),
    columnHelper.accessor("is_active", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.is_active),
      size: 100
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.name} “${row.name}”`, " ", __("has been deleted.")) : null,
    rowToEdit === "rowChanged" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Rule has been changed.")) : null,
    rowToEdit === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Rule has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  CustomHtmlTable as default
};

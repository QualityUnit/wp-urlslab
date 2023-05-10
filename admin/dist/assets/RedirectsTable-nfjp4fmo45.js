import { R as React, L as Loader, T as Tooltip } from "../main-nfjp4fmo45.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./useTableUpdater-nfjp4fmo45.js";
import { S as SortBy, I as IconButton } from "./_ColumnsMenu-nfjp4fmo45.js";
import { T as TagsMenu } from "./TagsMenu-nfjp4fmo45.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-nfjp4fmo45.js";
/* empty css                       */import { S as SortMenu, I as InputField, C as Checkbox } from "./InputField-nfjp4fmo45.js";
import { S as SvgIconEdit } from "./icon-edit-nfjp4fmo45.js";
import { u as useRedirectTableMenus } from "./useRedirectTableMenus-nfjp4fmo45.js";
import "./useMutation-nfjp4fmo45.js";
function RedirectsTable({ slug }) {
  var _a;
  const paginationId = "redirect_id";
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
  const { row, selectedRows, selectRow, rowToEdit, setEditorRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const { redirectTypes, matchTypes, logginTypes, notFoundTypes, header } = useRedirectTableMenus();
  const rowEditorCells = {
    match_type: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: matchTypes, name: "match_type", defaultValue: "E", onChange: (val) => setEditorRow({ ...rowToEdit, match_type: val }) }, header.match_type),
    match_url: /* @__PURE__ */ React.createElement(InputField, { type: "url", liveUpdate: true, defaultValue: "", label: header.match_url, onChange: (val) => setEditorRow({ ...rowToEdit, match_url: val }), required: true }),
    replace_url: /* @__PURE__ */ React.createElement(InputField, { type: "url", liveUpdate: true, defaultValue: "", label: header.replace_url, onChange: (val) => setEditorRow({ ...rowToEdit, replace_url: val }), required: true }),
    redirect_code: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: redirectTypes, name: "redirect_code", defaultValue: "301", onChange: (val) => setEditorRow({ ...rowToEdit, redirect_code: val }) }, header.redirect_code),
    is_logged: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: logginTypes, name: "is_logged", defaultValue: "A", onChange: (val) => setEditorRow({ ...rowToEdit, is_logged: val }) }, header.is_logged),
    headers: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.headers, onChange: (val) => setEditorRow({ ...rowToEdit, headers: val }) }),
    cookie: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.cookie, onChange: (val) => setEditorRow({ ...rowToEdit, cookie: val }) }),
    params: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.params, onChange: (val) => setEditorRow({ ...rowToEdit, capabilities: val }) }),
    capabilities: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.capabilities, onChange: (val) => setEditorRow({ ...rowToEdit, capabilities: val }) }),
    ip: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.ip, onChange: (val) => setEditorRow({ ...rowToEdit, ip: val }) }),
    roles: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.roles, onChange: (val) => setEditorRow({ ...rowToEdit, roles: val }) }),
    browser: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.browser, onChange: (val) => setEditorRow({ ...rowToEdit, browser: val }) }),
    if_not_found: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: notFoundTypes, name: "if_not_found", defaultValue: "A", onChange: (val) => setEditorRow({ ...rowToEdit, if_not_found: val }) }, header.if_not_found)
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
    columnHelper.accessor("replace_url", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.replace_url),
      size: 100
    }),
    columnHelper.accessor("redirect_code", {
      filterValMenu: redirectTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: redirectTypes, name: cell.column.id, defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.redirect_code),
      size: 100
    }),
    columnHelper.accessor("if_not_found", {
      filterValMenu: notFoundTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: notFoundTypes, name: cell.column.id, defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.if_not_found),
      size: 100
    }),
    columnHelper.accessor("is_logged", {
      filterValMenu: logginTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: logginTypes, name: cell.column.id, defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.is_logged),
      size: 100
    }),
    columnHelper.accessor("labels", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(TagsMenu, { defaultValue: cell.getValue(), slug, onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.labels,
      size: 160
    }),
    columnHelper.accessor("capabilities", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.capabilities),
      size: 100,
      show: false
    }),
    columnHelper.accessor("ip", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.ip),
      size: 100,
      show: false
    }),
    columnHelper.accessor("roles", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.roles),
      size: 100
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
    columnHelper.accessor("cnt", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.cnt),
      size: 100
    }),
    columnHelper.accessor("editRow", {
      className: "editRow",
      cell: (cell) => {
        return /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(
          IconButton,
          {
            onClick: () => updateRow({ cell }),
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
        setEditorRow();
        if (val === "rowInserted") {
          setEditorRow(val);
          setTimeout(() => {
            setEditorRow();
          }, 3e3);
        }
      },
      rowEditorOptions: { rowEditorCells, title: "Add redirect", data, slug, url, paginationId, rowToEdit },
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
      initialState: { columnVisibility: { roles: false, headers: false, params: false, capabilities: false, ip: false, if_not_found: false, browser: false, cookie: false } },
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.str_search} “${row.str_search}”`, " ", __("has been deleted.")) : null,
    rowToEdit === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Redirect rule has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  RedirectsTable as default
};

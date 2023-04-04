import { r as reactExports, R as React, L as Loader } from "../main-bab6lcbjwb.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, S as SvgIconTrash, M as ModuleViewHeaderBottom, c as Table, T as Tooltip } from "./useTableUpdater-bab6lcbjwb.js";
import { C as Checkbox, S as SortMenu, I as InputField } from "./datepicker-bab6lcbjwb.js";
import "./useMutation-bab6lcbjwb.js";
function RedirectsTable({ slug }) {
  var _a;
  const pageId = "redirect_id";
  const { table, setTable, rowToInsert, setInsertRow, filters, setFilters, sortingColumn, sortBy } = useTableUpdater({ slug });
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
  const { row, rowsSelected, selectRow, deleteRow, updateRow } = useChangeRow({ data, url, slug, pageId });
  const redirectTypes = {
    301: "Moved Permanently (301)",
    302: "Found – Moved temporarily (302)",
    307: "Temporarily Redirect (307)",
    308: "Permanent Redirect, Pass Page Authority (308)"
  };
  const matchTypes = {
    E: "Exact match",
    S: "Contains substring",
    R: "Regexp"
  };
  const logginTypes = {
    Y: "Logged in",
    N: "Not logged",
    A: "Any"
  };
  const notFoundTypes = {
    Y: "Only if not found",
    N: "Matches if page found",
    A: "All"
  };
  const header = {
    match_type: __("Match type"),
    match_url: __("URL"),
    replace_url: __("Redirect to URL"),
    redirect_code: __("HTTP Code"),
    is_logged: __("Is Logged in"),
    capabilities: __("Capabilities"),
    roles: __("Roles"),
    browser: __("Browser"),
    cookie: __("Cookies"),
    headers: __("Request headers"),
    params: __("Request parameters"),
    if_not_found: __("Execute if 404"),
    cnt: __("Redirects Count")
  };
  const inserterCells = {
    match_type: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: matchTypes, name: "match_type", checkedId: "E", onChange: (val) => setInsertRow({ ...rowToInsert, match_type: val }), required: true }, header.match_type),
    match_url: /* @__PURE__ */ React.createElement(InputField, { type: "url", liveUpdate: true, defaultValue: "", label: header.match_url, onChange: (val) => setInsertRow({ ...rowToInsert, match_url: val }), required: true }),
    replace_url: /* @__PURE__ */ React.createElement(InputField, { type: "url", liveUpdate: true, defaultValue: "", label: header.replace_url, onChange: (val) => setInsertRow({ ...rowToInsert, replace_url: val }), required: true }),
    redirect_code: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: redirectTypes, name: "redirect_code", checkedId: "301", onChange: (val) => setInsertRow({ ...rowToInsert, redirect_code: val }), required: true }, header.redirect_code),
    is_logged: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: logginTypes, name: "is_logged", checkedId: "A", onChange: (val) => setInsertRow({ ...rowToInsert, is_logged: val }), required: true }, header.is_logged),
    headers: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.headers, onChange: (val) => setInsertRow({ ...rowToInsert, headers: val }) }),
    cookie: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.cookie, onChange: (val) => setInsertRow({ ...rowToInsert, cookie: val }) }),
    params: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.params, onChange: (val) => setInsertRow({ ...rowToInsert, capabilities: val }) }),
    capabilities: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.capabilities, onChange: (val) => setInsertRow({ ...rowToInsert, capabilities: val }) }),
    roles: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.roles, onChange: (val) => setInsertRow({ ...rowToInsert, roles: val }) }),
    browser: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.browser, onChange: (val) => setInsertRow({ ...rowToInsert, browser: val }) }),
    if_not_found: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: notFoundTypes, name: "if_not_found", checkedId: "A", onChange: (val) => setInsertRow({ ...rowToInsert, if_not_found: val }), required: true }, header.if_not_found)
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
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: matchTypes, name: cell.column.id, checkedId: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.match_type,
      size: 80
    }),
    columnHelper.accessor("match_url", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.match_url,
      size: 200
    }),
    columnHelper.accessor("replace_url", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.replace_url,
      size: 100
    }),
    columnHelper.accessor("redirect_code", {
      filterValMenu: redirectTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: redirectTypes, name: cell.column.id, checkedId: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.redirect_code,
      size: 100
    }),
    columnHelper.accessor("if_not_found", {
      filterValMenu: notFoundTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: notFoundTypes, name: cell.column.id, checkedId: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.if_not_found,
      size: 100
    }),
    columnHelper.accessor("is_logged", {
      filterValMenu: logginTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: logginTypes, name: cell.column.id, checkedId: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.is_logged,
      size: 100
    }),
    columnHelper.accessor("capabilities", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.capabilities,
      size: 100,
      show: false
    }),
    columnHelper.accessor("roles", {
      header: header.roles,
      size: 100
    }),
    columnHelper.accessor("browser", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.browser,
      size: 100,
      show: false
    }),
    columnHelper.accessor("cookie", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.cookie,
      size: 100
    }),
    columnHelper.accessor("headers", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.headers,
      size: 100
    }),
    columnHelper.accessor("params", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.params,
      size: 100
    }),
    columnHelper.accessor("cnt", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.cnt,
      size: 100
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ cell }) }),
      header: () => null
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
      insertOptions: { inserterCells, title: "Add redirect", data, slug, url, pageId, rowToInsert },
      exportOptions: {
        url: slug,
        filters,
        fromId: `from_${pageId}`,
        pageId,
        deleteCSVCols: [pageId]
      }
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "fadeInto",
      slug,
      returnTable: (returnTable) => setTable(returnTable),
      initialState: { columnVisibility: { is_logged: false, header: false, params: false, capabilities: false, if_not_found: false, browser: false, cookie: false } },
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.str_search} “${row.str_search}”`, " ", __("has been deleted.")) : null,
    /* @__PURE__ */ React.createElement("button", { ref }, isFetchingNextPage ? "Loading more..." : hasNextPage)
  ));
}
export {
  RedirectsTable as default
};

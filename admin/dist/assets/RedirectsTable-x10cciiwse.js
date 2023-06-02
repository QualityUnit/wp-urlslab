import { R as React, L as Loader } from "../main-x10cciiwse.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-x10cciiwse.js";
import { T as TagsMenu } from "./TagsMenu-x10cciiwse.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-x10cciiwse.js";
import { C as Checkbox } from "./MultiSelectMenu-x10cciiwse.js";
import { S as SortMenu, I as InputField } from "./datepicker-x10cciiwse.js";
import { S as SuggestInputField } from "./SuggestInputField-x10cciiwse.js";
import { S as SvgIconEdit } from "./icon-edit-x10cciiwse.js";
import { u as useRedirectTableMenus } from "./useRedirectTableMenus-x10cciiwse.js";
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
  const { selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const { activatePanel, setRowToEdit } = useTablePanels();
  const rowToEdit = useTablePanels((state) => state.rowToEdit);
  const { redirectTypes, matchTypes, logginTypes, notFoundTypes, header } = useRedirectTableMenus();
  const rowEditorCells = {
    match_type: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: matchTypes, name: "match_type", defaultValue: "E", onChange: (val) => setRowToEdit({ ...rowToEdit, match_type: val }) }, header.match_type),
    match_url: /* @__PURE__ */ React.createElement(
      InputField,
      {
        type: "url",
        autoFocus: true,
        liveUpdate: true,
        defaultValue: "",
        label: header.match_url,
        description: __("Match browser URL with this value based on the selected type of rule"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_url: val }),
        required: true
      }
    ),
    replace_url: /* @__PURE__ */ React.createElement(
      SuggestInputField,
      {
        suggestInput: (rowToEdit == null ? void 0 : rowToEdit.match_url) || "",
        liveUpdate: true,
        defaultValue: window.location.origin,
        description: __("Redirect user to this URL if browser URL matched and also match all other conditions"),
        label: header.replace_url,
        onChange: (val) => setRowToEdit({ ...rowToEdit, replace_url: val }),
        required: true
      }
    ),
    redirect_code: /* @__PURE__ */ React.createElement(
      SortMenu,
      {
        autoClose: true,
        items: redirectTypes,
        name: "redirect_code",
        defaultValue: "301",
        description: __("HTTP Status code to use when redirecting visitor"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, redirect_code: val })
      },
      header.redirect_code
    ),
    is_logged: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: logginTypes, name: "is_logged", defaultValue: "A", onChange: (val) => setRowToEdit({ ...rowToEdit, is_logged: val }) }, header.is_logged),
    headers: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.headers,
        description: __("Redirect only requests with specific HTTP header sent from browser. Comma separated list of headers to check. (Example 1: check if any header exists: MY-HEADER-NAME1, HEADER2), (Example 2: check if header has specific value: MY-HEADER-NAME1=value1, HEADER2=value2)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, headers: val })
      }
    ),
    cookie: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.cookie,
        description: __("Redirect only requests with specific Cookie sent from browser. Comma separated list of cookies to check. (Example 1: check if any cookie exists: COOKIE_NAME_1, COOKIE_NAME_2), (Example 2: check if cookie has specific value: COOKIE-NAME=value)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, cookie: val })
      }
    ),
    params: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.params,
        description: __("Redirect only requests with specific GET or POST parameter. Comma separated list of parameters to check. (Example 1: check if any parameter exists: query_param1, post_param_name2), (Example 2: check if request parameter has specific value: param1=value)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, params: val })
      }
    ),
    capabilities: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.capabilities,
        description: __("Redirect only requests of users with specific capabilities. Match on of the capabilities from comma separated list."),
        onChange: (val) => setRowToEdit({ ...rowToEdit, capabilities: val })
      }
    ),
    ip: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.ip,
        description: __("Redirect just visitors from specific IP address or subnet. Comma separated list of IP addresses or subnets. (e.g., 172.120.0.*, 192.168.0.0/24)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, ip: val })
      }
    ),
    roles: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.roles,
        description: __("Redirect only requests of users with specific role. Match on of the roles from comma separated list."),
        onChange: (val) => setRowToEdit({ ...rowToEdit, roles: val })
      }
    ),
    browser: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.browser,
        description: __("Redirect just visitors with specific browser. Comma separated list of browser names or any string from User-Agent. (e.g. Chrome, Safari)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, browser: val })
      }
    ),
    if_not_found: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: notFoundTypes, name: "if_not_found", defaultValue: "A", onChange: (val) => setRowToEdit({ ...rowToEdit, if_not_found: val }) }, header.if_not_found),
    labels: /* @__PURE__ */ React.createElement(TagsMenu, { hasActivator: true, label: __("Tags:"), slug, onChange: (val) => setRowToEdit({ ...rowToEdit, labels: val }) })
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
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
      size: 200
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
              updateRow({ cell, id: "match_url" });
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
            onClick: () => deleteRow({ cell, id: "match_url" }),
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
      onDeleteSelected: () => deleteSelectedRows({ id: "match_url" }),
      onFilter: (filter) => setFilters(filter),
      options: {
        header,
        rowEditorCells,
        title: "Add New Redirect",
        data,
        slug,
        url,
        paginationId,
        rowToEdit,
        id: "match_url",
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
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  RedirectsTable as default
};

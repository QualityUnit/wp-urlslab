import { R as React, L as Loader } from "../main-a2rky156fof.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-a2rky156fof.js";
import { T as TagsMenu } from "./TagsMenu-a2rky156fof.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-a2rky156fof.js";
import { C as Checkbox } from "./MultiSelectMenu-a2rky156fof.js";
import { I as InputField, S as SortMenu } from "./datepicker-a2rky156fof.js";
import { T as TextArea } from "./Textarea-a2rky156fof.js";
import { S as SvgIconEdit } from "./icon-edit-a2rky156fof.js";
import "./transform-a2rky156fof.js";
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
  const { selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const { activatePanel, setRowToEdit } = useTablePanels();
  const rowToEdit = useTablePanels((state) => state.rowToEdit);
  const matchTypes = Object.freeze({
    A: "All pages",
    E: "Exact match",
    S: "Contains",
    R: "Regexp"
  });
  const logginTypes = Object.freeze({
    Y: "Only logged in users",
    N: "Only not logged visitors",
    A: "All users and visitors"
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
    name: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "text", defaultValue: "", label: header.name, onChange: (val) => setRowToEdit({ ...rowToEdit, name: val }) }),
    match_type: /* @__PURE__ */ React.createElement(
      SortMenu,
      {
        defaultAccept: true,
        autoClose: true,
        items: matchTypes,
        name: "match_type",
        defaultValue: "E",
        description: __("Select when should be applied the rule"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_type: val })
      },
      header.match_type
    ),
    match_url: /* @__PURE__ */ React.createElement(
      InputField,
      {
        type: "url",
        autoFocus: true,
        liveUpdate: true,
        defaultValue: "",
        label: header.match_url,
        hidden: (rowToEdit == null ? void 0 : rowToEdit.match_type) === "A",
        description: __("Match browser URL with this value based on the selected type of rule"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_url: val })
      }
    ),
    match_headers: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.match_headers,
        description: __("If you need to inject custom HTML to page if request contains specific HTTP header sent from browser. Comma separated list of headers to check. (Example 1: check if any header exists: MY-HEADER-NAME1, HEADER2), (Example 2: check if header has specific value: MY-HEADER-NAME1=value1, HEADER2=value2)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_headers: val })
      }
    ),
    match_cookie: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.match_cookie,
        description: __("If you need to inject custom HTML to page for requests with specific Cookie sent from browser. Comma separated list of cookies to check. (Example 1: check if any cookie exists: COOKIE_NAME_1, COOKIE_NAME_2), (Example 2: check if cookie has specific value: COOKIE-NAME=value)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_cookie: val })
      }
    ),
    match_params: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.match_params,
        description: __("If you need to inject custom HTML to page just if request has specific GET or POST parameter. Comma separated list of parameters to check. (Example 1: check if any parameter exists: query_param1, post_param_name2), (Example 2: check if request parameter has specific value: param1=value)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_params: val })
      }
    ),
    match_capabilities: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.match_capabilities,
        description: __("If you need to inject custom HTML to page for user with special WordPress capability. Comma separated list of capabilities."),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_capabilities: val })
      }
    ),
    match_ip: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.match_ip,
        description: __("Inject Custom HTML just for users from specific IP address or subnet. Comma separated list of IP addresses or subnets. (e.g., 172.120.0.*, 192.168.0.0/24)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_ip: val })
      }
    ),
    match_roles: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.match_roles,
        description: __("If you need to inject custom HTML to page just for user with special WordPress role. Comma separated list of roles."),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_roles: val })
      }
    ),
    match_browser: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "",
        label: header.match_browser,
        description: __("If you need to inject custom HTML to page just for specific browser names. Comma separated list of browser names or any string from User-Agent. (e.g. Chrome, Safari)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_browser: val })
      }
    ),
    is_logged: /* @__PURE__ */ React.createElement(
      SortMenu,
      {
        autoClose: true,
        items: logginTypes,
        name: "is_logged",
        defaultValue: "A",
        description: __("Apply rule just for users with selected login status."),
        onChange: (val) => setRowToEdit({ ...rowToEdit, is_logged: val })
      },
      header.is_logged
    ),
    add_http_headers: /* @__PURE__ */ React.createElement(
      TextArea,
      {
        rows: "5",
        liveUpdate: true,
        defaultValue: "",
        label: header.add_http_headers,
        description: __("Add custom HTTP headers sent from server to browser. Separate headers by new lines, header name and value by `=`. (e.g. X-URLSLAB-HEADER=value)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, add_http_headers: val })
      }
    ),
    add_start_headers: /* @__PURE__ */ React.createElement(
      TextArea,
      {
        rows: "5",
        liveUpdate: true,
        defaultValue: "",
        label: header.add_start_headers,
        description: __("Value will be inserted right after <head> tag."),
        onChange: (val) => setRowToEdit({ ...rowToEdit, add_start_headers: val })
      }
    ),
    add_end_headers: /* @__PURE__ */ React.createElement(
      TextArea,
      {
        rows: "5",
        liveUpdate: true,
        defaultValue: "",
        label: header.add_end_headers,
        description: __("Value will be inserted right before </head> tag."),
        onChange: (val) => setRowToEdit({ ...rowToEdit, add_end_headers: val })
      }
    ),
    add_start_body: /* @__PURE__ */ React.createElement(
      TextArea,
      {
        rows: "5",
        liveUpdate: true,
        defaultValue: "",
        label: header.add_start_body,
        description: __("Value will be inserted right after <body> tag (beginning of html page)."),
        onChange: (val) => setRowToEdit({ ...rowToEdit, add_start_body: val })
      }
    ),
    add_end_body: /* @__PURE__ */ React.createElement(
      TextArea,
      {
        rows: "5",
        liveUpdate: true,
        defaultValue: "",
        label: header.add_end_body,
        description: __("Value will be inserted right before </body> tag (end of html page)."),
        onChange: (val) => setRowToEdit({ ...rowToEdit, add_end_body: val })
      }
    ),
    rule_order: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "text", defaultValue: "10", label: header.rule_order, onChange: (val) => setRowToEdit({ ...rowToEdit, rule_order: val }) }),
    is_active: /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: true, onChange: (val) => setRowToEdit({ ...rowToEdit, is_active: val }) }, header.is_active),
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
              updateRow({ cell, id: "name" });
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
            onClick: () => deleteRow({ cell, id: "name" }),
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
      onDeleteSelected: deleteSelectedRows,
      onFilter: (filter) => setFilters(filter),
      options: { header, rowEditorCells, rowToEdit, data, slug, url, paginationId, title: __("Add Custom HTML"), id: "name", deleteCSVCols: [paginationId, "dest_url_id"] }
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
  CustomHtmlTable as default
};

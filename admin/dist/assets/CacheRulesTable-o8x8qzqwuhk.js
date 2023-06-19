<<<<<<< HEAD:admin/dist/assets/CacheRulesTable-vqw3w5p1iw.js
<<<<<<< HEAD:admin/dist/assets/CacheRulesTable-vqw3w5p1iw.js
import { R as React, L as Loader } from "../main-vqw3w5p1iw.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-vqw3w5p1iw.js";
import { T as TagsMenu } from "./TagsMenu-vqw3w5p1iw.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-vqw3w5p1iw.js";
import { C as Checkbox } from "./MultiSelectMenu-vqw3w5p1iw.js";
import { S as SortMenu, I as InputField } from "./datepicker-vqw3w5p1iw.js";
import { S as SvgIconEdit } from "./icon-edit-vqw3w5p1iw.js";
=======
<<<<<<<< HEAD:admin/dist/assets/CacheRulesTable-txs3jaim6w.js
import { R as React, L as Loader } from "../main-txs3jaim6w.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-txs3jaim6w.js";
import { T as TagsMenu } from "./TagsMenu-txs3jaim6w.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-txs3jaim6w.js";
import { C as Checkbox } from "./MultiSelectMenu-txs3jaim6w.js";
import { S as SortMenu, I as InputField } from "./datepicker-txs3jaim6w.js";
import { S as SvgIconEdit } from "./icon-edit-txs3jaim6w.js";
========
import { R as React } from "./index-myg4akepfo.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-myg4akepfo.js";
import { L as Loader } from "../main-myg4akepfo.js";
import { T as TagsMenu } from "./TagsMenu-myg4akepfo.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-myg4akepfo.js";
import { C as Checkbox } from "./MultiSelectMenu-myg4akepfo.js";
import { S as SortMenu, I as InputField } from "./datepicker-myg4akepfo.js";
import { S as SvgIconEdit } from "./icon-edit-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/CacheRulesTable-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/CacheRulesTable-txs3jaim6w.js
=======
import { R as React, L as Loader } from "../main-o8x8qzqwuhk.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, I as IconButton, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-o8x8qzqwuhk.js";
import { T as TagsMenu } from "./TagsMenu-o8x8qzqwuhk.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-o8x8qzqwuhk.js";
import { C as Checkbox } from "./MultiSelectMenu-o8x8qzqwuhk.js";
import { S as SortMenu, I as InputField } from "./datepicker-o8x8qzqwuhk.js";
import { S as SvgIconEdit } from "./icon-edit-o8x8qzqwuhk.js";
>>>>>>> main:admin/dist/assets/CacheRulesTable-o8x8qzqwuhk.js
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
  const { selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const { activatePanel, setRowToEdit } = useTablePanels();
  const rowToEdit = useTablePanels((state) => state.rowToEdit);
  const matchTypes = Object.freeze({
    A: "All Pages",
    E: "Exact match",
    S: "Contains",
    R: "Regexp"
  });
  const header = Object.freeze({
    match_type: __("Match type"),
    match_url: __("Match URL"),
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
    match_type: /* @__PURE__ */ React.createElement(
      SortMenu,
      {
        defaultAccept: true,
        autoClose: true,
        items: matchTypes,
        name: "match_type",
        defaultValue: "A",
        description: __("Select when should be applied the rule"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_type: val })
      },
      header.match_type
    ),
    match_url: /* @__PURE__ */ React.createElement(
      InputField,
      {
        type: "url",
        hidden: (rowToEdit == null ? void 0 : rowToEdit.match_type) === "A",
        liveUpdate: true,
        defaultValue: "",
        description: __("Match browser URL with this value based on the selected type of rule"),
        label: header.match_url,
        onChange: (val) => setRowToEdit({ ...rowToEdit, match_url: val }),
        required: true
      }
    ),
    cache_ttl: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        defaultValue: "3600",
        label: header.cache_ttl,
        description: __("Cache will be valid defined number of seconds (time to live). Same value will be used for cache headers sent to browser"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, cache_ttl: val })
      }
    ),
    headers: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        label: header.headers,
        defaultValue: "",
        description: __("Use only if you need to cache page just for requests with specific HTTP header sent from browser. Comma separated list of headers to check. (Example 1: check if any header exists: MY-HEADER-NAME1, HEADER2), (Example 2: check if header has specific value: MY-HEADER-NAME1=value1, HEADER2=value2)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, headers: val })
      }
    ),
    cookie: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        label: header.cookie,
        defaultValue: "",
        description: __("Use only if you need to cache page just for requests with specific Cookie sent from browser. Comma separated list of cookies to check. (Example 1: check if any cookie exists: COOKIE_NAME_1, COOKIE_NAME_2), (Example 2: check if cookie has specific value: COOKIE-NAME=value)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, cookie: val })
      }
    ),
    params: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        label: header.params,
        defaultValue: "",
        description: __("Use only if you need to cache page just for requests with specific GET or POST parameter. Comma separated list of parameters to check. (Example 1: check if any parameter exists: query_param1, post_param_name2), (Example 2: check if request parameter has specific value: param1=value)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, params: val })
      }
    ),
    ip: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        label: header.ip,
        defaultValue: "",
        description: __("Cache just requests from specific IP address or subnet. Comma separated list of IP addresses or subnets. (e.g., 172.120.0.*, 192.168.0.0/24)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, ip: val })
      }
    ),
    browser: /* @__PURE__ */ React.createElement(
      InputField,
      {
        liveUpdate: true,
        label: header.browser,
        defaultValue: "",
        description: __("Cache just requests from specific browser names. Comma separated list of browser names or any string from User-Agent. (e.g. Chrome, Safari)"),
        onChange: (val) => setRowToEdit({ ...rowToEdit, browser: val })
      }
    ),
    rule_order: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "10", label: header.rule_order, onChange: (val) => setRowToEdit({ ...rowToEdit, rule_order: val }) }),
    is_active: /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: true, onChange: (val) => setRowToEdit({ ...rowToEdit, is_active: val }) }, header.is_active),
    labels: /* @__PURE__ */ React.createElement(TagsMenu, { hasActivator: true, label: __("Tags:"), slug, onChange: (val) => setRowToEdit({ ...rowToEdit, labels: val }) })
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
              updateRow({ cell });
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
      table,
      selectedRows,
      onDeleteSelected: deleteSelectedRows,
      onFilter: (filter) => setFilters(filter),
      options: {
        header,
        rowEditorCells,
        title: "Add New Cache Rule",
        data,
        slug,
        url,
        paginationId,
        rowToEdit,
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
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  CacheRulesTable as default
};

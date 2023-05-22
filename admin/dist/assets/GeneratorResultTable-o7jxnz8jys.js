import { r as reactExports, R as React, i as Tooltip, L as Loader } from "../main-o7jxnz8jys.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, D as DateTimeFormat, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar, I as IconButton, e as SvgIconRefresh } from "./ModuleViewHeaderBottom-o7jxnz8jys.js";
import { T as TagsMenu } from "./TagsMenu-o7jxnz8jys.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-o7jxnz8jys.js";
import "./MultiSelectMenu-o7jxnz8jys.js";
import { C as Checkbox } from "./Checkbox-o7jxnz8jys.js";
import { I as InputField } from "./datepicker-o7jxnz8jys.js";
import { S as SvgIconLink } from "./icon-link-o7jxnz8jys.js";
import { S as SvgIconActivate, a as SvgIconDisable } from "./icon-disable-o7jxnz8jys.js";
function GeneratorResultTable({ slug }) {
  var _a;
  const paginationId = "hash_id";
  const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater("generator/result");
  const [detailsOptions, setDetailsOptions] = reactExports.useState(null);
  const url = { filters, sorting };
  const ActionButton = ({ cell, onClick }) => {
    var _a2;
    const { status: status2 } = (_a2 = cell == null ? void 0 : cell.row) == null ? void 0 : _a2.original;
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center flex-justify-end" }, (status2 === "W" || status2 === "D") && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s c-saturated-green", tooltip: __("Accept"), tooltipClass: "align-left", onClick: () => onClick("A") }, /* @__PURE__ */ React.createElement(SvgIconActivate, null)), (status2 === "P" || status2 === "W" || status2 === "A" || status2 === "N") && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s c-saturated-red", tooltip: __("Decline"), tooltipClass: "align-left", onClick: () => onClick("D") }, /* @__PURE__ */ React.createElement(SvgIconDisable, null)), (status2 === "A" || status2 === "D" || status2 === "P") && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s", tooltip: __("Regenerate"), tooltipClass: "align-left", onClick: () => onClick("N") }, /* @__PURE__ */ React.createElement(SvgIconRefresh, null)));
  };
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
  } = useInfiniteFetch({ key: slug, url, paginationId, filters, sorting });
  const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const statusTypes = {
    A: "Active",
    N: "New",
    P: "Pending",
    W: "Waiting approval",
    D: "Disabled"
  };
  const header = {
    shortcode_id: __("Shortcode ID"),
    command: __("Command"),
    semantic_context: __("Semantic context"),
    url_filter: __("URL filter"),
    labels: __("Tags"),
    prompt_variables: __("Input data"),
    status: __("Status"),
    date_changed: __("Last change"),
    result: __("Result"),
    usage_count: __("Usage")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("shortcode_id", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.shortcode_id),
      size: 80
    }),
    columnHelper.accessor("prompt_variables", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.prompt_variables),
      size: 200
    }),
    columnHelper.accessor("semantic_context", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.semantic_context),
      size: 150
    }),
    columnHelper.accessor("url_filter", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_filter),
      size: 150
    }),
    columnHelper.accessor("result", {
      className: "nolimit",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.result),
      size: 200
    }),
    columnHelper.accessor("status", {
      filterValMenu: statusTypes,
      className: "nolimit",
      cell: (cell) => statusTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.status),
      size: 60
    }),
    columnHelper.accessor("date_changed", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.date_changed),
      size: 115
    }),
    columnHelper.accessor("usage_count", {
      cell: (cell) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, cell == null ? void 0 : cell.getValue(), (cell == null ? void 0 : cell.getValue()) > 0 && /* @__PURE__ */ React.createElement("button", { className: "ml-s", onClick: () => setDetailsOptions({
        title: `Shortcode used on these URLs`,
        slug,
        url: `${cell.row.original.shortcode_id}/${cell.row.original.hash_id}/urls`,
        showKeys: ["url_name", "created"],
        listId: "url_id"
      }) }, /* @__PURE__ */ React.createElement(SvgIconLink, null), /* @__PURE__ */ React.createElement(Tooltip, null, __("Show URLs where used")))),
      header: header.usage_count,
      size: 60
    }),
    columnHelper.accessor("labels", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(TagsMenu, { defaultValue: cell.getValue(), slug, onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.labels,
      size: 150
    }),
    columnHelper.accessor("actions", {
      className: "actions hoverize nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(ActionButton, { cell, onClick: (val) => updateRow({ changeField: "status", newVal: val, cell }) }),
      header: null,
      size: 70
    }),
    columnHelper.accessor("editRow", {
      className: "editRow",
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
      noImport: true,
      selectedRows,
      onDeleteSelected: deleteSelectedRows,
      onFilter: (filter) => setFilters(filter),
      detailsOptions,
      exportOptions: {
        slug,
        url,
        paginationId,
        deleteCSVCols: [paginationId, "hash_id"]
      }
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "fadeInto",
      slug,
      columns,
      returnTable: (returnTable) => setTable(returnTable),
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Item has been deleted.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  GeneratorResultTable as default
};

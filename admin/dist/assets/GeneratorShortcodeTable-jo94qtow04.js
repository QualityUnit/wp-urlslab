import { R as React, T as Tooltip, L as Loader } from "../main-jo94qtow04.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./useTableUpdater-jo94qtow04.js";
import { D as DateTimeFormat } from "./DateTimeFormat-jo94qtow04.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-jo94qtow04.js";
/* empty css                       */import { S as SortBy, I as IconButton } from "./_ColumnsMenu-jo94qtow04.js";
import { C as Checkbox, S as SortMenu, I as InputField } from "./FilterMenu-jo94qtow04.js";
import { S as SvgIconActivate, a as SvgIconDisable } from "./icon-disable-jo94qtow04.js";
import "./useMutation-jo94qtow04.js";
function GeneratorShortcodeTable({ slug }) {
  var _a;
  const paginationId = "shortcode_id";
  const { table, setTable, rowToInsert, setInsertRow, filters, setFilters, sorting, sortBy } = useTableUpdater("generator/shortcode");
  const url = { filters, sorting };
  const ActionButton = ({ cell, onClick }) => {
    var _a2;
    const { status: status2 } = (_a2 = cell == null ? void 0 : cell.row) == null ? void 0 : _a2.original;
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center flex-justify-end" }, status2 === "D" && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s c-saturated-green", tooltip: __("Activate"), tooltipClass: "align-left", onClick: () => onClick("A") }, /* @__PURE__ */ React.createElement(SvgIconActivate, null)), status2 === "A" && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s c-saturated-red", tooltip: __("Disable"), tooltipClass: "align-left", onClick: () => onClick("D") }, /* @__PURE__ */ React.createElement(SvgIconDisable, null)));
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
    A: __("Active"),
    D: __("Disabled")
  };
  const modelTypes = {
    "gpt-3.5-turbo": __("Gpt 3.5 Turbo"),
    "gpt-4": __("Gpt 4"),
    "text-davinci-003": __("Text Davinci 003")
  };
  const shortcodeTypeTypes = {
    "S": __("Semantic search"),
    "V": __("Video context")
  };
  const header = {
    shortcode_id: __("Id"),
    shortcode_type: __("Generator Type"),
    prompt: __("Prompt"),
    semantic_context: __("Semantic search query"),
    url_filter: __("URL filter"),
    default_value: __("Default value"),
    status: __("Status"),
    date_changed: __("Last change"),
    model: __("Model"),
    template: __("HTML template"),
    usage_count: __("Usage")
  };
  const inserterCells = {
    shortcode_type: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: shortcodeTypeTypes, name: "shortcode_type", checkedId: "S", onChange: (val) => setInsertRow({ ...rowToInsert, shortcode_type: val }) }, header.shortcode_type),
    prompt: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.prompt, onChange: (val) => setInsertRow({ ...rowToInsert, prompt: val }), required: true }),
    semantic_context: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.semantic_context, onChange: (val) => setInsertRow({ ...rowToInsert, semantic_context: val }) }),
    url_filter: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.url_filter, onChange: (val) => setInsertRow({ ...rowToInsert, url_filter: val }) }),
    default_value: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.default_value, onChange: (val) => setInsertRow({ ...rowToInsert, default_value: val }) }),
    template: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.template, onChange: (val) => setInsertRow({ ...rowToInsert, template: val }) }),
    model: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: modelTypes, name: "model", checkedId: "gpt-3.5-turbo", onChange: (val) => setInsertRow({ ...rowToInsert, model: val }) }, header.model)
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("shortcode_id", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.shortcode_id),
      size: 30
    }),
    columnHelper.accessor("shortcode_type", {
      filterValMenu: shortcodeTypeTypes,
      className: "nolimit",
      cell: (cell) => shortcodeTypeTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.shortcode_type),
      size: 150
    }),
    columnHelper.accessor("prompt", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.prompt),
      size: 180
    }),
    columnHelper.accessor("semantic_context", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.semantic_context),
      size: 180
    }),
    columnHelper.accessor("default_value", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.default_value),
      size: 180
    }),
    columnHelper.accessor("url_filter", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_filter),
      size: 180
    }),
    columnHelper.accessor("template", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.template),
      size: 180
    }),
    columnHelper.accessor("model", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, modelTypes[header.model]),
      size: 180
    }),
    columnHelper.accessor("status", {
      filterValMenu: statusTypes,
      className: "nolimit",
      cell: (cell) => statusTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.status),
      size: 150
    }),
    columnHelper.accessor("date_changed", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.date_changed),
      size: 100
    }),
    columnHelper.accessor("usage_count", {
      header: header.usage_count,
      size: 100
    }),
    columnHelper.accessor("actions", {
      className: "actions hoverize nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(ActionButton, { cell, onClick: (val) => updateRow({ changeField: "status", newVal: val, cell }) }),
      header: null,
      size: 70
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
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
      onClearRow: (clear) => {
        setInsertRow();
        if (clear === "rowInserted") {
          setInsertRow(clear);
          setTimeout(() => {
            setInsertRow();
          }, 3e3);
        }
      },
      insertOptions: { inserterCells, title: "Add generator", data, slug, url, paginationId, rowToInsert },
      exportOptions: {
        slug,
        url,
        paginationId,
        deleteCSVCols: [paginationId, "shortcode_id"]
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
    rowToInsert === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Shortcode has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  GeneratorShortcodeTable as default
};

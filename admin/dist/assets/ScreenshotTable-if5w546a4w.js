import { r as reactExports, R as React, e as Tooltip, L as Loader } from "../main-if5w546a4w.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, D as DateTimeFormat, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./useTableUpdater-if5w546a4w.js";
import { T as TagsMenu } from "./TagsMenu-if5w546a4w.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-if5w546a4w.js";
/* empty css                       */import { S as SortBy } from "./_ColumnsMenu-if5w546a4w.js";
import { C as Checkbox } from "./InputField-if5w546a4w.js";
import { S as SvgIconLink } from "./icon-link-if5w546a4w.js";
import "./useMutation-if5w546a4w.js";
const _ImageThumbnail = "";
function ScreenshotTable({ slug }) {
  var _a;
  const paginationId = "url_id";
  const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater({ slug });
  const url = { filters, sorting };
  const [detailsOptions, setDetailsOptions] = reactExports.useState(null);
  const [tooltipUrl, setTooltipUrl] = reactExports.useState();
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
  const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const scrStatusTypes = {
    N: __("Waiting"),
    A: __("Available"),
    P: __("Pending"),
    U: __("Updating"),
    E: __("Disabled")
  };
  const header = {
    screenshot_url: __("Screenshot URL"),
    url_name: __("Destination URL"),
    url_title: __("Title"),
    scr_status: __("Status"),
    screenshot_usage_count: __("Usage"),
    update_scr_date: __("Last change"),
    labels: __("Tags")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("screenshot_url", {
      tooltip: (cell) => {
        if (tooltipUrl === cell.getValue()) {
          return /* @__PURE__ */ React.createElement(Tooltip, null, /* @__PURE__ */ React.createElement("img", { src: cell.getValue(), alt: "url" }));
        }
        return false;
      },
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { onMouseOver: () => setTooltipUrl(cell.getValue()), onMouseLeave: () => setTooltipUrl(), href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.screenshot_url),
      size: 150
    }),
    columnHelper.accessor("url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_name),
      size: 200
    }),
    columnHelper.accessor("url_title", {
      className: "nolimit",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, { className: "xxl" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_title),
      size: 150
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("scr_status", {
      filterValMenu: scrStatusTypes,
      cell: (cell) => scrStatusTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.scr_status),
      size: 80
    }),
    columnHelper.accessor("update_scr_date", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.update_scr_date),
      size: 115
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("screenshot_usage_count", {
      cell: (cell) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, cell == null ? void 0 : cell.getValue(), (cell == null ? void 0 : cell.getValue()) > 0 && /* @__PURE__ */ React.createElement("button", { className: "ml-s", onClick: () => setDetailsOptions({
        title: `Screenshot used on these URLs`,
        slug,
        url: `${cell.row.original.url_id}/linked-from`,
        showKeys: ["src_url_name"],
        listId: "src_url_id"
      }) }, /* @__PURE__ */ React.createElement(SvgIconLink, null), /* @__PURE__ */ React.createElement(Tooltip, null, __("Show URLs where used")))),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.screenshot_usage_count),
      size: 60
    }),
    columnHelper.accessor("labels", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(TagsMenu, { defaultValue: cell.getValue(), slug, onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.labels,
      size: 150
    }),
    columnHelper.accessor("editRow", {
      className: "editRow",
      tooltip: () => /* @__PURE__ */ React.createElement(Tooltip, { className: "align-left xxxl" }, __("Delete item")),
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
      selectedRows,
      onDeleteSelected: deleteSelectedRows,
      onFilter: (filter) => setFilters(filter),
      noImport: true,
      detailsOptions,
      exportOptions: {
        slug,
        url,
        paginationId,
        deleteCSVCols: ["urlslab_url_id", "url_id", "urlslab_domain_id"],
        perPage: 1e3
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.url_name} “${row.url_name}”`, " has been deleted.") : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  ScreenshotTable as default
};

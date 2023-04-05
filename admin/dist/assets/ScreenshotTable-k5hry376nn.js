import { r as reactExports, R as React, L as Loader } from "../main-k5hry376nn.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, c as Table, P as ProgressBar } from "./useTableUpdater-k5hry376nn.js";
import { C as Checkbox, I as InputField, S as SortMenu } from "./datepicker-k5hry376nn.js";
import { S as SvgIconLink } from "./icon-link-k5hry376nn.js";
import "./useMutation-k5hry376nn.js";
function ScreenshotTable({ slug }) {
  var _a;
  const pageId = "url_id";
  const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn || "&sort_column=url_name&sort_direction=ASC"}`, [filters, sortingColumn]);
  const [detailsOptions, setDetailsOptions] = reactExports.useState(null);
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
  const { row, selectRow, deleteRow, updateRow } = useChangeRow({ data, url, slug, pageId });
  const scrStatusTypes = {
    N: __("Waiting"),
    A: __("Awailable"),
    P: __("Pending"),
    E: __("Disabled")
  };
  const scrScheduleTypes = {
    N: "New",
    M: "Manual",
    S: "Scheduled",
    E: "Error"
  };
  const header = {
    screenshot_url: __("Screenshot URL"),
    url_name: __("Destination URL"),
    url_title: __("Title"),
    scr_status: __("Status"),
    scr_schedule: __("Schedule"),
    screenshot_usage_count: __("Usage"),
    update_scr_date: __("Updated at")
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
      className: "thumbnail",
      cell: (image) => (image == null ? void 0 : image.getValue()) ? /* @__PURE__ */ React.createElement("a", { href: image == null ? void 0 : image.getValue(), target: "_blank", rel: "noreferrer" }, /* @__PURE__ */ React.createElement("img", { src: image == null ? void 0 : image.getValue(), alt: image.row.original.url_name })) : /* @__PURE__ */ React.createElement("div", { className: "img" }),
      header: __("Thumbnail"),
      size: 90
    }),
    columnHelper.accessor("url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: header.url_name,
      size: 250
    }),
    columnHelper.accessor("url_title", {
      className: "nolimit",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: header.url_title,
      size: 200
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("scr_status", {
      filterValMenu: scrStatusTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        SortMenu,
        {
          items: scrStatusTypes,
          name: cell.column.id,
          checkedId: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: header.scr_status,
      size: 100
    }),
    columnHelper.accessor("scr_schedule", {
      filterValMenu: scrScheduleTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        SortMenu,
        {
          items: scrScheduleTypes,
          name: cell.column.id,
          checkedId: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: header.scr_schedule,
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("screenshot_usage_count", {
      cell: (cell) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, cell == null ? void 0 : cell.getValue(), (cell == null ? void 0 : cell.getValue()) > 0 && /* @__PURE__ */ React.createElement("button", { className: "ml-s", onClick: () => setDetailsOptions({
        title: `Screenshot used on these URLs`,
        slug,
        url: `${cell.row.original.url_id}/linked-from`,
        showKeys: ["src_url_name"],
        listId: "screenshot_url_id"
      }) }, /* @__PURE__ */ React.createElement(SvgIconLink, null), /* @__PURE__ */ React.createElement(Tooltip, null, __("Show URLs where used")))),
      header: header.screenshot_usage_count,
      size: 100
    }),
    // columnHelper.accessor( 'update_scr_date', {
    // 	cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
    // 	header: header.update_scr_date,
    // 	size: 140,
    // } ),
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
      onSort: (val) => sortBy(val),
      onFilter: (filter) => setFilters(filter),
      noImport: true,
      detailsOptions,
      exportOptions: {
        url: slug,
        filters,
        fromId: `from_${pageId}`,
        pageId,
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
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  ScreenshotTable as default
};

import { r as reactExports, R as React, L as Loader } from "../main-mwi7nr1gli.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, c as Table, P as ProgressBar } from "./useTableUpdater-mwi7nr1gli.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-mwi7nr1gli.js";
import { C as Checkbox, S as SortMenu } from "./datepicker-mwi7nr1gli.js";
import { S as SvgIconLink } from "./icon-link-mwi7nr1gli.js";
import "./useMutation-mwi7nr1gli.js";
function MediaFilesTable({ slug }) {
  var _a;
  const pageId = "fileid";
  const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater({ slug });
  const url = `${filters}${sortingColumn}`;
  const [detailsOptions, setDetailsOptions] = reactExports.useState(null);
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
  } = useInfiniteFetch({ key: slug, url, pageId });
  const { row, selectRow, deleteRow, updateRow } = useChangeRow({ data, url, slug, pageId });
  const statusTypes = {
    N: __("New"),
    A: __("Available"),
    P: __("Processing"),
    D: __("Disabled")
  };
  const header = {
    filename: __("File Name"),
    filetype: __("File Type"),
    status_changed: __("Status changed"),
    filestatus: __("Status"),
    height: __("Height"),
    width: __("Width"),
    filesize: __("File Size"),
    file_usage_count: __("Usage"),
    url: __("URL")
  };
  const columns = reactExports.useMemo(() => [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filename", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: header.filename,
      size: 150
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filetype", {
      header: header.filetype,
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filestatus", {
      filterValMenu: statusTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        SortMenu,
        {
          items: statusTypes,
          name: cell.column.id,
          checkedId: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: header.filestatus,
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("status_changed", {
      cell: (val) => new Date(val == null ? void 0 : val.getValue()).toLocaleString(window.navigator.language),
      header: () => __("Status changed"),
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("width", {
      cell: (cell) => `${cell.getValue()} px`,
      header: header.width,
      size: 50
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("height", {
      cell: (cell) => `${cell.getValue()} px`,
      header: header.height,
      size: 50
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filesize", {
      cell: (cell) => `${Math.round(cell.getValue() / 1024, 0)} kB`,
      header: header.filesize,
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("file_usage_count", {
      cell: (cell) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, cell == null ? void 0 : cell.getValue(), (cell == null ? void 0 : cell.getValue()) > 0 && /* @__PURE__ */ React.createElement("button", { className: "ml-s", onClick: () => setDetailsOptions({
        title: `Files used on these URLs`,
        slug,
        url: `${cell.row.original.fileid}/urls`,
        showKeys: ["url_name"],
        listId: "url_id"
      }) }, /* @__PURE__ */ React.createElement(SvgIconLink, null), /* @__PURE__ */ React.createElement(Tooltip, null, __("Show URLs where used")))),
      header: header.file_usage_count,
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("url", {
      tooltip: (cell) => {
        const regex = /(jpeg|jpg|webp|gif|png|svg)/g;
        const isImage = cell.getValue().search(regex);
        return /* @__PURE__ */ React.createElement(Tooltip, null, isImage !== -1 && /* @__PURE__ */ React.createElement("img", { src: cell.getValue(), alt: "url" }));
      },
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: header.url,
      size: 250
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ cell }) }),
      header: null
    })
  ], []);
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
      detailsOptions,
      exportOptions: {
        url: slug,
        filters,
        fromId: `from_${pageId}`,
        pageId,
        deleteCSVCols: [pageId, "dest_url_id"]
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.filename} “${row.filename}”`, " ", __("has been deleted.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sortingColumn } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  MediaFilesTable as default
};

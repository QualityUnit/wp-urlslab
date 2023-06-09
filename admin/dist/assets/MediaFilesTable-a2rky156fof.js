import { r as reactExports, R as React, l as Tooltip, L as Loader } from "../main-a2rky156fof.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-a2rky156fof.js";
import { T as TagsMenu } from "./TagsMenu-a2rky156fof.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-a2rky156fof.js";
import { C as Checkbox } from "./MultiSelectMenu-a2rky156fof.js";
import { S as SortMenu } from "./datepicker-a2rky156fof.js";
import { S as SvgIconLink } from "./icon-link-a2rky156fof.js";
function MediaFilesTable({ slug }) {
  var _a;
  const paginationId = "fileid";
  const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater({ slug });
  const url = { filters, sorting };
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
  const { selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const { activatePanel, setOptions } = useTablePanels();
  const options = useTablePanels((state) => state.options);
  const driverTypes = {
    D: "Database",
    F: "Local file",
    S: "Amazon S3"
  };
  const statusTypes = {
    N: __("New"),
    A: __("Available"),
    P: __("Processing"),
    X: __("Not Processing"),
    D: __("Disabled"),
    E: __("Error")
  };
  const header = {
    filename: __("File name"),
    filetype: __("File type"),
    url: __("Original URL"),
    download_url: __("Offloaded URL"),
    labels: __("Tags"),
    filesize: __("File size"),
    width: __("Width"),
    height: __("Height"),
    driver: __("Storage driver"),
    filestatus: __("Status"),
    file_usage_count: __("Usage")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filename", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.filename),
      size: 200
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("url", {
      tooltip: (cell) => {
        if (tooltipUrl === cell.getValue()) {
          const regex = /(jpeg|jpg|webp|gif|png|svg)/g;
          const isImage = cell.getValue().search(regex);
          return /* @__PURE__ */ React.createElement(Tooltip, null, isImage !== -1 && /* @__PURE__ */ React.createElement("img", { src: cell.getValue(), alt: "url" }));
        }
        return false;
      },
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { onMouseOver: () => setTooltipUrl(cell.getValue()), onMouseLeave: () => setTooltipUrl(), href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url),
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("download_url", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.download_url),
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filetype", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.filetype),
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filesize", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      unit: "kB",
      cell: (cell) => `${Math.round(cell.getValue() / 1024, 0)} kB`,
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.filesize),
      size: 50
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("width", {
      unit: "px",
      cell: (cell) => `${cell.getValue()} px`,
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.width),
      size: 50
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("height", {
      unit: "px",
      cell: (cell) => `${cell.getValue()} px`,
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.height),
      size: 50
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filestatus", {
      filterValMenu: statusTypes,
      cell: (cell) => statusTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.filestatus),
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("driver", {
      filterValMenu: driverTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: driverTypes, name: cell.column.id, defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, customEndpoint: "/transfer", cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.driver),
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("file_usage_count", {
      cell: (cell) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, cell == null ? void 0 : cell.getValue(), (cell == null ? void 0 : cell.getValue()) > 0 && /* @__PURE__ */ React.createElement("button", { className: "ml-s", onClick: () => {
        setOptions({ ...options, detailsOptions: {
          title: `Files used on these URLs`,
          slug,
          url: `${cell.row.original.fileid}/urls`,
          showKeys: ["url_name"],
          listId: "url_id"
        } });
        activatePanel("details");
      } }, /* @__PURE__ */ React.createElement(SvgIconLink, null), /* @__PURE__ */ React.createElement(Tooltip, null, __("Show URLs where used")))),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.file_usage_count),
      size: 80
    }),
    columnHelper.accessor("labels", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(TagsMenu, { defaultValue: cell.getValue(), slug, onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.labels,
      size: 150
    }),
    columnHelper.accessor("editRow", {
      className: "editRow",
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ cell, id: "filename" }) }),
      header: null
    })
  ];
  if (status === "loading") {
    return /* @__PURE__ */ React.createElement(Loader, null);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    ModuleViewHeaderBottom,
    {
      table,
      noImport: true,
      selectedRows,
      onDeleteSelected: () => deleteSelectedRows({ id: "filename" }),
      onFilter: (filter) => setFilters(filter),
      options: {
        header,
        slug,
        data,
        url,
        paginationId,
        deleteCSVCols: [paginationId, "fileid", "filehash"]
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
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  MediaFilesTable as default
};

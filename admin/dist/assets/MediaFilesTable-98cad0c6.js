import { r as reactExports, R as React, L as Loader } from "../settings.js";
import { u as useTableUpdater, a as useInfiniteFetch, h as handleSelected, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, b as Table } from "./useTableUpdater-afa37684.js";
import { C as Checkbox, S as SortMenu } from "./datepicker-ff7dcd9b.js";
import { M as MenuInput } from "./MenuInput-fef364f8.js";
import "./useMutation-1e5291cb.js";
import "./InputField-36e1e240.js";
function MediaFilesTable({ slug }) {
  var _a;
  const { table, setTable, filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn}`, [filters, sortingColumn]);
  const pageId = "fileid";
  const {
    __,
    columnHelper,
    data,
    status,
    isSuccess,
    isFetchingNextPage,
    hasNextPage,
    ref
  } = useInfiniteFetch({ key: slug, url, pageId, currentFilters, sortingColumn });
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
    file_usage_count: __("File Usage"),
    url: __("URL")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        handleSelected(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filename", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter file name", defaultValue: currentFilters.filename, onChange: (val) => addFilter("filename", val) }, header.filename),
      size: 150
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filetype", {
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter file type", defaultValue: currentFilters.filetype, onChange: (val) => addFilter("filetype", val) }, header.filetype),
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filestatus", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        SortMenu,
        {
          items: statusTypes,
          name: cell.column.id,
          checkedId: cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
        }
      ),
      header: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { isFilter: true, items: statusTypes, name: cell.column.id, checkedId: currentFilters.filestatus || "", onChange: (val) => addFilter("filestatus", val) }, header.filestatus),
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("status_changed", {
      cell: (val) => new Date(val == null ? void 0 : val.getValue()).toLocaleString(window.navigator.language),
      header: () => __("Status changed"),
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("width", {
      cell: (cell) => `${cell.getValue()} px`,
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter Width", defaultValue: currentFilters.width, onChange: (val) => addFilter("width", val) }, header.width),
      size: 50
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("height", {
      cell: (cell) => `${cell.getValue()} px`,
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter Height", defaultValue: currentFilters.height, onChange: (val) => addFilter("height", val) }, header.height),
      size: 50
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("filesize", {
      cell: (cell) => `${Math.round(cell.getValue() / 1024, 0)} kB`,
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter size in kB", defaultValue: currentFilters.filesize, onChange: (val) => addFilter("filesize", val * 1024) }, header.filesize),
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("file_usage_count", {
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Filter by usage ", defaultValue: currentFilters.file_usage_count, onChange: (val) => addFilter("file_usage_count", val * 1024) }, header.file_usage_count),
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("url", {
      tooltip: (cell) => {
        const regex = /(jpeg|jpg|webp|gif|png|svg)/g;
        const isImage = cell.getValue().search(regex);
        return /* @__PURE__ */ React.createElement(Tooltip, null, isImage !== -1 && /* @__PURE__ */ React.createElement("img", { src: cell.getValue(), alt: "url" }));
      },
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter URL", defaultValue: currentFilters.url, onChange: (val) => addFilter("url", val) }, header.url),
      size: 250
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ data, url, slug, cell, rowSelector: pageId }) }),
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
      currentFilters,
      header,
      table,
      removeFilters: (key) => removeFilters(key),
      onSort: (val) => sortBy(val),
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
      columns,
      returnTable: (returnTable) => setTable(returnTable),
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.filename} “${row.filename}”`, " ", __("has been deleted.")) : null,
    /* @__PURE__ */ React.createElement("button", { ref }, isFetchingNextPage ? "Loading more..." : hasNextPage)
  ));
}
export {
  MediaFilesTable as default
};

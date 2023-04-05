import { r as reactExports, R as React, L as Loader } from "../main-b65fm56nnz.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, c as Table } from "./useTableUpdater-b65fm56nnz.js";
import { C as Checkbox } from "./datepicker-b65fm56nnz.js";
import "./useMutation-b65fm56nnz.js";
function YouTubeCacheTable({ slug }) {
  var _a;
  const pageId = "videoid";
  const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn}`, [filters, sortingColumn]);
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
  const statusTypes = {
    N: __("New"),
    A: __("Available"),
    P: __("Processing"),
    D: __("Disabled")
  };
  const header = {
    thumb: __("Thumbnail"),
    videoid: __("YouTube Id"),
    status: __("Status"),
    title: __("Title"),
    published: __("Published")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2, _b;
      return (_b = (_a2 = JSON.parse(`${cell == null ? void 0 : cell.microdata}`)) == null ? void 0 : _a2.items[0]) == null ? void 0 : _b.snippet;
    }, {
      id: "thumb",
      className: "thumbnail",
      tooltip: (image) => {
        var _a2, _b, _c, _d;
        return /* @__PURE__ */ React.createElement(Tooltip, null, /* @__PURE__ */ React.createElement("img", { src: (_c = (_b = (_a2 = image.getValue()) == null ? void 0 : _a2.thumbnails) == null ? void 0 : _b.high) == null ? void 0 : _c.url, alt: (_d = image == null ? void 0 : image.getValue()) == null ? void 0 : _d.title }));
      },
      cell: (image) => {
        var _a2, _b, _c, _d;
        return /* @__PURE__ */ React.createElement(
          "img",
          {
            src: (_c = (_b = (_a2 = image == null ? void 0 : image.getValue()) == null ? void 0 : _a2.thumbnails) == null ? void 0 : _b.high) == null ? void 0 : _c.url,
            alt: (_d = image == null ? void 0 : image.getValue()) == null ? void 0 : _d.title
          }
        );
      },
      header: header.thumb,
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("videoid", {
      header: header.videoid,
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("status", {
      filterValMenu: statusTypes,
      cell: (cell) => statusTypes[cell.getValue()],
      header: header.status,
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2, _b, _c;
      return [cell == null ? void 0 : cell.videoid, (_c = (_b = (_a2 = JSON.parse(`${cell == null ? void 0 : cell.microdata}`)) == null ? void 0 : _a2.items[0]) == null ? void 0 : _b.snippet) == null ? void 0 : _c.title];
    }, {
      id: "title",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()[1]),
      cell: (val) => /* @__PURE__ */ React.createElement("a", { href: `https://youtu.be/${val == null ? void 0 : val.getValue()[0]}`, target: "_blank", rel: "noreferrer" }, val == null ? void 0 : val.getValue()[1]),
      header: header.title,
      size: 450
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
      onSort: (val) => sortBy(val),
      onFilter: (filter) => setFilters(filter),
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.videoid} “${row.videoid}”`, " ", __("has been deleted.")) : null,
    /* @__PURE__ */ React.createElement("button", { ref }, isFetchingNextPage ? "Loading more..." : hasNextPage)
  ));
}
export {
  YouTubeCacheTable as default
};

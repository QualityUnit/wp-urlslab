import { r as reactExports, R as React, L as Loader } from "../settings.js";
import { u as useTableUpdater, a as useInfiniteFetch, h as handleSelected, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, b as Table } from "./useTableUpdater-afa37684.js";
import { C as Checkbox, S as SortMenu } from "./datepicker-ff7dcd9b.js";
import { M as MenuInput } from "./MenuInput-fef364f8.js";
import "./useMutation-1e5291cb.js";
import "./InputField-36e1e240.js";
function YouTubeCacheTable({ slug }) {
  var _a;
  const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn}`, [filters, sortingColumn]);
  const pageId = "videoid";
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
        handleSelected(val, cell);
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
      header: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { isFilter: true, items: statusTypes, name: cell.column.id, checkedId: currentFilters.status || "", onChange: (val) => addFilter("status", val) }, header.status),
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2, _b, _c;
      return [cell == null ? void 0 : cell.videoid, (_c = (_b = (_a2 = JSON.parse(`${cell == null ? void 0 : cell.microdata}`)) == null ? void 0 : _a2.items[0]) == null ? void 0 : _b.snippet) == null ? void 0 : _c.title];
    }, {
      id: "title",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()[1]),
      cell: (val) => /* @__PURE__ */ React.createElement("a", { href: `https://youtu.be/${val == null ? void 0 : val.getValue()[0]}`, target: "_blank", rel: "noreferrer" }, val == null ? void 0 : val.getValue()[1]),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter title", defaultValue: currentFilters.title, onChange: (val) => addFilter("title", val) }, header.title),
      size: 450
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2, _b, _c;
      return (_c = (_b = (_a2 = JSON.parse(`${cell == null ? void 0 : cell.microdata}`)) == null ? void 0 : _a2.items[0]) == null ? void 0 : _b.snippet) == null ? void 0 : _c.publishedAt;
    }, {
      id: "published",
      cell: (val) => new Date(val == null ? void 0 : val.getValue()).toLocaleString(window.navigator.language),
      header: header.published,
      size: 100
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
      noImport: true,
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
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.videoid} “${row.videoid}”`, " ", __("has been deleted.")) : null,
    /* @__PURE__ */ React.createElement("button", { ref }, isFetchingNextPage ? "Loading more..." : hasNextPage)
  ));
}
export {
  YouTubeCacheTable as default
};

<<<<<<< HEAD:admin/dist/assets/YouTubeCacheTable-vqw3w5p1iw.js
import { R as React, l as Tooltip, L as Loader } from "../main-vqw3w5p1iw.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar, I as IconButton, f as SvgIconRefresh } from "./ModuleViewHeaderBottom-vqw3w5p1iw.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-vqw3w5p1iw.js";
import { C as Checkbox } from "./MultiSelectMenu-vqw3w5p1iw.js";
import { S as SvgIconLink } from "./icon-link-vqw3w5p1iw.js";
import "./datepicker-vqw3w5p1iw.js";
import { S as SvgIconActivate, a as SvgIconDisable } from "./icon-disable-vqw3w5p1iw.js";
=======
<<<<<<<< HEAD:admin/dist/assets/YouTubeCacheTable-txs3jaim6w.js
import { R as React, l as Tooltip, L as Loader } from "../main-txs3jaim6w.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar, I as IconButton, f as SvgIconRefresh } from "./ModuleViewHeaderBottom-txs3jaim6w.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-txs3jaim6w.js";
import { C as Checkbox } from "./MultiSelectMenu-txs3jaim6w.js";
import { S as SvgIconLink } from "./icon-link-txs3jaim6w.js";
import "./datepicker-txs3jaim6w.js";
import { S as SvgIconActivate, a as SvgIconDisable } from "./icon-disable-txs3jaim6w.js";
========
import { r as reactExports, R as React } from "./index-myg4akepfo.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar, I as IconButton, e as SvgIconRefresh } from "./ModuleViewHeaderBottom-myg4akepfo.js";
import { k as Tooltip, L as Loader } from "../main-myg4akepfo.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-myg4akepfo.js";
import { C as Checkbox } from "./MultiSelectMenu-myg4akepfo.js";
import { S as SvgIconLink } from "./icon-link-myg4akepfo.js";
import "./datepicker-myg4akepfo.js";
import { S as SvgIconActivate, a as SvgIconDisable } from "./icon-disable-myg4akepfo.js";
>>>>>>>> 9abc1ecf (initial build):admin/dist/assets/YouTubeCacheTable-myg4akepfo.js
>>>>>>> 37911432 (initial build):admin/dist/assets/YouTubeCacheTable-txs3jaim6w.js
function YouTubeCacheTable({ slug }) {
  var _a;
  const paginationId = "videoid";
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
  const { activatePanel, setOptions } = useTablePanels();
  const options = useTablePanels((state) => state.options);
  const ActionButton = ({ cell, onClick }) => {
    var _a2;
    const { status: videoStatus } = (_a2 = cell == null ? void 0 : cell.row) == null ? void 0 : _a2.original;
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center flex-justify-end" }, (videoStatus === "W" || videoStatus === "D") && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s c-saturated-green", tooltip: __("Accept"), tooltipClass: "align-left", onClick: () => onClick("A") }, /* @__PURE__ */ React.createElement(SvgIconActivate, null)), (videoStatus === "P" || videoStatus === "W" || videoStatus === "A" || videoStatus === "N") && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s c-saturated-red", tooltip: __("Decline"), tooltipClass: "align-left", onClick: () => onClick("D") }, /* @__PURE__ */ React.createElement(SvgIconDisable, null)), (videoStatus === "A" || videoStatus === "D" || videoStatus === "P") && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s", tooltip: __("Regenerate"), tooltipClass: "align-left", onClick: () => onClick("N") }, /* @__PURE__ */ React.createElement(SvgIconRefresh, null)));
  };
  const statusTypes = {
    N: __("New"),
    A: __("Available"),
    P: __("Processing"),
    D: __("Disabled")
  };
  const header = {
    thumb: __("Thumbnail"),
    videoid: __("YouTube Video ID"),
    status: __("Status"),
    title: __("Title"),
    captions: __("Captions"),
    published: __("Published"),
    usage_count: __("Usage"),
    microdata: __("Youtube Microdata JSON")
  };
  const getJson = (param) => {
    try {
      return JSON.parse(param);
    } catch (e) {
      return null;
    }
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2, _b;
      return (_b = (_a2 = getJson(`${cell == null ? void 0 : cell.microdata}`)) == null ? void 0 : _a2.items[0]) == null ? void 0 : _b.snippet;
    }, {
      id: "thumb",
      className: "thumbnail",
      cell: (image) => {
        var _a2, _b, _c, _d;
        return /* @__PURE__ */ React.createElement("img", { src: (_c = (_b = (_a2 = image == null ? void 0 : image.getValue()) == null ? void 0 : _a2.thumbnails) == null ? void 0 : _b.high) == null ? void 0 : _c.url, className: "video-thumbnail", alt: (_d = image == null ? void 0 : image.getValue()) == null ? void 0 : _d.title });
      },
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.thumb),
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("videoid", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.videoid),
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor((cell) => {
      var _a2, _b, _c;
      return [cell == null ? void 0 : cell.videoid, (_c = (_b = (_a2 = getJson(`${cell == null ? void 0 : cell.microdata}`)) == null ? void 0 : _a2.items[0]) == null ? void 0 : _b.snippet) == null ? void 0 : _c.title];
    }, {
      id: "title",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()[1]),
      cell: (val) => /* @__PURE__ */ React.createElement("a", { href: `https://youtu.be/${val == null ? void 0 : val.getValue()[0]}`, target: "_blank", rel: "noreferrer" }, val == null ? void 0 : val.getValue()[1]),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.title),
      size: 200
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("captions", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.captions),
      size: 150
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("status", {
      filterValMenu: statusTypes,
      cell: (cell) => statusTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.status),
      size: 80
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("usage_count", {
      cell: (cell) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, cell == null ? void 0 : cell.getValue(), (cell == null ? void 0 : cell.getValue()) > 0 && /* @__PURE__ */ React.createElement("button", { className: "ml-s", onClick: () => {
        setOptions({ ...options, detailsOptions: {
          title: `Video ID “${cell.row.original.videoid}” is used on these URLs`,
          text: `Video title: ${cell.row._valuesCache.title[1]}`,
          slug,
          url: `${cell.row.original.videoid}/urls`,
          showKeys: ["url_name"],
          listId: "url_id"
        } });
        activatePanel("details");
      } }, /* @__PURE__ */ React.createElement(SvgIconLink, null), /* @__PURE__ */ React.createElement(Tooltip, { className: "align-left" }, __("Show URLs where used")))),
      header: header.usage_count,
      size: 60
    }),
    columnHelper.accessor("actions", {
      className: "actions hoverize nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(ActionButton, { cell, onClick: (val) => updateRow({ changeField: "status", newVal: val, cell }) }),
      header: null,
      size: 70
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
      table,
      selectedRows,
      onDeleteSelected: deleteSelectedRows,
      onFilter: (filter) => setFilters(filter),
      options: {
        header,
        data,
        slug,
        url,
        paginationId,
        deleteCSVCols: ["usage_count"]
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
  YouTubeCacheTable as default
};

import { r as reactExports, R as React, T as Tooltip, l as langName, L as Loader, I as IconButton, S as SvgIconCronRefresh } from "../main-djykm1j602.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, S as SortBy, c as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, d as TooltipSortingFiltering, P as ProgressBar } from "./useTableUpdater-djykm1j602.js";
import { D as DateTimeFormat } from "./DateTimeFormat-djykm1j602.js";
import { C as Checkbox, I as InputField } from "./datepicker-djykm1j602.js";
import "./useMutation-djykm1j602.js";
const SvgIconActivate = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props }, /* @__PURE__ */ reactExports.createElement("g", { id: "Artboard1", transform: "matrix(0.696791,0,0,0.696791,-309.021,-308.227)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.136681,-2.09317e-16,-2.09317e-16,-0.136681,-193.058,542.406)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.0939423,0,0,0.0939423,4656.68,227.41)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2483,5370C2466,5367 2407,5360 2352,5354C2124,5328 1849,5253 1617,5154C1001,4889 487,4375 222,3759C125,3533 55,3277 19,3024C1,2893 1,2483 19,2352C105,1741 365,1211 788,788C1095,481 1456,260 1872,127C2153,38 2368,5 2688,5C3008,5 3223,38 3504,127C4092,315 4576,681 4924,1198C5154,1540 5296,1921 5357,2352C5375,2483 5375,2893 5357,3024C5271,3635 5011,4165 4588,4588C4174,5002 3654,5262 3061,5351C2961,5366 2551,5379 2483,5370ZM3024,4930C3510,4855 3940,4638 4289,4289C4641,3937 4854,3513 4931,3014C4944,2929 4950,2832 4950,2688C4950,2544 4944,2447 4931,2363C4854,1863 4641,1439 4289,1087C3937,735 3513,522 3014,445C2848,419 2528,419 2363,445C1863,522 1439,735 1087,1087C735,1439 522,1863 445,2363C419,2528 419,2848 445,3014C522,3513 735,3937 1087,4289C1476,4678 1931,4888 2515,4950C2599,4958 2917,4946 3024,4930Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.0939423,0,0,0.0939423,4656.68,227.41)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M3644,3585C3620,3575 3374,3336 2964,2927L2321,2284L2050,2554C1769,2834 1728,2866 1648,2866C1592,2867 1509,2821 1476,2771C1442,2720 1431,2644 1449,2587C1459,2555 1538,2469 1826,2180C2066,1939 2204,1808 2231,1795C2286,1769 2356,1769 2409,1795C2438,1809 2693,2058 3183,2549C3974,3341 3945,3308 3935,3414C3922,3551 3770,3639 3644,3585Z" })))));
const SvgIconDisable = (props) => /* @__PURE__ */ reactExports.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", xmlSpace: "preserve", "xmlns:serif": "http://www.serif.com/", style: {
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: 2
}, ...props }, /* @__PURE__ */ reactExports.createElement("g", { id: "Artboard1", transform: "matrix(0.773476,0,0,0.755889,-322.483,-314.284)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.12313,-1.92952e-16,-1.88564e-16,-0.125995,-149.289,515.156)" }, /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.10252,0,9.94007e-32,0.10252,4574.93,261.222)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M1955,3490C1890,3457 1854,3369 1874,3290C1878,3270 1977,3163 2166,2974L2451,2688L2166,2402C1977,2213 1878,2106 1874,2086C1862,2041 1874,1969 1899,1934C1939,1877 2043,1850 2103,1881C2116,1887 2253,2018 2407,2172L2688,2451L2974,2166C3163,1977 3270,1878 3290,1874C3335,1862 3407,1874 3442,1899C3499,1939 3526,2043 3495,2103C3489,2116 3358,2253 3204,2407L2924,2688L3204,2969C3358,3123 3489,3260 3495,3273C3526,3333 3499,3437 3442,3477C3407,3502 3335,3514 3290,3502C3270,3498 3163,3399 2974,3210L2688,2925L2407,3204C2253,3358 2116,3489 2103,3495C2070,3512 1995,3509 1955,3490Z" })), /* @__PURE__ */ reactExports.createElement("g", { transform: "matrix(0.0939423,0,3.70537e-32,0.0939423,4598.01,284.118)" }, /* @__PURE__ */ reactExports.createElement("path", { d: "M2483,5370C2466,5367 2407,5360 2352,5354C2124,5328 1849,5253 1617,5154C1001,4889 487,4375 222,3759C125,3533 55,3277 19,3024C1,2893 1,2483 19,2352C105,1741 365,1211 788,788C1095,481 1456,260 1872,127C2153,38 2368,5 2688,5C3008,5 3223,38 3504,127C4092,315 4576,681 4924,1198C5154,1540 5296,1921 5357,2352C5375,2483 5375,2893 5357,3024C5271,3635 5011,4165 4588,4588C4174,5002 3654,5262 3061,5351C2961,5366 2551,5379 2483,5370ZM3024,4930C3510,4855 3940,4638 4289,4289C4641,3937 4854,3513 4931,3014C4944,2929 4950,2832 4950,2688C4950,2544 4944,2447 4931,2363C4854,1863 4641,1439 4289,1087C3937,735 3513,522 3014,445C2848,419 2528,419 2363,445C1863,522 1439,735 1087,1087C735,1439 522,1863 445,2363C419,2528 419,2848 445,3014C522,3513 735,3937 1087,4289C1476,4678 1931,4888 2515,4950C2599,4958 2917,4946 3024,4930Z" })))));
function GeneratorTable({ slug }) {
  var _a;
  const paginationId = "generator_id";
  const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater({ slug });
  const url = { filters, sorting };
  const ActionButton = ({ cell, onClick }) => {
    var _a2;
    const { status: status2 } = (_a2 = cell == null ? void 0 : cell.row) == null ? void 0 : _a2.original;
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center flex-justify-end" }, (status2 === "W" || status2 === "D") && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s c-saturated-green", tooltip: __("Accept"), tooltipClass: "align-left", onClick: () => onClick("A") }, /* @__PURE__ */ React.createElement(SvgIconActivate, null)), (status2 === "W" || status2 === "A") && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s c-saturated-red", tooltip: __("Decline"), tooltipClass: "align-left", onClick: () => onClick("D") }, /* @__PURE__ */ React.createElement(SvgIconDisable, null)), status2 !== "N" && status2 !== "P" && /* @__PURE__ */ React.createElement(IconButton, { className: "mr-s", tooltip: __("Regenerate"), tooltipClass: "align-left", onClick: () => onClick("N") }, /* @__PURE__ */ React.createElement(SvgIconCronRefresh, null)));
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
    command: __("Command"),
    semantic_context: __("Context"),
    url_filter: __("URL filter"),
    lang: __("Language"),
    status: __("Status"),
    status_changed: __("Last change"),
    result: __("Result"),
    usage_count: __("Usage")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("command", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.command),
      size: 180
    }),
    columnHelper.accessor("semantic_context", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.semantic_context),
      size: 180
    }),
    columnHelper.accessor("url_filter", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_filter),
      size: 180
    }),
    columnHelper.accessor("lang", {
      cell: (cell) => langName(cell == null ? void 0 : cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.lang),
      size: 100
    }),
    columnHelper.accessor("result", {
      className: "nolimit",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement(InputField, { defaultValue: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.result),
      size: 180
    }),
    columnHelper.accessor("status", {
      filterValMenu: statusTypes,
      className: "nolimit",
      cell: (cell) => statusTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.status),
      size: 150
    }),
    columnHelper.accessor("status_changed", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.status_changed),
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
      exportOptions: {
        slug,
        url,
        paginationId,
        deleteCSVCols: [paginationId, "generator_id"]
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
  GeneratorTable as default
};

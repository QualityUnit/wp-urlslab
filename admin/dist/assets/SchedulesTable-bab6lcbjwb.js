import { r as reactExports, R as React, L as Loader } from "../main-bab6lcbjwb.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, S as SvgIconTrash, M as ModuleViewHeaderBottom, c as Table, T as Tooltip } from "./useTableUpdater-bab6lcbjwb.js";
import { C as Checkbox } from "./datepicker-bab6lcbjwb.js";
import "./useMutation-bab6lcbjwb.js";
function SchedulesTable({ slug }) {
  var _a;
  const pageId = "schedule_id";
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
  const { row, selectRow, deleteRow } = useChangeRow({ data, url, slug, pageId });
  const followLinksTypes = {
    FOLLOW_ALL_LINKS: __("Follow all links"),
    FOLLOW_NO_LINK: __("Do not follow")
  };
  const scanFrequencyTypes = {
    ONE_TIME: "One Time",
    YEARLY: "Yearly",
    MONTHLY: "Monthly",
    DAILY: "Daily",
    WEEKLY: "Weekly",
    HOURLY: "Hourly"
  };
  const header = {
    urls: __("URLs"),
    analyze_text: __("Analyze text"),
    follow_links: __("Follow links"),
    process_all_sitemaps: __("Process all sitemaps"),
    take_screenshot: __("Take screenshot"),
    custom_sitemaps: __("Sitemaps"),
    scan_frequency: __("Scan frequency"),
    scan_speed_per_minute: __("Scan speed per min.")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("urls", {
      className: "nolimit",
      cell: (array) => array == null ? void 0 : array.getValue().map(
        (link) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", { href: link, target: "_blank", rel: "noreferrer", key: link }, link), ", ")
      ),
      header: header.urls,
      size: 300
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("analyze_text", {
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { readOnly: true, className: "readOnly", checked: cell.getValue() }),
      header: header.analyze_text,
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("follow_links", {
      cell: (cell) => followLinksTypes[cell == null ? void 0 : cell.getValue()],
      header: header.follow_links,
      size: 150
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("process_all_sitemaps", {
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { readOnly: true, className: "readOnly", checked: cell.getValue() }),
      header: header.process_all_sitemaps,
      size: 150
    }),
    columnHelper.accessor("scan_frequency", {
      cell: (cell) => scanFrequencyTypes[cell == null ? void 0 : cell.getValue()],
      header: header.scan_frequency,
      size: 90
    }),
    columnHelper.accessor("scan_speed_per_minute", {
      header: header.scan_speed_per_minute,
      size: 120
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("take_screenshot", {
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { readOnly: true, className: "readOnly", checked: cell.getValue() }),
      header: header.take_screenshot,
      size: 90
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("custom_sitemaps", {
      className: "nolimit",
      cell: (array) => array == null ? void 0 : array.getValue().map(
        (sitemap) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", { href: sitemap, target: "_blank", rel: "noreferrer", key: sitemap }, sitemap), ", ")
      ),
      header: header.custom_sitemaps,
      size: 300
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
      noCount: true,
      noExport: true,
      noDelete: true,
      onSort: (val) => sortBy(val),
      onFilter: (filter) => setFilters(filter)
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "noHeightLimit fadeInto",
      slug,
      returnTable: (returnTable) => setTable(returnTable),
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.url_name} “${row.url_name}”`, " has been deleted.") : null,
    /* @__PURE__ */ React.createElement("button", { ref }, isFetchingNextPage ? "Loading more..." : hasNextPage)
  ));
}
export {
  SchedulesTable as default
};

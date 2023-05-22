import { R as React, L as Loader, i as Tooltip } from "../main-wr0uobcc1sl.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as SortBy, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-wr0uobcc1sl.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-wr0uobcc1sl.js";
import "./MultiSelectMenu-wr0uobcc1sl.js";
import { I as InputField, S as SortMenu } from "./datepicker-wr0uobcc1sl.js";
import { C as Checkbox } from "./Checkbox-wr0uobcc1sl.js";
/* empty css                               */function SchedulesTable({ slug }) {
  var _a;
  const paginationId = "schedule_id";
  const { table, setTable, filters, sorting, sortBy } = useTableUpdater({ slug });
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
  const { row, selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, setActivePanel, deleteRow, deleteSelectedRows } = useChangeRow({ data, url, slug, paginationId });
  const followLinksTypes = {
    FOLLOW_ALL_LINKS: __("Follow all links"),
    FOLLOW_NO_LINK: __("Do not follow")
  };
  const analyzeTextTypes = {
    1: __("Analyze page text (Recommended)"),
    0: __("Do not analyze text")
  };
  const processSitemapsTypes = {
    1: __("Process all sitemaps of domain (Recommended)"),
    0: __("Schedule just single URL")
  };
  const takeScreenshotsTypes = {
    1: __("Screenshot every page of domain (Recommended)"),
    0: __("Do not take screenshots")
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
    analyze_text: __("Analyse text"),
    follow_links: __("Follow links"),
    process_all_sitemaps: __("Process all sitemaps"),
    take_screenshot: __("Take screenshots"),
    custom_sitemaps: __("Sitemaps"),
    scan_frequency: __("Scan frequency"),
    scan_speed_per_minute: __("Scan speed (pages per minute)")
  };
  const rowEditorCells = {
    urls: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.urls, onChange: (val) => setEditorRow({ ...rowToEdit, urls: val }), required: true }),
    analyze_text: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: analyzeTextTypes, name: "analyze_text", defaultValue: "1", onChange: (val) => setEditorRow({ ...rowToEdit, analyze_text: val }) }, header.analyze_text),
    follow_links: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: followLinksTypes, name: "follow_links", defaultValue: "FOLLOW_ALL_LINKS", onChange: (val) => setEditorRow({ ...rowToEdit, follow_links: val }) }, header.follow_links),
    process_all_sitemaps: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: processSitemapsTypes, name: "process_all", defaultValue: "1", onChange: (val) => setEditorRow({ ...rowToEdit, process_all_sitemaps: val }) }, header.process_all_sitemaps),
    custom_sitemaps: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.custom_sitemaps, onChange: (val) => setEditorRow({ ...rowToEdit, custom_sitemaps: val }) }),
    take_screenshot: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: takeScreenshotsTypes, name: "take_screenshot", defaultValue: "1", onChange: (val) => setEditorRow({ ...rowToEdit, take_screenshot: val }) }, header.take_screenshot),
    scan_frequency: /* @__PURE__ */ React.createElement(SortMenu, { defaultAccept: true, autoClose: true, items: scanFrequencyTypes, name: "scan_frequency", defaultValue: "ONE_TIME", onChange: (val) => setEditorRow({ ...rowToEdit, scan_frequency: val }) }, header.scan_frequency),
    scan_speed_per_minute: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "20", label: header.scan_speed_per_minute, onChange: (val) => setEditorRow({ ...rowToEdit, scan_speed_per_minute: val }) })
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("urls", {
      className: "nolimit",
      cell: (array) => array == null ? void 0 : array.getValue().map(
        (link) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", { href: link, target: "_blank", rel: "noreferrer", key: link }, link), ", ")
      ),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.urls),
      size: 300
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("follow_links", {
      filterValMenu: followLinksTypes,
      cell: (cell) => followLinksTypes[cell == null ? void 0 : cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.follow_links),
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("analyze_text", {
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { readOnly: true, className: "readOnly", defaultValue: cell.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.analyze_text),
      size: 90
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("take_screenshot", {
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { readOnly: true, className: "readOnly", defaultValue: cell.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.take_screenshot),
      size: 90
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("process_all_sitemaps", {
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { readOnly: true, className: "readOnly", defaultValue: cell.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.process_all_sitemaps),
      size: 90
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("custom_sitemaps", {
      cell: (array) => array == null ? void 0 : array.getValue().map(
        (sitemap) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", { href: sitemap, target: "_blank", rel: "noreferrer", key: sitemap }, sitemap), ", ")
      ),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.custom_sitemaps),
      size: 150
    }),
    columnHelper.accessor("scan_frequency", {
      filterValMenu: scanFrequencyTypes,
      cell: (cell) => scanFrequencyTypes[cell == null ? void 0 : cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.scan_frequency),
      size: 90
    }),
    columnHelper.accessor("scan_speed_per_minute", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.scan_speed_per_minute),
      size: 90
    }),
    columnHelper.accessor("editRow", {
      className: "editRow",
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ cell }) }),
      header: null,
      size: 60
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
      noFiltering: true,
      noCount: true,
      noExport: true,
      noDelete: true,
      selectedRows,
      onDeleteSelected: deleteSelectedRows,
      onUpdateRow: (val) => {
        setActivePanel();
        setEditorRow();
        if (val === "rowInserted" || val === "rowChanged") {
          setActivePanel();
          setEditorRow(val);
          setTimeout(() => {
            setEditorRow();
          }, 3e3);
        }
      },
      activatePanel: activePanel,
      rowEditorOptions: { rowEditorCells, title: "Add schedule", data, slug, url, paginationId, rowToEdit }
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
    rowToEdit === "rowChanged" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Schedule has been changed.")) : null,
    rowToEdit === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Schedule has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  SchedulesTable as default
};

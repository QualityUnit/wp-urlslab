import { R as React, l as Tooltip, L as Loader } from "../main-a2rky156fof.js";
import { a as useTableUpdater, b as useInfiniteFetch, c as useChangeRow, d as useTablePanels, e as SortBy, D as DateTimeFormat, S as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, P as ProgressBar } from "./ModuleViewHeaderBottom-a2rky156fof.js";
import { T as TagsMenu } from "./TagsMenu-a2rky156fof.js";
import { T as TooltipSortingFiltering } from "./Tooltip_SortingFiltering-a2rky156fof.js";
import { C as Checkbox } from "./MultiSelectMenu-a2rky156fof.js";
import { S as SortMenu } from "./datepicker-a2rky156fof.js";
import { S as SvgIconLink } from "./icon-link-a2rky156fof.js";
function LinkManagerTable({ slug }) {
  var _a;
  const paginationId = "url_id";
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
  const httpStatusTypes = {
    "-2": __("Processing"),
    "-1": __("Waiting"),
    200: __("Valid"),
    400: __("Client Error"),
    301: __("Moved Permanently"),
    302: __("Found, Moved temporarily"),
    307: __("Temporary Redirect"),
    308: __("Permanent Redirect"),
    404: __("Not Found"),
    500: __("Server Error"),
    503: __("Server Error")
  };
  const visibilityTypes = {
    V: __("Visible"),
    H: __("Hidden")
  };
  ({
    I: __("Internal"),
    E: __("External")
  });
  const header = {
    url_name: __("URL"),
    url_title: __("Title"),
    url_h1: __("H1"),
    url_meta_description: __("Description"),
    url_summary: __("Summary"),
    http_status: __("Status"),
    labels: __("Tags"),
    // sum_status: __( 'Summary Status' ),
    // update_sum_date: __( 'Summary Updated' ),
    url_links_count: __("Outgoing links count"),
    url_usage_count: __("Incoming links count"),
    visibility: __("Visibility"),
    update_http_date: __("Last change")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { defaultValue: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_name),
      size: 200
    }),
    columnHelper.accessor("url_title", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, { className: "xxl" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_title),
      size: 120
    }),
    columnHelper.accessor("url_h1", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, { className: "xxl" }, cell.getValue()),
      header: header.url_h1,
      size: 120
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("url_meta_description", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, { className: "xxl" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_meta_description),
      size: 120
    }),
    columnHelper.accessor("url_summary", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, { className: "xxl" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_summary),
      size: 200
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("http_status", {
      filterValMenu: httpStatusTypes,
      cell: (cell) => httpStatusTypes[cell.getValue()],
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.http_status),
      size: 80
    }),
    columnHelper.accessor("visibility", {
      filterValMenu: visibilityTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        SortMenu,
        {
          items: visibilityTypes,
          name: cell.column.id,
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.visibility),
      size: 80
    }),
    columnHelper.accessor("update_http_date", {
      cell: (val) => /* @__PURE__ */ React.createElement(DateTimeFormat, { datetime: val.getValue() }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.update_http_date),
      size: 115
    }),
    columnHelper.accessor("url_links_count", {
      cell: (cell) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, cell == null ? void 0 : cell.getValue(), (cell == null ? void 0 : cell.getValue()) > 0 && /* @__PURE__ */ React.createElement("button", { className: "ml-s", onClick: () => {
        setOptions({
          ...options,
          detailsOptions: {
            title: `Outgoing Links`,
            text: `From: ${cell.row.original.url_name}`,
            slug,
            url: `${cell.row.original.url_id}/links`,
            showKeys: ["dest_url_name"],
            listId: "dest_url_id"
          }
        });
        activatePanel("details");
      } }, /* @__PURE__ */ React.createElement(SvgIconLink, null), /* @__PURE__ */ React.createElement(Tooltip, null, __("Show URLs where used")))),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_links_count),
      size: 70
    }),
    columnHelper.accessor("url_usage_count", {
      cell: (cell) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, cell == null ? void 0 : cell.getValue(), (cell == null ? void 0 : cell.getValue()) > 0 && /* @__PURE__ */ React.createElement("button", { className: "ml-s", onClick: () => {
        setOptions({
          ...options,
          detailsOptions: {
            title: `Link found in following pages`,
            text: `Link: ${cell.row.original.url_name}`,
            slug,
            url: `${cell.row.original.url_id}/linked-from`,
            showKeys: ["src_url_name"],
            listId: "src_url_id"
          }
        });
        activatePanel("details");
      } }, /* @__PURE__ */ React.createElement(SvgIconLink, null), /* @__PURE__ */ React.createElement(Tooltip, null, __("Show URLs where used")))),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.url_usage_count),
      size: 70
    }),
    columnHelper.accessor("labels", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(TagsMenu, { defaultValue: cell.getValue(), slug, onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.labels,
      size: 160
    }),
    columnHelper.accessor("editRow", {
      className: "editRow",
      cell: (cell) => /* @__PURE__ */ React.createElement(SvgIconTrash, { onClick: () => deleteRow({ cell, id: "url_name" }) }),
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
      onDeleteSelected: () => deleteSelectedRows({ id: "url_name" }),
      onFilter: (filter) => setFilters(filter),
      options: {
        header,
        data,
        slug,
        paginationId,
        url,
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
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  LinkManagerTable as default
};

import { r as reactExports, R as React, T as Tooltip, L as Loader } from "../main-djykm1j602.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, L as LangMenu, S as SortBy, c as SvgIconTrash, M as ModuleViewHeaderBottom, T as Table, d as TooltipSortingFiltering, P as ProgressBar } from "./useTableUpdater-djykm1j602.js";
import { I as InputField, S as SortMenu, C as Checkbox } from "./datepicker-djykm1j602.js";
import { S as SvgIconLink } from "./icon-link-djykm1j602.js";
import "./useMutation-djykm1j602.js";
function KeywordsTable({ slug }) {
  var _a;
  const paginationId = "kw_id";
  const { table, setTable, rowToInsert, setInsertRow, filters, setFilters, sorting, sortBy } = useTableUpdater({ slug });
  const url = { filters, sorting };
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
  } = useInfiniteFetch({ key: slug, filters, sorting, paginationId });
  const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow({ data, url, slug, paginationId });
  const keywordTypes = {
    M: __("Manual"),
    I: __("Imported"),
    X: __("None")
  };
  const header = {
    keyword: __("Keyword"),
    urlLink: __("Link"),
    kwType: __("Type"),
    kw_length: __("Length"),
    kw_priority: __("Priority"),
    kw_usage_count: __("Usage"),
    lang: __("Language"),
    urlFilter: __("URL filter")
  };
  const inserterCells = {
    keyword: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.keyword, onChange: (val) => setInsertRow({ ...rowToInsert, keyword: val }), required: true }),
    urlLink: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "url", defaultValue: "", label: header.urlLink, onChange: (val) => setInsertRow({ ...rowToInsert, urlLink: val }), required: true }),
    kwType: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: keywordTypes, name: "kwType", checkedId: "M", onChange: (val) => setInsertRow({ ...rowToInsert, kwType: val }) }, header.kwType),
    kw_priority: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "number", defaultValue: "0", min: "0", max: "255", label: header.kw_priority, onChange: (val) => setInsertRow({ ...rowToInsert, kw_priority: val }) }),
    lang: /* @__PURE__ */ React.createElement(LangMenu, { autoClose: true, checkedId: "all", onChange: (val) => setInsertRow({ ...rowToInsert, lang: val }) }, __("Language")),
    urlFilter: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.urlFilter, onChange: (val) => setInsertRow({ ...rowToInsert, urlFilter: val }) })
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: () => /* @__PURE__ */ React.createElement(Checkbox, { onChange: () => console.log(data == null ? void 0 : data.pages) }),
      enableResizing: false
    }),
    columnHelper.accessor("keyword", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("strong", null, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.keyword),
      minSize: 150
    }),
    columnHelper.accessor("urlLink", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.urlLink),
      enableResizing: false,
      size: 350
    }),
    columnHelper.accessor("kwType", {
      filterValMenu: keywordTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: keywordTypes, name: cell.column.id, checkedId: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kwType),
      size: 100
    }),
    columnHelper.accessor("kw_length", {
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kw_length),
      size: 80
    }),
    columnHelper.accessor("kw_priority", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          type: "number",
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kw_priority),
      size: 80
    }),
    columnHelper.accessor("lang", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        LangMenu,
        {
          checkedId: cell == null ? void 0 : cell.getValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.lang),
      size: 165
    }),
    columnHelper.accessor("kw_usage_count", {
      cell: (cell) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-align-center" }, cell == null ? void 0 : cell.getValue(), (cell == null ? void 0 : cell.getValue()) > 0 && /* @__PURE__ */ React.createElement("button", { className: "ml-s", onClick: () => setDetailsOptions({
        title: `Keyword “${cell.row.original.keyword}” used on these URLs`,
        slug,
        url: `${cell.row.original.kw_id}/${cell.row.original.dest_url_id}`,
        showKeys: ["link_type", "url_name"],
        listId: "url_id"
      }) }, /* @__PURE__ */ React.createElement(SvgIconLink, null), /* @__PURE__ */ React.createElement(Tooltip, null, __("Show URLs where used")))),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.kw_usage_count),
      size: 70
    }),
    columnHelper.accessor("urlFilter", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          defaultValue: cell.renderValue(),
          onChange: (newVal) => updateRow({ newVal, cell })
        }
      ),
      header: (th) => /* @__PURE__ */ React.createElement(SortBy, { props: { header, sorting, th, onClick: () => sortBy(th) } }, header.urlFilter),
      size: 100
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
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
      slug,
      header,
      table,
      selectedRows,
      onDeleteSelected: deleteSelectedRows,
      onFilter: (filter) => setFilters(filter),
      onClearRow: (clear) => {
        setInsertRow();
        if (clear === "rowInserted") {
          setInsertRow(clear);
          setTimeout(() => {
            setInsertRow();
          }, 3e3);
        }
      },
      detailsOptions,
      insertOptions: { inserterCells, title: "Add keyword", data, slug, url, paginationId, rowToInsert },
      exportOptions: {
        slug,
        url,
        paginationId,
        deleteCSVCols: [paginationId, "dest_url_id"]
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.keyword} “${row.keyword}”`, " ", __("has been deleted.")) : null,
    rowToInsert === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Keyword has been added.")) : null,
    /* @__PURE__ */ React.createElement(TooltipSortingFiltering, { props: { isFetching, filters, sorting } }),
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  KeywordsTable as default
};

import { r as reactExports, R as React, L as Loader } from "../main-k19bbel4pvg.js";
import { u as useTableUpdater, a as useInfiniteFetch, b as useChangeRow, L as LangMenu, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, c as Table, P as ProgressBar } from "./useTableUpdater-k19bbel4pvg.js";
import { I as InputField, S as SortMenu, C as Checkbox } from "./datepicker-k19bbel4pvg.js";
import { S as SvgIconLink } from "./icon-link-k19bbel4pvg.js";
import "./useMutation-k19bbel4pvg.js";
function KeywordsTable({ slug }) {
  var _a;
  const pageId = "kw_id";
  const { table, setTable, rowToInsert, setInsertRow, filters, setFilters, sortingColumn, sortBy } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn}`, [filters, sortingColumn]);
  const [detailsOptions, setDetailsOptions] = reactExports.useState(null);
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
  const { row, rowsSelected, selectRow, deleteRow, updateRow } = useChangeRow({ data, url, slug, pageId });
  const keywordTypes = {
    M: __("Manual"),
    I: __("Imported"),
    X: __("None")
  };
  const header = {
    keyword: __("Keyword"),
    kwType: __("Type"),
    kw_length: __("Length"),
    kw_priority: __("Priority"),
    kw_usage_count: __("Usage"),
    lang: __("Language"),
    urlFilter: __("URL Filter"),
    urlLink: __("Link")
  };
  const inserterCells = {
    keyword: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.keyword, onChange: (val) => setInsertRow({ ...rowToInsert, keyword: val }), required: true }),
    kwType: /* @__PURE__ */ React.createElement(SortMenu, { autoClose: true, items: keywordTypes, name: "kwType", checkedId: "M", onChange: (val) => setInsertRow({ ...rowToInsert, kwType: val }) }, header.kwType),
    kw_priority: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "number", defaultValue: "0", min: "0", max: "255", label: header.kw_priority, onChange: (val) => setInsertRow({ ...rowToInsert, kw_priority: val }) }),
    lang: /* @__PURE__ */ React.createElement(LangMenu, { autoClose: true, checkedId: "all", onChange: (val) => setInsertRow({ ...rowToInsert, lang: val }) }, __("Language")),
    urlFilter: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, defaultValue: "", label: header.urlFilter, onChange: (val) => setInsertRow({ ...rowToInsert, urlFilter: val }) }),
    urlLink: /* @__PURE__ */ React.createElement(InputField, { liveUpdate: true, type: "url", defaultValue: "", label: header.urlLink, onChange: (val) => setInsertRow({ ...rowToInsert, urlLink: val }), required: true })
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        selectRow(val, cell);
      } }),
      header: null,
      enableResizing: false
    }),
    columnHelper.accessor("keyword", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      header: header.keyword,
      minSize: 150
    }),
    columnHelper.accessor("kwType", {
      filterValMenu: keywordTypes,
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: keywordTypes, name: cell.column.id, checkedId: cell.getValue(), onChange: (newVal) => updateRow({ newVal, cell }) }),
      header: header.kwType,
      size: 100
    }),
    columnHelper.accessor("kw_length", {
      header: header.kw_length,
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
      header: header.kw_priority,
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
      header: header.lang,
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
      header: header.kw_usage_count,
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
      header: header.urlFilter,
      size: 100
    }),
    columnHelper.accessor("urlLink", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: header.urlLink,
      enableResizing: false,
      size: 350
    }),
    columnHelper.accessor("delete", {
      className: "deleteRow",
      tooltip: () => /* @__PURE__ */ React.createElement(Tooltip, { className: "align-left xxxl" }, __("Delete row")),
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
      rowsSelected,
      onSort: (val) => sortBy(val),
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
      insertOptions: { inserterCells, title: "Add keyword", data, slug, url, pageId, rowToInsert },
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.keyword} “${row.keyword}”`, " ", __("has been deleted.")) : null,
    rowToInsert === "rowInserted" ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, __("Keyword has been added.")) : null,
    /* @__PURE__ */ React.createElement("div", { ref }, isFetchingNextPage ? "" : hasNextPage, /* @__PURE__ */ React.createElement(ProgressBar, { className: "infiniteScroll", value: !isFetchingNextPage ? 0 : 100 }))
  ));
}
export {
  KeywordsTable as default
};

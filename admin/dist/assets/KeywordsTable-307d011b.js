import { a as useQueryClient, r as reactExports, R as React, L as Loader } from "../settings.js";
import { u as useTableUpdater, a as useInfiniteFetch, h as handleSelected, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, b as Table } from "./useTableUpdater-70a88a8a.js";
import { S as SortMenu, I as InputField, C as Checkbox } from "./datepicker-3a15b4e5.js";
import "./useMutation-1e5291cb.js";
function LangMenu({ noAll, isFilter, children, onChange, checkedId }) {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["languages"]);
  const langs = reactExports.useMemo(() => {
    if (noAll) {
      delete data.all;
    }
    return data;
  }, [data, noAll]);
  const handleSelected2 = (lang) => {
    if (onChange) {
      onChange(lang);
    }
  };
  return langs ? /* @__PURE__ */ React.createElement(
    SortMenu,
    {
      items: langs,
      isFilter,
      name: "languages",
      checkedId,
      onChange: (lang) => handleSelected2(lang)
    },
    children
  ) : /* @__PURE__ */ React.createElement(InputField, { defaultValue: checkedId, onChange: (lang) => handleSelected2(lang) });
}
function KeywordsTable({ slug }) {
  var _a;
  const { table, setTable, filters, setFilters, currentFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn}`, [filters, sortingColumn]);
  const pageId = "kw_id";
  const {
    __,
    columnHelper,
    data,
    // activeFilters,
    status,
    isSuccess,
    isFetchingNextPage,
    hasNextPage,
    ref
  } = useInfiniteFetch({ key: slug, url, pageId, currentFilters, sortingColumn });
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
    link_usage_count: __("Link Usage"),
    urlFilter: __("URL Filter"),
    urlLink: __("Link")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        handleSelected(val, cell);
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
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: keywordTypes, name: cell.column.id, checkedId: cell.getValue(), onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId }) }),
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
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
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
          noAll: true,
          checkedId: cell == null ? void 0 : cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
        }
      ),
      header: header.lang,
      size: 165
    }),
    columnHelper.accessor("kw_usage_count", {
      header: header.kw_usage_count,
      size: 70
    }),
    columnHelper.accessor("link_usage_count", {
      header: header.link_usage_count,
      size: 100
    }),
    columnHelper.accessor("urlFilter", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          defaultValue: cell.renderValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
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
      header,
      table,
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
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.keyword} “${row.keyword}”`, " ", __("has been deleted.")) : null,
    /* @__PURE__ */ React.createElement("button", { ref }, isFetchingNextPage ? "Loading more..." : hasNextPage)
  ));
}
export {
  KeywordsTable as default
};

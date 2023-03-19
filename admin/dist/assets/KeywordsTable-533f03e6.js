import { a as useQueryClient, r as reactExports, R as React, L as Loader } from "../settings.js";
import { u as useTableUpdater, a as useInfiniteFetch, h as handleSelected, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, b as Table } from "./useTableUpdater-eb9e545c.js";
import { S as SortMenu, C as Checkbox } from "./datepicker-ff7dcd9b.js";
import { I as InputField } from "./InputField-36e1e240.js";
import { M as MenuInput } from "./MenuInput-e2b033a0.js";
import "./useMutation-6f0dd623.js";
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
  return /* @__PURE__ */ React.createElement(
    SortMenu,
    {
      items: langs,
      isFilter,
      name: "languages",
      checkedId,
      onChange: (lang) => handleSelected2(lang)
    },
    children
  );
}
function KeywordsTable({ slug }) {
  var _a;
  const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn}`, [filters, sortingColumn]);
  const pageId = "kw_id";
  const {
    __,
    columnHelper,
    data,
    activeFilters,
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
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Filter keyword", defaultValue: currentFilters.keyword, onChange: (val) => addFilter("keyword", val) }, header.keyword),
      minSize: 150
    }),
    columnHelper.accessor("kwType", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { items: keywordTypes, name: cell.column.id, checkedId: cell.getValue(), onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId }) }),
      header: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { isFilter: true, items: keywordTypes, name: cell.column.id, checkedId: currentFilters.kwType || "", onChange: (val) => addFilter("kwType", val) }, header.kwType),
      size: 100
    }),
    columnHelper.accessor("kw_length", {
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Filter kw length", defaultValue: currentFilters.kw_length, onChange: (val) => addFilter("kw_length", val) }, header.kw_length),
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
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Filter priority", defaultValue: currentFilters.kw_priority, onChange: (val) => addFilter("kw_priority", val) }, header.kw_priority),
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
      header: () => /* @__PURE__ */ React.createElement(LangMenu, { noAll: true, isFilter: true, checkedId: currentFilters.lang || "all", onChange: (val) => addFilter("lang", val) }, header.lang),
      size: 165
    }),
    columnHelper.accessor("kw_usage_count", {
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Filter Usage count", defaultValue: currentFilters.kw_usage_count, onChange: (val) => addFilter("kw_usage_count", val) }, header.kw_usage_count),
      size: 70
    }),
    columnHelper.accessor("link_usage_count", {
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Filter URL usage", defaultValue: currentFilters.link_usage_count, onChange: (val) => addFilter("link_usage_count", val) }, header.link_usage_count),
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
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Filter by URL filter", defaultValue: currentFilters.urlFilter, onChange: (val) => addFilter("urlFilter", val) }, header.urlFilter),
      size: 100
    }),
    columnHelper.accessor("urlLink", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Filter URL", onChange: (val) => addFilter("urlLink", val) }, header.urlLink),
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
      currentFilters: activeFilters ? activeFilters : currentFilters,
      header,
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
      slug,
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

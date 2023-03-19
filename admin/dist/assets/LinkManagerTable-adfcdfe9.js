import { r as reactExports, R as React, L as Loader } from "../settings.js";
import { u as useTableUpdater, a as useInfiniteFetch, h as handleSelected, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, b as Table } from "./useTableUpdater-eb9e545c.js";
import { C as Checkbox, S as SortMenu } from "./datepicker-ff7dcd9b.js";
import { I as InputField } from "./InputField-36e1e240.js";
import { M as MenuInput } from "./MenuInput-e2b033a0.js";
import "./useMutation-6f0dd623.js";
function LinkManagerTable({ slug }) {
  var _a;
  const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater({ slug });
  const url = reactExports.useMemo(() => `${filters}${sortingColumn || "&sort_column=url_name&sort_direction=ASC"}`, [filters, sortingColumn]);
  const pageId = "url_id";
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
  const httpStatusTypes = {
    "-2": __("Processing"),
    "-1": __("Waiting"),
    200: __("Valid"),
    400: __("Client Error"),
    404: __("Not Found"),
    500: __("Server Error"),
    503: __("Server Error")
  };
  const visibilityTypes = {
    V: __("Visible"),
    H: __("Hidden")
  };
  const urlTypes = {
    I: __("Internal"),
    E: __("External")
  };
  const header = {
    url_name: __("URL"),
    url_title: __("Title"),
    url_meta_description: __("Description"),
    url_summary: __("Summary"),
    http_status: __("Status"),
    // sum_status: __( 'Summary Status' ),
    // update_sum_date: __( 'Summary Updated' ),
    visibility: __("Visibility"),
    url_type: __("URL Type"),
    update_http_date: __("Status Updated")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        handleSelected(val, cell);
      } }),
      header: null
    }),
    columnHelper.accessor("url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter URL Desc", defaultValue: currentFilters.url_name, onChange: (val) => addFilter("url_name", val) }, header.url_name),
      size: 200
    }),
    columnHelper.accessor("url_title", {
      className: "nolimit",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
        }
      ),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter URL Title", defaultValue: currentFilters.url_title, onChange: (val) => addFilter("url_title", val) }, header.url_title),
      size: 150
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("url_meta_description", {
      className: "nolimit",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
        }
      ),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter URL Desc", defaultValue: currentFilters.url_meta_description, onChange: (val) => addFilter("urlFilter", val) }, header.url_meta_description),
      size: 100
    }),
    columnHelper.accessor("url_summary", {
      className: "nolimit",
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement(
        InputField,
        {
          defaultValue: cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
        }
      ),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter Text", defaultValue: currentFilters.url_summary, onChange: (val) => addFilter("url_summary", val) }, header.url_summary),
      size: 150
    }),
    // columnHelper?.accessor( 'sum_status', {
    // 	className: 'nolimit',
    // 	cell: ( cell ) => <SortMenu
    // 		items={ sumStatusTypes }
    // 		name={ cell.column.id }
    // 		checkedId={ cell.getValue() }
    // 		onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
    // 	header: ( cell ) => <SortMenu isFilter items={ sumStatusTypes } name={ cell.column.id } checkedId={ currentFilters.sum_status || '' } onChange={ ( val ) => addFilter( 'sum_status', val ) }>{ header.sum_status }</SortMenu>,
    // 	size: 100,
    // } ),
    // columnHelper.accessor( 'update_sum_date', {
    // 	className: 'nolimit',
    // 	cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
    // 	header: () => header.update_sum_date,
    // 	size: 120,
    // } ),
    columnHelper == null ? void 0 : columnHelper.accessor("http_status", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        SortMenu,
        {
          items: httpStatusTypes,
          name: cell.column.id,
          checkedId: cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
        }
      ),
      header: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { isFilter: true, items: httpStatusTypes, name: cell.column.id, checkedId: currentFilters.http_status || "", onChange: (val) => addFilter("http_status", val) }, header.http_status),
      size: 100
    }),
    columnHelper.accessor("visibility", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        SortMenu,
        {
          items: visibilityTypes,
          name: cell.column.id,
          checkedId: cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
        }
      ),
      header: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { isFilter: true, items: visibilityTypes, name: cell.column.id, checkedId: currentFilters.visibility || "", onChange: (val) => addFilter("visibility", val) }, header.visibility),
      size: 100
    }),
    columnHelper.accessor("url_type", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        SortMenu,
        {
          items: urlTypes,
          name: cell.column.id,
          checkedId: cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
        }
      ),
      header: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { isFilter: true, items: urlTypes, name: cell.column.id, checkedId: currentFilters.url_type || "", onChange: (val) => addFilter("url_type", val) }, header.url_type),
      size: 100
    }),
    columnHelper.accessor("update_http_date", {
      cell: (val) => new Date(val == null ? void 0 : val.getValue()).toLocaleString(window.navigator.language),
      header: () => header.update_http_date,
      size: 140
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
      removeFilters: (key) => removeFilters(key),
      onSort: (val) => sortBy(val),
      noImport: true,
      exportOptions: {
        url: slug,
        filters,
        fromId: `from_${pageId}`,
        pageId,
        deleteCSVCols: ["urlslab_url_id", "url_id", "urlslab_domain_id"],
        perPage: 1e3
      }
    }
  ), /* @__PURE__ */ React.createElement(
    Table,
    {
      className: "fadeInto",
      columns,
      data: isSuccess && ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page ?? []))
    },
    row ? /* @__PURE__ */ React.createElement(Tooltip, { center: true }, `${header.url_name} “${row.url_name}”`, " has been deleted.") : null,
    /* @__PURE__ */ React.createElement("button", { ref }, isFetchingNextPage ? "Loading more..." : hasNextPage)
  ));
}
export {
  LinkManagerTable as default
};

import { r as reactExports, R as React, L as Loader } from "../settings.js";
import { u as useTableUpdater, a as useInfiniteFetch, h as handleSelected, T as Tooltip, S as SvgIconTrash, M as ModuleViewHeaderBottom, b as Table } from "./useTableUpdater-eb9e545c.js";
import { H as Ht } from "./index-9c451914.js";
import { C as Checkbox, S as SortMenu } from "./datepicker-ff7dcd9b.js";
import { I as InputField } from "./InputField-36e1e240.js";
import { M as MenuInput } from "./MenuInput-e2b033a0.js";
import "./useMutation-6f0dd623.js";
function ScreenshotTable({ slug }) {
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
  const scrStatusTypes = {
    N: __("Waiting"),
    A: __("Awailable"),
    P: __("Pending"),
    E: __("Disabled")
  };
  const header = {
    url_name: __("Destination URL"),
    url_title: __("Title"),
    scr_status: __("Status"),
    screenshot_url: __("Screenshot URL"),
    update_scr_date: __("Updated at")
  };
  const columns = [
    columnHelper.accessor("check", {
      className: "checkbox",
      cell: (cell) => /* @__PURE__ */ React.createElement(Checkbox, { checked: cell.row.getIsSelected(), onChange: (val) => {
        handleSelected(val, cell);
      } }),
      header: null
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("screenshot_url", {
      className: "thumbnail",
      cell: (image) => (image == null ? void 0 : image.getValue()) ? /* @__PURE__ */ React.createElement("a", { href: image == null ? void 0 : image.getValue(), target: "_blank", rel: "noreferrer" }, /* @__PURE__ */ React.createElement("img", { src: image == null ? void 0 : image.getValue(), alt: image.row.original.url_name })) : /* @__PURE__ */ React.createElement("div", { className: "img" }),
      header: __("Thumbnail"),
      size: 90
    }),
    columnHelper.accessor("url_name", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), title: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter URL Desc", defaultValue: currentFilters.url_name, onChange: (val) => addFilter("url_name", val) }, header.url_name),
      size: 250
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
      size: 200
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("scr_status", {
      className: "nolimit",
      cell: (cell) => /* @__PURE__ */ React.createElement(
        SortMenu,
        {
          items: scrStatusTypes,
          name: cell.column.id,
          checkedId: cell.getValue(),
          onChange: (newVal) => updateRow({ data, newVal, url, slug, cell, rowSelector: pageId })
        }
      ),
      header: (cell) => /* @__PURE__ */ React.createElement(SortMenu, { isFilter: true, items: scrStatusTypes, name: cell.column.id, checkedId: currentFilters.scr_status || "", onChange: (val) => addFilter("scr_status", val) }, header.scr_status),
      size: 100
    }),
    columnHelper == null ? void 0 : columnHelper.accessor("screenshot_url", {
      tooltip: (cell) => /* @__PURE__ */ React.createElement(Tooltip, null, cell.getValue()),
      cell: (cell) => /* @__PURE__ */ React.createElement("a", { href: cell.getValue(), target: "_blank", rel: "noreferrer" }, cell.getValue()),
      header: () => /* @__PURE__ */ React.createElement(MenuInput, { isFilter: true, placeholder: "Enter URL Desc", defaultValue: currentFilters.screenshot_url, onChange: (val) => addFilter("screenshot_url", val) }, header.screenshot_url),
      size: 250
    }),
    columnHelper.accessor("update_scr_date", {
      cell: (val) => new Date(val == null ? void 0 : val.getValue()).toLocaleString(window.navigator.language),
      header: () => /* @__PURE__ */ React.createElement("div", { className: "urlslab-FilterMenu urlslab-inputField-datetime" }, /* @__PURE__ */ React.createElement("div", { className: "urlslab-FilterMenu__title" }, /* @__PURE__ */ React.createElement(
        Ht,
        {
          placeholderText: header.update_scr_date,
          dateFormat: "dd. MMMM yyyy, HH:mm",
          timeFormat: "HH:mm",
          onChange: (val) => {
            const date = new Date(val).toISOString().replace(/^(.+?)T(.+?)\..+$/g, "$1 $2");
            addFilter("update_scr_date", date);
          }
        }
      ))),
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
      defaultSortBy: "url_name&ASC",
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
  ScreenshotTable as default
};
